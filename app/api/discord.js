const request = require('superagent')
const logger = require('../logger.js')
const configuration = require('../../configuration/configuration.json')

const queue = []
let processing = false

const discord = {
  addToQueue: (item) => {
    queue.push(item)
  },
  getQueue: () => {
    return queue
  },
  processQueue: () => {
    if (!processing) {
      if (queue.length) {
        processing = true
        
        const item = queue.shift()

        discord.notify(item.message, configuration.channels[item.channel])
          .then((response) => {
            if (item.message.embed) {
              logger.log('[I] [' + item.channel + '] ' + item.message.content)
            } else {
              logger.log('[' + item.channel + '] ' + item.message.content)
            }

            let reset = 1

            if (response.headers['x-ratelimit-remaining'] && parseInt(response.headers['x-ratelimit-remaining'], 10) <= 0) {
              reset = parseInt(response.headers['x-ratelimit-reset'], 10) - Math.floor(new Date().getTime() / 1000) + 1
              if (reset < 1) reset = 1
            }

            processing = false
            setTimeout(discord.processQueue, reset * 1000)
          })
          .catch((error) => {
            logger.error('Error posting message to Discord', error)
            queue.unshift(message)
            processing = false
            setTimeout(discord.processQueue, 1000)
          })
      } else {
        setTimeout(discord.processQueue, 100)
      }
    }
  },
  notify: (message, channel) => {
    return request.post('https://discordapp.com/api/channels/' + channel + '/messages')
      .send(message)
      .set('Authorization', 'Bot ' + configuration.keys.bot)
  },
}

discord.processQueue()

module.exports = discord
