const request = require('superagent')
const logger = require('../logger.js')
const dicts = require('../dicts.js')
const distance = require('../distance.js')
const bot = require('../bot.js')
const firebase = require('./firebase.js')
const configuration = require('../../configuration/configuration.json')

const queueMessages = []
let processing = false
let processingMessage = false

const facebook = {
  parseEvent: (event) => {
    if (event.message.attachments && event.message.attachments.length) {
      event.message.attachments.forEach((attachment) => {
        if (attachment.type === 'location' && attachment.payload && attachment.payload.coordinates && attachment.payload.coordinates.lat && attachment.payload.coordinates.long) {
          event.message.text = `!setLocation ${attachment.payload.coordinates.lat},${attachment.payload.coordinates.long}`
        }
      })
    }

    if (event.message.text) {
      const text = event.message.text.toLowerCase()
      bot.parseMessage({ text: text, sender: event.sender.id, api: 'facebook', addMessage: facebook.addMessage })
    }
  },
  addMessage: (recipientId, message) => {
    queueMessages.push({
      recipientId: recipientId,
      message: message
    })
    setTimeout(facebook.processMessageQueue, 100)
  },
  processMessage: (recipientId, item) => {
    processingMessage = true

    if (!recipientId) {
      console.error('[FB] No recipientId', item)
      processingMessage = false

      setTimeout(facebook.processMessageQueue, 100)
      return
    }

    if (item.text) {
      facebook.notify(recipientId, { text: item.text })
        .then((response) => {
          logger.log('[FB][' + recipientId + '] ' + item.text)
          processingMessage = false

          setTimeout(facebook.processMessageQueue, 100)
        })
        .catch((error) => {
          logger.error('[FB] Error posting message to facebook', error)
          setTimeout(() => { facebook.processMessage(item, recipientId) }, 1000)
        })
    } else {
      facebook.notify(recipientId, { image: item.image })
        .then((response) => {
          logger.log('[FB][' + recipientId + '] ' + item.image)
          processingMessage = false

          setTimeout(facebook.processMessageQueue, 100)
        })
        .catch((error) => {
          logger.error('[FB] Error posting image to facebook', error)
          setTimeout(() => { facebook.processMessage(item, recipientId) }, 1000)
        })
    }
  },
  processMessageQueue: () => {
    if (!processingMessage) {
      if (queueMessages.length) {
        processingMessage = true

        const item = queueMessages.shift()

        facebook.processMessage(item.recipientId, item.message)
      }
    }
  },
  notify: (recipientId, message) => {
    const facebookCall = request
      .post('https://graph.facebook.com/v2.9/me/messages?access_token=' + configuration.keys.facebook)
      .set('content-type', 'application/json')

    if (message.image) {
      return facebookCall
        .send('{"recipient": {"id": "' + recipientId + '"}, "message": {"attachment": { "type": "image", "payload": { "url": "' + message.image + '", "is_reusable": true}}}}')
    } else {
      return facebookCall
        .send('{"recipient": {"id": "' + recipientId + '"}, "message": {"text": "' + message.text + '"}}')
    }
  },
}

module.exports = facebook
