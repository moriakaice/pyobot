const Datastore = require('nedb')
const configuration = require('../configuration/configuration.json')
const dicts = require('./dicts.js')
const logger = require('./logger.js')
const time = require('./time.js')
const osm = require('./api/osm.js')
const postcodesIo = require('./api/postcodes.io.js')
const discordAPI = require('./api/discord.js')
const facebookAPI = require('./api/facebook.js')
const firebase = require('./api/firebase.js')
const distance = require('./distance.js')
const abyo = require('../abyo/abyo.js')
const db = new Datastore({ filename: __dirname + '/../db/pokemon.db', autoload: true })

const tubeStations = require('../db/tube-stations.json')
const dlrStations = require('../db/dlr-stations.json')
const railwayStations = require('../db/railway-stations.json')

const historical = {}

const queue = []
let processing = false

const cpm = [0.094, 0.16639787, 0.21573247, 0.25572005, 0.29024988,
  0.3210876, 0.34921268, 0.37523559, 0.39956728, 0.42250001,
  0.44310755, 0.46279839, 0.48168495, 0.49985844, 0.51739395,
  0.53435433, 0.55079269, 0.56675452, 0.58227891, 0.59740001,
  0.61215729, 0.62656713, 0.64065295, 0.65443563, 0.667934,
  0.68116492, 0.69414365, 0.70688421, 0.71939909, 0.7317,
  0.73776948, 0.74378943, 0.74976104, 0.75568551, 0.76156384,
  0.76739717, 0.7731865, 0.77893275, 0.78463697, 0.79030001]

function getECpM(level) {
  if (level == Math.floor(level)) {
    return cpm[level]
  } else {
    return Math.sqrt((Math.pow(cpm[Math.floor(level)], 2) + Math.pow(cpm[Math.ceil(level)], 2)) / 2)
  }
}

function getPokemonLevel(cp, baseADS, IVs) {
  if (cp <= 0 || IVs.attack < 0 || IVs.defense < 0 || IVs.stamina < 0) {
    return -1
  }

  if (cp <= 10) {
    return 1
  }

  for (let level = 1; level <= 30; level++) {
    const ECpM = getECpM(level - 1)
    if (cp && cp === Math.floor((baseADS.baseAttack + IVs.attack) * Math.pow(baseADS.baseDefense + IVs.defense, 0.5) * Math.pow(baseADS.baseStamina + IVs.stamina, 0.5) * Math.pow(ECpM, 2) / 10)) {
      return level
    }
  }

  return -1
}

