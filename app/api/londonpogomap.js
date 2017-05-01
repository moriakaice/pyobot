const request = require('superagent')
const logger = require('../logger.js')
const configuration = require('../../configuration/configuration.json')
const pokemonUtil = require('../pokemonUtil.js')
const time = require('../time.js')

const londonPogoMap = {
  getPokemon: (since) => {
    since = since ? since : 0

    const url = 'https://londonpogomap.com/query2.php?token=pleaseDontStealOurData&since=' + since + '&mons=' + configuration.tracked.join(',')

    request
      .get(url)
      .set('user-agent', configuration.browser)
      .set('authority', 'londonpogomap.com')
      .set('referer', 'https://londonpogomap.com/')
      .set('x-requested-with', 'XMLHttpRequest')
      .then((data) => {
        data = data.body
        pokemonUtil.parsePokemon(data.pokemons)
        const inserted = data.meta.inserted

        logger.log('Ran at ' + time.getTime())
        setTimeout(function () {
          londonPogoMap.getPokemon(inserted)
        }, 30 * 1000)
      })
      .catch((error) => {
        logger.error(error)
        setTimeout(function () {
          londonPogoMap.getPokemon(0)
        }, 10 * 1000)
      })
  }
}

module.exports = londonPogoMap
