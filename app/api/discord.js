const Discord = require('discord.js')
const logger = require('../logger.js')
const bot = require('../bot.js')
const configuration = require('../../configuration/configuration.json')

const client = new Discord.Client()
let logged = false

const addMessage = (channelId, message, i) => {
  if (!logged) {
    logger.error('[Discord] Not logged in, retrying')
    setTimeout(() => {
      i = i ? i : 1
      addMessage(channelId, message, i++)
    }, i * 100)
    return
  }

  const channel = client.channels.get(channelId)

  if (channel) {
    channel.send(message.text, message.embed)
    .then((response) => {
      logger.log('[Discord][' + channelId + '][DM] ' + message.text)
    })
    .catch(logger.error)
  }
}

const sendMessage = (channelName, message, i) => {
  if (!logged) {
    logger.error('[Discord] Not logged in, retrying')
    setTimeout(() => {
      i = i ? i : 1
      sendMessage(channelName, message, i++)
    }, i * 100)
    return
  }

  const channel = client.channels.get(configuration.channels[channelName])

  if (channel) {
    channel.send(message.content, {
      embed: message.embed
    })
    .then((response) => {
      if (message.embed) {
        logger.log('[Discord][I][' + channelName + '] ' + message.content)
      } else {
        logger.log('[Discord][' + channelName + '] ' + message.content)
      }
    })
    .catch(logger.error)
  }
}

client.on('ready', () => {
  logged = true
  logger.log('[Discord] Connected')
})
client.login(configuration.keys.bot)

client.on('message', (message) => {
  if (message.channel.type === 'dm' && !message.author.bot) {
    bot.parseMessage({text: message.content.toLowerCase(), sender: message.channel.id, api: 'discord', addMessage: addMessage})
  }
})

module.exports = {
  sendMessage: sendMessage,
  addMessage: addMessage,
}
