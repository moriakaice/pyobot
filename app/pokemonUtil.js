const Datastore = require('nedb')
const configuration = require('../configuration/configuration.json')
const dicts = require('./dicts.js')
const logger = require('./logger.js')
const time = require('./time.js')
const osm = require('./api/osm.js')
const postcodesIo = require('./api/postcodes.io.js')
const discord = require('./api/discord.js')
const facebook = require('./api/facebook.js')
const firebase = require('./api/firebase.js')
const distance = require('./distance.js')
const db = new Datastore({ filename: __dirname + '/../db/pokemon.db', autoload: true })
const historical = {}

const targetIVs = {}

const queue = []
let processing = false

const pokemonUtil = {
  parsePokemon: (pokemons) => {
    if (pokemons && pokemons.length) {
      pokemons.forEach((pokemon) => {
        pokemon.id = parseInt(pokemon.pokemon_id, 10)
        pokemon.despawn = parseInt(pokemon.despawn, 10)
        pokemon.form = parseInt(pokemon.form, 10)
        pokemon.name = dicts.pokeDict[pokemon.pokemon_id]

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

              queue.push(pokemon)
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

        osm.getPostcode(pokemon)
          .then((pokemon) => {
            return postcodesIo.getPostcode(pokemon)
          })
          .then((pokemon) => {
            const name = (pokemon.id == 201 && pokemon.form != 0) ? pokemon.name + ' ' + String.fromCharCode(pokemon.form + 64) : pokemon.name
            const remainingTime = time.timeToString(time.remainingTime(pokemon.despawn))
            const expiryTime = time.getTime(pokemon.despawn * 1000)
            pokemon.postcode = pokemon.postcode ? pokemon.postcode : ''
            const location = pokemon.suburb ? pokemon.postcode + ' ' + pokemon.suburb : pokemon.postcode

            const embed = configuration.keys.google ? {
              image: {
                url: 'https://maps.googleapis.com/maps/api/staticmap?markers=' + pokemon.lat + ',' + pokemon.lng + '&zoom=15&size=400x400&sensor=false&key=' + configuration.keys.google,
                height: 400,
                width: 400,
              }
            } : null

            let message = {
              content: `${name} | ${location} | ${remainingTime} (until ${expiryTime}) | http://www.google.com/maps/place/${pokemon.lat},${pokemon.lng}`,
              embed: embed,
            }

            if (configuration.notifications.discord && configuration.allTarget[pokemon.id]) {
              if (Array.isArray(configuration.allTarget[pokemon.id])) {
                configuration.allTarget[pokemon.id].forEach((channel) => {
                  discord.sendMessage(channel, message)
                })
              } else {
                discord.sendMessage(configuration.allTarget[pokemon.id], message)
              }
            }

            if (firebase.trackings.data[pokemon.id]) {
              Object.keys(firebase.trackings.data[pokemon.id]).forEach((key) => {
                const [api, id] = key.split('*')
                const distanceValue = firebase.trackings.data[pokemon.id][key]

                if (firebase.users.data[api][id].active) {
                  if (distanceValue === 'all' ||
                    (firebase.users.data[api] && firebase.users.data[api][id] && firebase.users.data[api][id].location && distance.between(firebase.users.data[api][id].location, { lat: pokemon.lat, lng: pokemon.lng }) <= distance.convert(distanceValue))) {
                    if (configuration.notifications.discord && api === 'discord') {
                      discord.addMessage(id, {
                        text: message.content,
                        embed: {
                          embed: message.embed
                        }
                      })
                    } else if (configuration.notifications.facebook && api === 'facebook') {
                      facebook.addMessage(id, { text: message.content })
                      facebook.addMessage(id, { image: message.embed.image.url })
                    }
                  }
                }
              })
            }

            processing = false
            setTimeout(pokemonUtil.parseQueue, 1100)
          })
          .catch((error) => {
            logger.error(error)
            queue.unshift(pokemon)
            processing = false
            setTimeout(pokemonUtil.parseQueue, 1100)
          })
      } else {
        setTimeout(pokemonUtil.parseQueue, 100)
      }
    }
  },
  cleanOldPokemon: () => {
    db.remove({ despawn: { $lt: parseInt(new Date().getTime() / 1000 - 6 * 60 * 60, 10) } }, { multi: true }, (err, numRemoved) => {
      logger.log('[neDB] Cleaned old Pokemon from DB: ' + numRemoved)
      db.persistence.compactDatafile()
      setTimeout(pokemonUtil.cleanOldPokemon, 60 * 60 * 1000)
    })
  },
}

pokemonUtil.cleanOldPokemon()
pokemonUtil.parseQueue()

module.exports = pokemonUtil
