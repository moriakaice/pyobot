const request = require('superagent')
const firebase = require('./firebase.js')
const logger = require('../logger.js')
const configuration = require('../../configuration/configuration.json')

let key
let workingKeys = []

const checkWorkingKey = (testedKey) => {
  request
    .get('http://locationiq.org/v1/balance.php?key=' + testedKey)
    .timeout({
      response: 5000,  // Wait 5 seconds for the server to start sending,
      deadline: 60000, // but allow 1 minute for the file to finish loading.
    })
    .set('user-agent', configuration.browser)
    .end((err, res) => {
      if (!err && res.body.balance.day > 500 && !workingKeys.includes(testedKey)) {
        workingKeys.push(testedKey)
      } else {
        logger.warn(`[OSM] ${testedKey} key is expired/fully used`)
      }
    })
}

const checkWorkingKeys = () => {
  if (typeof configuration.keys.locationiq === 'string') {
    configuration.keys.locationiq = [configuration.keys.locationiq]
  }

  workingKeys = []
  configuration.keys.locationiq.forEach(testedKey => {
    checkWorkingKey(testedKey)
  })

  setTimeout(checkWorkingKeys, 10 * 60 * 1000)
}

checkWorkingKeys()

const getRandomKey = () => {
  if (!workingKeys.length) {
    return false
  }

  return workingKeys[Math.floor(Math.random() * workingKeys.length)]
}

const osm = {
  getPostcode: (pokemon, tries) => {
    let key = getRandomKey()

    // In case of no working key, skip
    if (!key) {
      logger.warn('No working key for OSM')
      return Promise.resolve(pokemon)
    }

    tries = tries ? tries : 0
    return new Promise((resolve, reject) => {
      if (tries >= 5) {
        logger.warn(`Exceeded tries limit on http://locationiq.org/v1/reverse.php?key=${key}&format=json&lat=${pokemon.lat}&lon=${pokemon.lng}`)
        resolve(pokemon)
      } else {
        const url = 'http://locationiq.org/v1/reverse.php?key=' + key + '&format=json&lat=' + pokemon.lat + '&lon=' + pokemon.lng

        request
          .get(url)
          .timeout({
            response: 5000,  // Wait 5 seconds for the server to start sending,
            deadline: 60000, // but allow 1 minute for the file to finish loading.
          })
          .set('user-agent', configuration.browser)
          .then((res) => {
            if (res && res.status === 200 && res.body && !res.body.error) {
              if (res.body.address) {
                if (res.body.address.suburb) {
                  pokemon.suburb = res.body.address.suburb
                }

                if (res.body.address.postcode) {
                  res.body.address.postcode = res.body.address.postcode.split(' ')[0]
                  pokemon.postcode = res.body.address.postcode
                }
              }

              resolve(pokemon)
            } else {
              if (res) {
                logger.error('Error in OSM', res.body)
              } else {
                logger.error('Horrible error in OSM')
              }

              setTimeout(function () {
                resolve(osm.getPostcode(pokemon, ++tries))
              }, 1000 * (tries + 1))
            }
          })
          .catch((error) => {
            logger.error('Error obtaining postcode from OSM', url, error)
            setTimeout(function () {
              resolve(osm.getPostcode(pokemon, ++tries))
            }, 1000 * (tries + 1))
          })
      }
    })
  }
}

module.exports = osm
