const Datastore = require('nedb')
const configuration = require('../configuration/configuration.json')
const constants = require('./const.js')
const logger = require('./logger.js')
const time = require('./time.js')
const osm = require('./api/osm.js')
const postcodesIo = require('./api/postcodes.io.js')
const discord = require('./api/discord.js')
const db = new Datastore({ filename: __dirname + '/../db/pokemon.db', autoload: true })

const targetIVs = {}

const pokemonUtil = {
  parsePokemon: (pokemons) => {
    if (pokemons && pokemons.length) {
      pokemons.forEach((pokemon) => {
        pokemon.id = parseInt(pokemon.pokemon_id, 10)
        pokemon.despawn = parseInt(pokemon.despawn, 10)
        pokemon.name = constants.pokeDict[pokemon.pokemon_id].name
        pokemon.move1 = (pokemon.move1 && constants.movesDict[pokemon.move1]) ? constants.movesDict[pokemon.move1] : pokemon.move1
        pokemon.move2 = (pokemon.move2 && constants.movesDict[pokemon.move2]) ? constants.movesDict[pokemon.move2] : pokemon.move2
        pokemon.attack = parseInt(pokemon.attack, 10)
        pokemon.defence = parseInt(pokemon.defence, 10)
        pokemon.stamina = parseInt(pokemon.stamina, 10)
        pokemon.iv = (pokemon.attack + pokemon.defence + pokemon.stamina)
        pokemon.ivPercent = Math.round(pokemon.iv / 45 * 100)

        if (pokemon.despawn > (new Date().getTime()/1000 + 300) && pokemon.iv-45 >= targetIVs[pokemon.id]) {
          db.find({lat: pokemon.lat, lng: pokemon.lng, despawn: pokemon.despawn, id: pokemon.id}, (err, docs) => {
            if (!docs || !docs.length) {
              db.insert({lat: pokemon.lat, lng: pokemon.lng, despawn: pokemon.despawn, id: pokemon.id})

              osm.getPostcode(pokemon)
                .then((pokemon) => {
                  return postcodesIo.getPostcode(pokemon)
                })
                .then((pokemon) => {
                  const name =  (pokemon.id == 201 && pokemon.form != 0) ? pokemon.name + ' ' + String.fromCharCode(pokemon.form + 64) : pokemon.name
                  const remainingTime = time.timeToString(time.remainingTime(pokemon.despawn))
                  const expiryTime = time.getTime(pokemon.despawn * 1000)
                  const location = pokemon.suburb ? pokemon.postcode + ' ' + pokemon.suburb : pokemon.postcode

                  let message = {
                    content: `${name} | ${pokemon.ivPercent}% | ${location} | ${remainingTime} (until ${expiryTime}) | ${pokemon.move1}/${pokemon.move2} | http://www.google.com/maps/place/${pokemon.lat},${pokemon.lng}`,
                    embed: {
                      image: {
                        url: 'https://maps.googleapis.com/maps/api/staticmap?markers=' + pokemon.lat + ',' + pokemon.lng + '&zoom=15&size=400x400&sensor=false&key=' + configuration.keys.google,
                        height: 400,
                        width: 400,
                      }
                    },
                  }

                  if (configuration.allTarget[pokemon.id]) {
                    discord.addToQueue({
                      message: message,
                      channel: configuration.allTarget[pokemon.id]
                    })

                    if (configuration.secondTarget[pokemon.id] && (!configuration.secondIV[pokemon.id] || pokemon.iv-45 >= configuration.secondIV[pokemon.id])) {
                      discord.addToQueue({
                        message: message,
                        channel: configuration.secondTarget[pokemon.id]
                      })
                    }
                  }

                  const highIVTarget = configuration.highIV[pokemon.id] ? configuration.highIV[pokemon.id] : 0
                  if (pokemon.iv-45 >= highIVTarget) {
                    discord.addToQueue({
                      message: message,
                      channel: configuration.highchannel
                    })
                  }
                })
                .catch((error) => {
                  logger.error(error)
                })
            }
          })
        }
      })
    }
  },
  cleanOldPokemon: () => {
    db.find({despawn: { $lt: parseInt(new Date().getTime()/1000 - 6 * 60 * 60, 10) }}, (err, docs) => {

    })
  },
  generateTargetIVs: () => {
    for(let i=1; i<252; i++) {
      if (configuration.allTarget[i]) {
        targetIVs[i] = configuration.allIV[i] ? configuration.allIV[i] : -48
      } else {
        targetIVs[i] = configuration.highIV[i] ? configuration.highIV[i] : 0
      }
    }
  },
}

pokemonUtil.generateTargetIVs()
pokemonUtil.cleanOldPokemon()

module.exports = pokemonUtil
