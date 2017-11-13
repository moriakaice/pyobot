const Discord = require('discord.js')
const logger = require('../logger.js')
const bot = require('../bot.js')
const firebase = require('./firebase.js')
const dicts = require('../dicts.js')
const time = require('../time.js')
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

class DiscordAPI {
  constructor() {
    this.disabled = !configuration.notifications.discord

    if (this.disabled) {
      logger.error('[Discord] Notifications disabled')
      return
    }

    this.commands = bot.compileCommands('discord')
    this.logged = false
    this.connect()
  }

  help(message) {
    if (message.channel) {
      message.channel.send(texts.HELP)
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] Requested help')
        })
        .catch(logger.error)
    }
  }

  register(message) {
    if (message.channel) {
      firebase.users.data.discord[message.channel.id] = { active: true }
      firebase.db.ref('users').child('discord').set(firebase.users.data.discord)
      this.saveAuthorData(message.channel.id, message.author)

      message.channel.send(texts.REGISTERED)
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] Registered')
        })
        .catch(logger.error)
    }
  }

  unregister(message) {
    if (message.channel) {
      delete firebase.users.data.discord[message.channel.id]
      firebase.db.ref('users').child('discord').child(message.channel.id).set(null)

      message.channel.send(texts.UNREGISTERED)
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] Unregistered')
        })
        .catch(logger.error)
    }
  }

  stop(message) {
    if (message.channel) {
      firebase.users.data.discord[message.channel.id].active = false
      firebase.db.ref('users').child('discord').child(message.channel.id).update({ active: false })

      message.channel.send(texts.STOPPED)
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] Stopped global tracking')
        })
        .catch(logger.error)
    }
  }

  start(message) {
    if (message.channel) {
      firebase.users.data.discord[message.channel.id].active = true
      firebase.db.ref('users').child('discord').child(message.channel.id).update({ active: true })

      message.channel.send(texts.STARTED)
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] Started global tracking')
        })
        .catch(logger.error)
    }
  }

  saveLocation(message, match) {
    if (message.channel) {
      match[1] = parseFloat(match[1])
      match[2] = parseFloat(match[2])
      match[3] = match[3].toString()

      if (isNaN(match[1]) || isNaN(match[2]) || !match[3]) {
        this.unknown(message)
        return
      }

      if (!firebase.users.data.discord[message.channel.id].favoriteLocations) {
        firebase.users.data.discord[message.channel.id].favoriteLocations = {}
      }

      firebase.users.data.discord[message.channel.id].favoriteLocations[match[3].toLowerCase()] = {
        lat: match[1],
        lng: match[2]
      }
      firebase.db.ref('users').child('discord').child(message.channel.id).update(firebase.users.data.discord[message.channel.id])

      message.channel.send(texts.SAVED_NEW_FAV_LOCATION.replace('%lat', match[1]).replace('%lng', match[2]).replace('%name', match[3]))
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] Set new fav location ' + match[3] + ': ' + match[1] + ',' + match[2])
        })
        .catch(logger.error)
    }
  }

  setLocation(message, match) {
    if (message.channel) {
      if (!match[2]) {
        match[1] = match[1].toLowerCase()
        if (firebase.users.data.discord[message.channel.id].favoriteLocations && firebase.users.data.discord[message.channel.id].favoriteLocations[match[1]] && firebase.users.data.discord[message.channel.id].favoriteLocations[match[1]].lng && firebase.users.data.discord[message.channel.id].favoriteLocations[match[1]].lat) {
          match[2] = firebase.users.data.discord[message.channel.id].favoriteLocations[match[1]].lng
          match[1] = firebase.users.data.discord[message.channel.id].favoriteLocations[match[1]].lat
        } else {
          this.unknown(message)
          return
        }
      }

      match[1] = parseFloat(match[1])
      match[2] = parseFloat(match[2])

      if (isNaN(match[1]) || isNaN(match[2])) {
        this.unknown(message)
        return
      }

      firebase.users.data.discord[message.channel.id].location = {
        lat: match[1],
        lng: match[2]
      }
      firebase.db.ref('users').child('discord').child(message.channel.id).update({
        location: {
          lat: match[1],
          lng: match[2]
        }
      })

      message.channel.send(texts.SAVED_NEW_LOCATION.replace('%lat', match[1]).replace('%lng', match[2]))
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] Saved new location: ' + match[1] + ',' + match[2])
        })
        .catch(logger.error)
    }
  }

  unsetLocation(message) {
    if (message.channel) {
      delete firebase.users.data.discord[message.channel.id].location
      firebase.db.ref('users').child('discord').child(message.channel.id).update({ location: null })

      message.channel.send(texts.REMOVED_LOCATION)
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] Unset location')
        })
        .catch(logger.error)
    }
  }

  track(message, match) {
    if (message.channel) {
      match[1] = convertNameOrIdToPokemonId(match[1])

      if (match[1]) {
        if (!firebase.trackings.data[match[1]]) {
          firebase.trackings.data[match[1]] = {}
        }

        firebase.trackings.data[match[1]]['discord*' + message.channel.id] = match[2]
        firebase.db.ref('trackings').child(match[1]).set(firebase.trackings.data[match[1]])

        message.channel.send(texts.STARTED_TRACKING.replace('%pokemon', dicts.pokeDict[match[1]].niceName).replace('%distance', match[2]))
          .then((response) => {
            logger.log('[Discord][DM][' + message.channel.id + '] Started tracking ' + dicts.pokeDict[match[1]].niceName + ' on distance: ' + match[2])
          })
          .catch(logger.error)
      }
    }
  }

  untrack(message, match) {
    if (message.channel) {
      if (match[1] === 'all') {
        Object.keys(firebase.trackings.data).forEach((pokemonId) => {
          if (firebase.trackings.data[pokemonId]['discord*' + message.channel.id]) {
            delete firebase.trackings.data[pokemonId]['discord*' + message.channel.id]
            firebase.db.ref('trackings').child(pokemonId).set(firebase.trackings.data[pokemonId])
          }
        })
      } else {
        const pokemonId = convertNameOrIdToPokemonId(match[1])

        if (pokemonId && firebase.trackings.data[pokemonId] && firebase.trackings.data[pokemonId]['discord*' + message.channel.id]) {
          delete firebase.trackings.data[pokemonId]['discord*' + message.channel.id]
          firebase.db.ref('trackings').child(pokemonId).set(firebase.trackings.data[pokemonId])
        }
      }

      message.channel.send(texts.STOPPED_TRACKING.replace('%pokemon', match[1]))
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] Stopped tracking ' + match[1])
        })
        .catch(logger.error)
    }
  }

  myTracking(message) {
    if (message.channel) {
      const userTrackings = []
      Object.keys(firebase.trackings.data).forEach((pokemonId) => {
        pokemonId = convertNameOrIdToPokemonId(pokemonId)
        if (pokemonId && firebase.trackings.data[pokemonId]['discord*' + message.channel.id]) {
          userTrackings.push(`${dicts.pokeDict[pokemonId].niceName} [${pokemonId}] - ${firebase.trackings.data[pokemonId]['discord*' + message.channel.id]}`)
        }
      })

      message.channel.send(texts.MY_TRACKING.replace('%pokemon', userTrackings.join(', ')).replace('%trackingPage', `${configuration.homepage}/tracking/Discord/${message.channel.id}`))
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] User is tracking following Pokemon: ' + userTrackings.join(', '))
        })
        .catch(logger.error)
    }
  }

  pyobotTracking(message) {
    const trackedPokemon = []
    configuration.tracked.forEach((id) => {
      if (dicts.pokeDict[id]) {
        trackedPokemon.push(dicts.pokeDict[id].niceName)
      }
    })

    message.reply(`Currently tracking following Pokemon: ${trackedPokemon.join(', ')}`)
    logger.log('[Discord][Public][' + message.channel.id + '][' + message.author.id + '] Generated tracked Pokemon list')
  }

  enableCustomFormat(message, match) {
    if (message.channel) {
      firebase.users.data.discord[message.channel.id].customFormat = parseInt(match[1], 10) === 1 ? true : false
      firebase.db.ref('users').child('discord').set(firebase.users.data.discord)

      message.channel.send(texts.ENABLE_CUSTOM_FORMAT.replace('%enable', match[1]))
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] User set custom notification format: ' + match[1])
        })
        .catch(logger.error)
    }
  }

  setCustomTitle(message, match) {
    if (message.channel) {
      firebase.users.data.discord[message.channel.id].customTitle = match[1]
      firebase.db.ref('users').child('discord').set(firebase.users.data.discord)

      message.channel.send(texts.SET_CUSTOM_TITLE.replace('%title', match[1]))
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] User set custom title to: ' + match[1])
        })
        .catch(logger.error)
    }
  }

  setCustomBody(message, match) {
    if (message.channel) {
      firebase.users.data.discord[message.channel.id].customBody = match[1]
      firebase.db.ref('users').child('discord').set(firebase.users.data.discord)

      message.channel.send(texts.SET_CUSTOM_BODY.replace('%body', match[1]))
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] User set custom body to: ' + match[1])
        })
        .catch(logger.error)
    }
  }

  unknown(message) {
    if (message.channel) {
      message.channel.send(texts.UNKNOWN_COMMAND)
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] Unrecognised command')
        })
        .catch(logger.error)
    }
  }

  notAuthorised(message) {
    if (message.channel) {
      message.channel.send(texts.NOT_AUTHORISED)
        .then((response) => {
          logger.log('[Discord][DM][' + message.channel.id + '] Not authorised')
        })
        .catch(logger.error)
    }
  }

  isRegistered(sender) {
    return firebase.users.data.discord && firebase.users.data.discord[sender]
  }

  isAdmin(sender) {
    return configuration.admin && configuration.admin.discord && configuration.admin.discord.includes(sender)
  }

  getAuthorName(sender) {
    return this.hasAuthorData(sender) ? `${firebase.users.data.discord[sender].username} (${sender})` : sender
  }

  hasAuthorData(sender) {
    return firebase.users.data.discord && firebase.users.data.discord[sender] && firebase.users.data.discord[sender].userId
  }

  saveAuthorData(sender, author) {
    if (firebase.users.data.discord && firebase.users.data.discord[sender]) {
      if (author.id) { firebase.users.data.discord[sender].userId = author.id }
      if (author.username) { firebase.users.data.discord[sender].username = author.username }
      if (author.discriminator) { firebase.users.data.discord[sender].discriminator = author.discriminator }
      firebase.db.ref('users').child('discord').child(sender).set(firebase.users.data.discord[sender])
    }
  }

  setTriggers() {
    this.client.on('ready', () => {
      this.logged = true
      logger.log('[Discord] Connected')
    })

    this.client.on('message', (message) => {
      if (message.author.bot || message.content[0] !== '!') {
        return
      }

      const type = message.channel.type === 'dm' ? 'private' : 'public'
      let matched = false

      this.commands[type].some(command => {
        const match = message.content.match(command.re)
        if (match) {
          matched = true

          if (command.isAdmin && !this.isAdmin(message.author.id)) {
            this.notAuthorised(message)
            return true
          }

          if (command.isRegistered && !this.isRegistered(message.channel.id)) {
            this.register(message)
          }

          if (command.isRegistered && !this.hasAuthorData(message.channel.id)) {
            this.saveAuthorData(message.channel.id, message.author)
          }

          this[command.name](message, match)
          return true
        }

        return false
      })

      if (!matched && type === 'private') {
        this.unknown(message)
      }
    })
  }

  send(message, channelName, type) {
    const channelId = configuration.channels[channelName] ? configuration.channels[channelName] : channelName
    const channel = this.client.channels.get(channelId)
    let richEmbed
    if (message.pokemon) {
      message.pokemon.remainingTime = time.timeToString(time.remainingTime(message.pokemon.despawn))

      richEmbed = this.createRichEmbed(message.pokemon)

      if (type === '[DM]' && firebase.users.data.discord[channelId] && firebase.users.data.discord[channelId].customFormat) {
        richEmbed = this.createCustomRichEmbed(message.pokemon, channelId)
      }
    }

    if (firebase.users.data.discord && firebase.users.data.discord[channelId] && firebase.users.data.discord[channelId].userId) {
      const userPromise = this.client.fetchUser(firebase.users.data.discord[channelId].userId)
      userPromise.then(user => {
        user.createDM().then(dmChannel => {
          dmChannel.send(message.content, richEmbed)
            .then((response) => {
              const content = message.content ? message.content : richEmbed.embed.title + ' | ' + message.pokemon.expiryTime + ' | ' + message.pokemon.remainingTime
              logger.log(`[Discord]${type}[${this.getAuthorName(channelId)}] ${content}`)
            })
            .catch(err => {
              logger.error(`[Discord][Send][${this.getAuthorName(channelId)}]`, err)
            })
        })
          .catch(msg => {
            logger.error(`[Discord][DM][${this.getAuthorName(channelId)}] Unable to send DM message and create DM Channel`)
          })
      }).catch(msg => {
        logger.error(`[Discord][DM][${this.getAuthorName(channelId)}][Promise] Unable to send DM message and create DM Channel`)
      })
    } else if (channel) {
      channel.send(message.content, richEmbed)
        .then((response) => {
          const content = message.content ? message.content : richEmbed.embed.title + ' | ' + message.pokemon.expiryTime + ' | ' + message.pokemon.remainingTime
          logger.log(`[Discord]${type}[${channelName}] ${content}`)
        })
        .catch(err => {
          logger.error('[Discord][Send]', err)
        })
    } else {
      logger.error('[Discord] Unable to send message - channel not found: ' + channelName)
    }
  }

  sendMessage(message, channelName, type, i) {
    if (this.disabled) {
      return
    }

    if (!i) {
      i = 0
    }

    if (i > 10) {
      logger.error('[Discord] Some problems with sending the message, giving up. Channel: ' + channelName)
    }

    if (!this.logged) {
      logger.error('[Discord] Tried to send message before Discord was connected. Retrying...')

      setTimeout(() => {
        this.sendMessage(message, channelName, type, ++i)
      }, 1000 * (i + 1))
    } else {
      setImmediate(function (context, message, channelName, type) {
        context.send(message, channelName, type)
      }, this, message, channelName, type)
    }
  }

  createRichEmbed(pokemon) {
    if (!pokemon) {
      return undefined
    }

    const title = []
    const description = []

    title.push(pokemon.niceName)

    if (pokemon.iv) {
      title.push(pokemon.ivPercent)
    }

    if (pokemon.cp > 0) {
      title.push('CP ' + pokemon.cp)
    }

    title.push(pokemon.location)

    if (pokemon.distance) {
      title.push(pokemon.distance + 'km')
    }

    if (pokemon.level > 0) {
      title.push('Lv ' + pokemon.level)
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

    description.push(pokemon.locationMapUrl.replace('https://', 'http://'))

    const cp = pokemon.cp > 0 ? 'CP ' + pokemon.cp : ''

    return {
      embed: new Discord.RichEmbed({
        title: title.join(' | '),
        description: description.join(' | '),
        image: {
          url: pokemon.locationMapImage,
          width: 600,
          height: 400
        },
        thumbnail: {
          url: 'https://pkmref.com/images/set_1/' + pokemon.id + '.png'
        },
        url: pokemon.locationMapUrl.replace('https://', 'http://')
      })
    }
  }

  createCustomRichEmbed(pokemon, channelId) {
    if (!pokemon) {
      return undefined
    }

    let customTitle = firebase.users.data.discord[channelId].customTitle
    let customBody = firebase.users.data.discord[channelId].customBody

    customTitle = customTitle ? customTitle : ''
    customBody = customBody ? customBody : ''

    pokemon.locationMapUrl = pokemon.locationMapUrl.replace('https://', 'http://')

    if (pokemon.closestStation) {
      pokemon.closestStationName = pokemon.closestStation.point && pokemon.closestStation.point.name ? pokemon.closestStation.point.name : pokemon.closestStation
    }

    const allowedKeys = ["cp", "attack", "defence", "stamina", "move1", "move2", "gender", "id", "name", "iv", "ivPercent", "suburb", "postcode", "niceName", "remainingTime", "expiryTime", "location", "locationMapUrl", "closestStationName", "distance", "level"]

    allowedKeys.forEach(key => {
      const value = pokemon[key] ? pokemon[key] : ''
      customTitle = customTitle.replace(`%${key}%`, value)
      customBody = customBody.replace(`%${key}%`, value)
    })

    return {
      embed: new Discord.RichEmbed({
        title: customTitle,
        description: customBody,
        image: {
          url: pokemon.locationMapImage,
          width: 600,
          height: 400
        },
        thumbnail: {
          url: 'https://pkmref.com/images/set_1/' + pokemon.id + '.png'
        },
        url: pokemon.locationMapUrl.replace('https://', 'http://')
      })
    }
  }

  connect() {
    this.client = new Discord.Client()
    this.client.login(configuration.keys.bot)
    this.setTriggers()
  }
}

const discordAPI = new DiscordAPI()

module.exports = discordAPI