function processPokemon(pokemon) {
  pokemon.niceName = (pokemon.id == 201 && pokemon.form != 0) ? pokemon.name + ' ' + String.fromCharCode(pokemon.form + 64) : pokemon.name
  if (pokemon.gender > 0 && pokemon.gender < 3) {
    pokemon.gender = pokemon.gender === 1 ? '♂' : '♀'
  } else {
    pokemon.gender = undefined
  }
  pokemon.remainingTime = time.timeToString(time.remainingTime(pokemon.despawn))
  pokemon.expiryTime = time.getTime(pokemon.despawn * 1000)

  pokemon.locationMapImage = configuration.keys.google ? 'https://maps.googleapis.com/maps/api/staticmap?markers=' + pokemon.lat + ',' + pokemon.lng + '&zoom=15&size=600x400&sensor=false&key=' + configuration.keys.google : undefined
  pokemon.locationMapUrl = `https://www.google.com/maps/place/${pokemon.lat},${pokemon.lng}`

  if (!configuration.abyo) {
    pokemon.postcode = pokemon.postcode ? pokemon.postcode : ''
    pokemon.location = pokemon.suburb ? pokemon.postcode + ' ' + pokemon.suburb : pokemon.postcode
    // Get closest station
    let closestStation = distance.closest(pokemon, tubeStations)
    closestStation.type = 'Tube'

    if (closestStation.distance > 500) {
      closestStation = distance.closest(pokemon, dlrStations)
      closestStation.type = 'DLR'

      if (closestStation.distance > 500) {
        closestStation = distance.closest(pokemon, railwayStations)
        closestStation.type = 'Railway'
      }
    }

    pokemon.closestStation = closestStation.distance <= 500 ? closestStation : undefined
  } else {
    pokemon.closestStation = abyo.gSt(pokemon.lat, pokemon.lng)
    pokemon.closestStation = pokemon.closestStation ? pokemon.closestStation : undefined

    pokemon.suburb = abyo.gSu(pokemon.lat, pokemon.lng)
    pokemon.suburb = pokemon.suburb ? pokemon.suburb : undefined

    pokemon.postcode = abyo.gP(pokemon.lat, pokemon.lng)
    pokemon.postcode = pokemon.postcode ? pokemon.postcode : undefined

    pokemon.borough = abyo.gB(pokemon.lat, pokemon.lng)
    pokemon.borough = pokemon.borough ? pokemon.borough : undefined

    pokemon.location = pokemon.suburb ? pokemon.postcode + ' ' + pokemon.suburb : pokemon.postcode
  }

  if (configuration.notifications.discord) {
    if (configuration.filters[pokemon.id]) {
      configuration.filters[pokemon.id].forEach(filter => {
        if (typeof filter.iv === 'undefined') {
          discordAPI.sendMessage({ pokemon: pokemon }, filter.channel, '[Public]')
        } else if (pokemon.iv - 45 >= filter.iv) {
          discordAPI.sendMessage({ pokemon: pokemon }, filter.channel, '[Public]')
        }
      })
    }

    if ((configuration.highIV[pokemon.id] && pokemon.iv - 45 >= configuration.highIV[pokemon.id]) || (typeof configuration.highIV[pokemon.id] === 'undefined' && pokemon.iv - 45 >= 0)) {
      discordAPI.sendMessage({ pokemon: pokemon }, configuration.highchannel, '[Public]')
    }

    if (configuration.highCP && configuration.highCP.minCP && pokemon.cp >= configuration.highCP.minCP) {
      discordAPI.sendMessage({ pokemon: pokemon }, configuration.highCP.channel, '[Public]')
    }

    if (configuration.highLevel && configuration.highLevel.minLevel && pokemon.level >= configuration.highLevel.minLevel) {
      discordAPI.sendMessage({ pokemon: pokemon }, configuration.highLevel.channel, '[Public]')
    }
  }

  if (firebase.trackings.data[pokemon.id]) {
    Object.keys(firebase.trackings.data[pokemon.id]).forEach((key) => {
      const [api, id] = key.split('*')
      const distanceValue = firebase.trackings.data[pokemon.id][key]

      if (firebase.users.data[api] && firebase.users.data[api][id] && firebase.users.data[api][id].active) {
        if (distanceValue === 'all' ||
          (firebase.users.data[api] && firebase.users.data[api][id] && firebase.users.data[api][id].location && distance.between(firebase.users.data[api][id].location, { lat: pokemon.lat, lng: pokemon.lng }) <= distance.convert(distanceValue))) {
          if (firebase.users.data[api][id].location) {
            pokemon.distance = Math.round(distance.between(firebase.users.data[api][id].location, { lat: pokemon.lat, lng: pokemon.lng }) / 10) / 100
          }

          if (configuration.notifications.discord && api === 'discord') {
            discordAPI.sendMessage({ pokemon: pokemon }, id, '[DM]')
          } else if (configuration.notifications.facebook && api === 'facebook') {
            facebookAPI.sendMessage({ pokemon: pokemon }, id)
          }
        }
      }
    })
  }

  processing = false
  setTimeout(pokemonUtil.parseQueue, 1100)
}

