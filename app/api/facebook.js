const request = require('superagent')
const distance = require('../distance.js')
const logger = require('../logger.js')
const bot = require('../bot.js')
const firebase = require('./firebase.js')
const dicts = require('../dicts.js')
const configuration = require('../../configuration/configuration.json')

const helpUrl = configuration.helppage ? configuration.helppage : `${configuration.homepage}/help`

const texts = {
  'UNKNOWN_COMMAND': 'We are sorry, but we were unable to recognise the command',
  'HELP': `For help on how to use the bot, visit ${helpUrl}`,
  'NOT_AUTHORISED': 'We are sorry, but you are not authorised to execute this command',
  'REGISTERED': 'Thank you for registering for the service. Type !help for all the available commands',
  'UNREGISTERED': 'We are sorry to see you go :(',
  'STOPPED': 'You have stopped the subscription service, so you will not be receiving messages about spawns until you `!start` it again.',
  'STARTED': 'You have restarted your subscription service.',
  'SAVED_NEW_FAV_LOCATION': 'You have registered new favorite location under name %name and coordinates: %lat, %lng',
  'SAVED_NEW_LOCATION': 'Your location has been updated to: %lat, %lng',
  'REMOVED_LOCATION': 'Your location has been removed. Any distance-based notifications will not be sent.',
  'STARTED_TRACKING': 'You have started tracking %pokemon on %distance distance',
  'STOPPED_TRACKING': 'You have stopped tracking %pokemon',
  'MY_TRACKING': 'You are currently tracking following Pokemon: %pokemon. You can see the list on %trackingPage',
  'ENABLE_CUSTOM_FORMAT': 'Set custom notification format to %enable',
  'SET_CUSTOM_TITLE': 'Set custom title to %title',
  'SET_CUSTOM_BODY': 'Set custom body to %body',
}

