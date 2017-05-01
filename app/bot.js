const request = require('superagent')
const logger = require('./logger.js')
const dicts = require('./dicts.js')
const distance = require('./distance.js')
const firebase = require('./api/firebase.js')
const configuration = require('../configuration/configuration.json')

const isRegistered = (api, sender) => {
  return firebase.users.data[api] && firebase.users.data[api][sender]
}

const convertNameOrIdToPokemonId = (value) => {
  let id = parseInt(value, 10)
  if (isNaN(id) && dicts.pokeReverseDict[value]) {
    id = parseInt(dicts.pokeReverseDict[value], 10)
  }

  return !isNaN(id) && dicts.pokeDict[id] ? id : false
}

module.exports = {
  isRegistered: isRegistered,
  parseMessage: (message) => {
    if (!firebase.users.data[message.api]) {
      firebase.users.data[message.api] = {}
    }

    if (!isRegistered(message.api, message.sender) && !message.text.includes('!register')) {

      logger.log(`[${message.api}][${message.sender}] Tried commands before registering`)
      message.addMessage(message.sender, { text: 'You need to register first by typing !register' })

    } else if (!isRegistered(message.sender, message.api) && message.text.includes('!register')) {

      firebase.users.data[message.api][message.sender] = { active: true }
      firebase.db.ref('users').child(message.api).set(firebase.users.data[message.api])

      message.addMessage(message.sender, { text: 'Thank you for registering for the service. Type !help for all the available commands' })
      logger.log(`[${message.api}][${message.sender}] Registered`)

    } else {

      if (message.text.includes('!unregister')) {

        delete firebase.users.data[message.api][message.sender]
        firebase.db.ref('users').child(message.api).child(message.sender).set(null)
        message.addMessage(message.sender, { text: 'Sorry to see you go :(' })
        logger.log(`[${message.api}][${message.sender}] Unregistered`)

      } else if (message.text.includes('!help')) {

        message.addMessage(message.sender, { text: 'For help on how to use the bot, visit ' + configuration.homepage + ' website' })
        logger.log(`[${message.api}][${message.sender}] Sending !help link`)

      } else if (firebase.users.data[message.api][message.sender].active && (message.text.includes('!pause') || message.text.includes('!stop'))) {

        firebase.users.data[message.api][message.sender].active = false
        firebase.db.ref('users').child(message.api).child(message.sender).update({ active: false })
        message.addMessage(message.sender, { text: 'You have stopped the subscription service, so you will not be receiving messages about spawns.' })
        logger.log(`[${message.api}][${message.sender}] Stopped subscription`)

      } else if (!firebase.users.data[message.api][message.sender].active && (message.text.includes('!start') || message.text.includes('!restart'))) {

        firebase.users.data[message.api][message.sender].active = true
        firebase.db.ref('users').child(message.api).child(message.sender).update({ active: true })
        message.addMessage(message.sender, { text: 'You have restarted your subscriptions.' })
        logger.log(`[${message.api}][${message.sender}] Started subscription`)

      } else if (message.text.includes('!setlocation')) {

        let userLocation = message.text.split('!setlocation ')
        if (userLocation.length > 1) {
          userLocation = userLocation[1].replace(/\s+/g, '').split(',')

          if (userLocation.length === 2) {
            firebase.users.data[message.api][message.sender].location = {
              lat: userLocation[0],
              lng: userLocation[1]
            }
            firebase.db.ref('users').child(message.api).child(message.sender).update({
              location: {
                lat: userLocation[0],
                lng: userLocation[1]
              }
            })
            message.addMessage(message.sender, { text: 'New location saved!' })
            logger.log(`[${message.api}][${message.sender}] Saved new location of: ${userLocation[0]},${userLocation[1]}`)
          }
        }

      } else if (message.text.includes('!unsetlocation')) {

        delete firebase.users.data[message.api][message.sender].location
        firebase.db.ref('users').child(message.api).child(message.sender).update({ location: null })
        message.addMessage(message.sender, { text: 'Location removed!' })
        logger.log(`[${message.api}][${message.sender}] Removed location`)

      } else if (message.text.includes('!track ')) {

        const params = message.text.replace('!track ', '').split(' ')
        if (params.length >= 2) {
          const pokemonId = convertNameOrIdToPokemonId(params[0])

          if (pokemonId) {
            if (!firebase.trackings.data[pokemonId]) {
              firebase.trackings.data[pokemonId] = {}
            }

            firebase.trackings.data[pokemonId][message.api + '*' + message.sender] = params[1]
            firebase.db.ref('trackings').child(pokemonId).set(firebase.trackings.data[pokemonId])
            logger.log(`[${message.api}][${message.sender}] Set tracking of ${dicts.pokeDict[pokemonId]} [${pokemonId}] - ${params[1]}`)
          }
        }

      } else if (message.text.includes('!untrack ')) {

        if (message.text.replace('!untrack ', '') === 'all') {
          Object.keys(firebase.trackings.data).forEach((pokemonId) => {
            if (firebase.trackings.data[pokemonId][message.api + '*' + message.sender]) {
              delete firebase.trackings.data[pokemonId][message.api + '*' + message.sender]
              firebase.db.ref('trackings').child(pokemonId).set(firebase.trackings.data[pokemonId])
            }
          })
        } else {
          const pokemonId = convertNameOrIdToPokemonId(message.text.replace('!untrack ', ''))

          if (pokemonId && firebase.trackings.data[pokemonId] && firebase.trackings.data[pokemonId][message.api + '*' + message.sender]) {
            delete firebase.trackings.data[pokemonId][message.api + '*' + message.sender]
            firebase.db.ref('trackings').child(pokemonId).set(firebase.trackings.data[pokemonId])
          }
        }
        logger.log(`[${message.api}][${message.sender}] Stopped tracking ${message.text.replace('!untrack ', '')}`)

      } else if (message.text.includes('!mytracking')) {

        const userTrackings = []
        Object.keys(firebase.trackings.data).forEach((pokemonId) => {
          pokemonId = convertNameOrIdToPokemonId(pokemonId)
          if (pokemonId && firebase.trackings.data[pokemonId][message.api + '*' + message.sender]) {
            userTrackings.push(`${dicts.pokeDict[pokemonId]} [${pokemonId}] - ${firebase.trackings.data[pokemonId][message.api + '*' + message.sender]}`)
          }
        })
        message.addMessage(message.sender, { text: 'Tracking: ' + userTrackings.join(', ') })
        logger.log(`[${message.api}][${message.sender}] Is tracking: ${userTrackings.join(', ')}`)

      }
    }
  },
}