const pokemonUtil = {
  parsePokemon: (pokemons) => {
    if (pokemons && pokemons.length) {
      pokemons.forEach((pokemon) => {
        pokemon.id = parseInt(pokemon.pokemon_id, 10)
        pokemon.despawn = parseInt(pokemon.despawn, 10)
        pokemon.form = parseInt(pokemon.form, 10)
        pokemon.name = dicts.pokeDict[pokemon.pokemon_id].niceName
        pokemon.cp = parseInt(pokemon.cp, 10)
        pokemon.cp = pokemon.cp >= 0 ? pokemon.cp : -1
        pokemon.attack = parseInt(pokemon.attack, 10)
        pokemon.defence = parseInt(pokemon.defence, 10)
        pokemon.stamina = parseInt(pokemon.stamina, 10)
        pokemon.level = getPokemonLevel(pokemon.cp, dicts.pokeDict[pokemon.id].stats, { attack: pokemon.attack, defense: pokemon.defence, stamina: pokemon.stamina })
        pokemon.move1 = parseInt(pokemon.move1, 10)
        pokemon.move1 = pokemon.move1 > 0 ? dicts.movesDict[pokemon.move1] : ''
        pokemon.move2 = parseInt(pokemon.move2, 10)
        pokemon.move2 = pokemon.move2 > 0 ? dicts.movesDict[pokemon.move2] : ''
        pokemon.gender = parseInt(pokemon.gender, 10)
        pokemon.iv = (pokemon.attack + pokemon.defence + pokemon.stamina) >= 0 ? (pokemon.attack + pokemon.defence + pokemon.stamina) : undefined
        pokemon.ivPercent = !isNaN(Math.round(pokemon.iv / 45 * 100)) ? Math.round(pokemon.iv / 45 * 100) + '%' : ''

        if (pokemon.despawn > (new Date().getTime() / 1000 + 300)) {
          db.find({ lat: pokemon.lat, lng: pokemon.lng, despawn: pokemon.despawn, id: pokemon.id }, (err, docs) => {
            if (!docs || !docs.length) {
              db.insert({ lat: pokemon.lat, lng: pokemon.lng, despawn: pokemon.despawn, id: pokemon.id })

              if (!historical[pokemon.id]) {
                historical[pokemon.id] = new Datastore({ filename: __dirname + '/../db/historical-' + pokemon.id + '.db', autoload: true })
              }

              if (pokemon.id === 201) {
                historical[pokemon.id].insert({ lat: pokemon.lat, lng: pokemon.lng, despawn: pokemon.despawn, form: pokemon.form })
              } else {
                historical[pokemon.id].insert({ lat: pokemon.lat, lng: pokemon.lng, despawn: pokemon.despawn })
              }

              if (firebase.trackings.data[pokemon.id] || configuration.filters[pokemon.id] || pokemon.iv === 45 || pokemon.cp >= 2400 || pokemon.level >= 30) {
                queue.push(pokemon)
              }
            }
          })
        }
      })
    }
  },
  parseQueue: () => {
    if (!processing) {
      if (queue.length) {
        processing = true

        const pokemon = queue.shift()

        if (pokemon.despawn < (new Date().getTime() / 1000)) {
          logger.error('EXPIRED POKEMON IN QUEUE')
          processing = false
          setTimeout(pokemonUtil.parseQueue, 100)
          return
        }

        if (!configuration.abyo) {
          osm.getPostcode(pokemon)
            .then((pokemon) => {
              return postcodesIo.getPostcode(pokemon)
            })
            .then((pokemon) => {
              processPokemon(pokemon)
            })
            .catch((error) => {
              logger.error('QUEUE PROCESSING FAILED', error)
              queue.unshift(pokemon)
              processing = false
              setTimeout(pokemonUtil.parseQueue, 1100)
            })
        } else {
          processPokemon(pokemon)
        }
      } else {
        setTimeout(pokemonUtil.parseQueue, 100)
      }
    }
  },
  cleanOldPokemon: () => {
    db.remove({ despawn: { $lt: parseInt(new Date().getTime() / 1000 - 5 * 60, 10) } }, { multi: true }, (err, numRemoved) => {
      logger.log('[neDB] Cleaned old Pokemon from DB: ' + numRemoved)
      db.persistence.compactDatafile()
      setTimeout(pokemonUtil.cleanOldPokemon, 60 * 60 * 1000)
    })
  },
}

pokemonUtil.cleanOldPokemon()
pokemonUtil.parseQueue()

module.exports = pokemonUtil