const convertNameOrIdToPokemonId = function convertNameOrIdToPokemonId(value) {
  let id = parseInt(value, 10)
  if (isNaN(id)) {
    id = dicts.pokeReverseDict[value.toLowerCase().replace(/'/g, '').replace(/\./g, '').replace(/\s+/g, '_')]

    if (!id) {
      return false
    }
  }

  return !isNaN(id) && dicts.pokeDict[id] ? id : false
}

class FacebookAPI {
  constructor() {
    this.disabled = !configuration.notifications.facebook

    if (this.disabled) {
      logger.error('[FB] Notifications disabled')
      return
    }

    this.commands = bot.compileCommands('facebook')
  }

  parseEvent(event) {
    if (event.message.attachments && event.message.attachments.length) {
      event.message.attachments.forEach((attachment) => {
        if (attachment.type === 'location' && attachment.payload && attachment.payload.coordinates && attachment.payload.coordinates.lat && attachment.payload.coordinates.long) {
          event.message.text = `!setLocation ${attachment.payload.coordinates.lat},${attachment.payload.coordinates.long}`
        }
      })
    }

    if (event.message.text) {
      event.try = 1
      let matched = false

      this.commands.private.some(command => {
        const match = event.message.text.match(command.re)
        if (match) {
          matched = true

          if (command.isAdmin && !this.isAdmin(event.sender.id)) {
            this.notAuthorised(event)
            return true
          }

          if (command.isRegistered && !this.isRegistered(event.sender.id)) {
            this.register(event)
          }

          this[command.name](event, match)
          return true
        }

        return false
      })

      if (!matched) {
        this.unknown(event)
      }
    }
  }

  help(event) {
    this.sendMessage({ text: texts.HELP }, event.sender.id)
  }

  register(event) {
    firebase.users.data.facebook[event.sender.id] = { active: true }
    firebase.db.ref('users').child('facebook').set(firebase.users.data.facebook)
    this.sendMessage({ text: texts.REGISTERED }, event.sender.id)
  }

  unregister(event) {
    delete firebase.users.data.facebook[event.sender.id]
    firebase.db.ref('users').child('facebook').child(event.sender.id).set(null)
    this.sendMessage({ text: texts.UNREGISTERED }, event.sender.id)
  }

  stop(event) {
    firebase.users.data.facebook[event.sender.id].active = false
    firebase.db.ref('users').child('facebook').child(event.sender.id).update({ active: false })
    this.sendMessage({ text: texts.STOPPED }, event.sender.id)
  }

  start(event) {
    firebase.users.data.facebook[event.sender.id].active = true
    firebase.db.ref('users').child('facebook').child(event.sender.id).update({ active: true })
    this.sendMessage({ text: texts.STARTED }, event.sender.id)
  }

  saveLocation(event, match) {
    match[1] = parseFloat(match[1])
    match[2] = parseFloat(match[2])
    match[3] = match[3].toString()

    if (isNaN(match[1]) || isNaN(match[2]) || !match[3]) {
      this.unknown(event)
      return
    }

    if (!firebase.users.data.facebook[event.sender.id].favoriteLocations) {
      firebase.users.data.facebook[event.sender.id].favoriteLocations = {}
    }

    firebase.users.data.facebook[event.sender.id].favoriteLocations[match[3].toLowerCase()] = {
      lat: match[1],
      lng: match[2]
    }
    firebase.db.ref('users').child('facebook').child(event.sender.id).update(firebase.users.data.facebook[event.sender.id])
    this.sendMessage({ text: texts.SAVED_NEW_FAV_LOCATION.replace('%lat', match[1]).replace('%lng', match[2]).replace('%name', match[3]) }, event.sender.id)
  }

  setLocation(event, match) {
    if (!match[2]) {
      match[1] = match[1].toLowerCase()
      if (firebase.users.data.facebook[event.sender.id].favoriteLocations && firebase.users.data.facebook[event.sender.id].favoriteLocations[match[1]] && firebase.users.data.facebook[event.sender.id].favoriteLocations[match[1]].lng && firebase.users.data.facebook[event.sender.id].favoriteLocations[match[1]].lat) {
        match[2] = firebase.users.data.facebook[event.sender.id].favoriteLocations[match[1]].lng
        match[1] = firebase.users.data.facebook[event.sender.id].favoriteLocations[match[1]].lat
      } else {
        this.unknown(event)
        return
      }
    }

    match[1] = parseFloat(match[1])
    match[2] = parseFloat(match[2])

    if (isNaN(match[1]) || isNaN(match[2])) {
      this.unknown(event)
      return
    }

    firebase.users.data.facebook[event.sender.id].location = {
      lat: match[1],
      lng: match[2]
    }
    firebase.db.ref('users').child('facebook').child(event.sender.id).update({
      location: {
        lat: match[1],
        lng: match[2]
      }
    })
    this.sendMessage({ text: texts.SAVED_NEW_LOCATION.replace('%lat', match[1]).replace('%lng', match[2]) }, event.sender.id)
  }

  unsetLocation(event) {
    delete firebase.users.data.facebook[event.sender.id].location
    firebase.db.ref('users').child('facebook').child(event.sender.id).update({ location: null })
    this.sendMessage({ text: texts.REMOVED_LOCATION }, event.sender.id)
  }

  track(event, match) {
    match[1] = convertNameOrIdToPokemonId(match[1])

    if (match[1]) {
      if (!firebase.trackings.data[match[1]]) {
        firebase.trackings.data[match[1]] = {}
      }

      firebase.trackings.data[match[1]]['facebook*' + event.sender.id] = match[2]
      firebase.db.ref('trackings').child(match[1]).set(firebase.trackings.data[match[1]])

      this.sendMessage({ text: texts.STARTED_TRACKING.replace('%pokemon', dicts.pokeDict[match[1]].niceName).replace('%distance', match[2]) }, event.sender.id)
    }

  }

  untrack(event, match) {
    if (match[1] === 'all') {
      Object.keys(firebase.trackings.data).forEach((pokemonId) => {
        if (firebase.trackings.data[pokemonId]['facebook*' + event.sender.id]) {
          delete firebase.trackings.data[pokemonId]['facebook*' + event.sender.id]
          firebase.db.ref('trackings').child(pokemonId).set(firebase.trackings.data[pokemonId])
        }
      })
    } else {
      const pokemonId = convertNameOrIdToPokemonId(match[1])

      if (pokemonId && firebase.trackings.data[pokemonId] && firebase.trackings.data[pokemonId]['facebook*' + event.sender.id]) {
        delete firebase.trackings.data[pokemonId]['facebook*' + event.sender.id]
        firebase.db.ref('trackings').child(pokemonId).set(firebase.trackings.data[pokemonId])
      }
    }
    this.sendMessage({ text: texts.STOPPED_TRACKING.replace('%pokemon', match[1]) }, event.sender.id)
  }

  myTracking(event) {
    const userTrackings = []
    Object.keys(firebase.trackings.data).forEach((pokemonId) => {
      pokemonId = convertNameOrIdToPokemonId(pokemonId)
      if (pokemonId && firebase.trackings.data[pokemonId]['facebook*' + event.sender.id]) {
        userTrackings.push(`${dicts.pokeDict[pokemonId].niceName} [${pokemonId}] - ${firebase.trackings.data[pokemonId]['facebook*' + event.sender.id]}`)
      }
    })

    this.sendMessage({ text: texts.MY_TRACKING.replace('%pokemon', userTrackings.join(', ')).replace('%trackingPage', `${configuration.homepage}/tracking/Facebook/${event.sender.id}`) }, event.sender.id)
  }

  pyobotTracking(event) {
    const trackedPokemon = []
    configuration.tracked.forEach((id) => {
      if (dicts.pokeDict[id]) {
        trackedPokemon.push(dicts.pokeDict[id].niceName)
      }
    })

    this.sendMessage({ text: `Currently tracking following Pokemon: ${trackedPokemon.join(', ')}` }, event.sender.id)
  }

  enableCustomFormat(event, match) {
    firebase.users.data.facebook[event.sender.id].customFormat = parseInt(match[1], 10) === 1 ? true : false
    firebase.db.ref('users').child('facebook').set(firebase.users.data.facebook)

    this.sendMessage({ text: texts.ENABLE_CUSTOM_FORMAT.replace('%enable', match[1]) }, event.sender.id)
  }

  setCustomBody(event, match) {
    firebase.users.data.facebook[event.sender.id].customBody = match[1]
    firebase.db.ref('users').child('facebook').set(firebase.users.data.facebook)

    this.sendMessage({ text: texts.SET_CUSTOM_BODY.replace('%body', match[1]) }, event.sender.id)
  }

  unknown(event) {
    this.sendMessage({ text: texts.UNKNOWN_COMMAND }, event.sender.id)
  }

  notAuthorised(event) {
    this.sendMessage({ text: texts.NOT_AUTHORISED }, event.sender.id)
  }

  isRegistered(sender) {
    return firebase.users.data.facebook && firebase.users.data.facebook[sender]
  }

  isAdmin(sender) {
    return configuration.admin && configuration.admin.facebook && configuration.admin.facebook.includes(sender)
  }

  sendMessage(message, recipientId) {
    if (this.disabled) {
      return
    }

    if (message.tries && message.tries > 5) {
      logger.error('[FB] Tried sending message to ' + recipientId + ' 5 times, giving up')
      return
    }

    let truncatedMessage

    const tries = message.tries
    delete message.tries

    const facebookMessage = {
      recipient: { id: recipientId },
      message: message
    }

    if (message.pokemon && !message.attachment && !message.text) {
      const pokemon = message.pokemon
      delete message.pokemon

      this.sendMessage({
        attachment: {
          type: 'image',
          payload: {
            url: pokemon.locationMapImage,
            is_reusable: true
          }
        }
      }, recipientId)

      if (firebase.users.data.facebook[recipientId] && firebase.users.data.facebook[recipientId].customFormat) {
        message.text = this.createCustomEmbedText(pokemon, recipientId)
      } else {
        message.text = this.createEmbedText(pokemon)
      }
      this.sendMessage(message, recipientId)
      // message.attachment = this.createRichEmbed(pokemon)

      return
    } else if (message.text && message.text.length > 640) {
      let splitPosition = message.text.substr(0, 640).lastIndexOf(' ')
      if (splitPosition === -1) {
        truncatedMessage = message.text.substr(640)
        message.text = message.text.substr(0, 640)
      } else {
        truncatedMessage = { text: message.text.substr(splitPosition + 1) }
        message.text = message.text.substr(0, splitPosition)
      }
    }

    const facebookCall = request
      .post('https://graph.facebook.com/v2.9/me/messages?access_token=' + configuration.keys.facebook)
      .timeout({
        response: 5000,  // Wait 5 seconds for the server to start sending,
        deadline: 60000, // but allow 1 minute for the file to finish loading.
      })
      .set('content-type', 'application/json')
      .send(facebookMessage)
      .then((response) => {
        if (message.attachment) {
          logger.log('[FB][' + recipientId + '] Sent map: ' + message.attachment.payload.url)
        } else {
          logger.log('[FB][' + recipientId + '] Sent text: ' + message.text)

          if (truncatedMessage && truncatedMessage.text.length) {
            this.sendMessage(truncatedMessage, recipientId)
          }
        }
      })
      .catch((error) => {
        logger.error('[FB] Error while posting to facebook', error)
        message.tries = tries ? tries + 1 : 1
        setTimeout(() => { this.sendMessage(message, recipientId) }, 1000 * message.tries)
      })
  }

  createEmbedText(pokemon) {
    if (!pokemon) {
      return ''
    }

    const description = []

    description.push(pokemon.niceName)

    if (pokemon.ivPercent) {
      description.push(pokemon.ivPercent)
    }

    if (pokemon.cp > 0) {
      description.push('CP ' + pokemon.cp)
    }

    description.push(pokemon.location)

    if (pokemon.level > 0) {
      description.push('Lv ' + pokemon.level)
    }

    if (pokemon.distance) {
      description.push(pokemon.distance + 'km')
    }

    description.push(`TL: ${pokemon.remainingTime} (till ${pokemon.expiryTime})`)

    if (pokemon.closestStation) {
      if (pokemon.closestStation.point && pokemon.closestStation.point.name) {
        description.push('STN: ' + pokemon.closestStation.point.name)
      } else {
        description.push('STN: ' + pokemon.closestStation)
      }
    }

    if (pokemon.move1 || pokemon.move2) {
      description.push(`${pokemon.move1}/${pokemon.move2}`)
    }

    if (pokemon.ivPercent) {
      description.push(`${pokemon.attack}/${pokemon.defence}/${pokemon.stamina}`)
    }

    if (pokemon.gender) {
      description.push(pokemon.gender)
    }

    description.push(pokemon.locationMapUrl)

    return description.join(' | ')
  }

  createCustomEmbedText(pokemon, recipientId) {
    if (!pokemon) {
      return ''
    }

    let customBody = firebase.users.data.facebook[recipientId].customBody
    customBody = customBody ? customBody : ''

    if (pokemon.closestStation) {
      pokemon.closestStationName = pokemon.closestStation.point && pokemon.closestStation.point.name ? pokemon.closestStation.point.name : pokemon.closestStation
    }

    const allowedKeys = ["cp", "attack", "defence", "stamina", "move1", "move2", "gender", "id", "name", "iv", "ivPercent", "suburb", "postcode", "niceName", "remainingTime", "expiryTime", "location", "locationMapUrl", "closestStationName", "distance", "level"]

    allowedKeys.forEach(key => {
      const value = pokemon[key] ? pokemon[key] : ''
      customBody = customBody.replace(`%${key}%`, value)
    })

    return customBody
  }
}

const facebookAPI = new FacebookAPI()

module.exports = facebookAPI
