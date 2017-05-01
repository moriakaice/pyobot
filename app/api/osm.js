const request = require('superagent')
const firebase = require('./firebase.js')
const logger = require('../logger.js')
const configuration = require('../../configuration/configuration.json')

let key

const selectWorkingKey = (testedKey, index) => {
  request
    .get('http://locationiq.org/v1/balance.php?key=' + testedKey)
    .set('user-agent', configuration.browser)
    .end((err, res) => {
      const nextIndex = configuration.keys.locationiq.length > index ? index : 0

      if (err) {
        logger.error('Error checking LocationIQ key', err)
        selectWorkingKey(configuration.keys.locationiq[nextIndex], nextIndex+1)
        return
      }

      if (res.body.balance.day < 500) {
        selectWorkingKey(configuration.keys.locationiq[nextIndex], nextIndex+1)
        return
      }

      logger.log('Setting LocationIQ key to:', testedKey, 'Queries left:', res.body.balance.day)
      key = testedKey
      setTimeout(() => {selectWorkingKey(key, nextIndex)}, parseInt(20 * 60 * 1000 * (res.body.balance.day / 10000), 10))
      return
    })
}

const getLocationIQKey = () => {
  if (typeof configuration.keys.locationiq === 'string') {
    key = configuration.keys.locationiq
  } else {
    key = configuration.keys.locationiq[0]
    selectWorkingKey(configuration.keys.locationiq[0], 1)
  }
}

getLocationIQKey()

const osm = {
  getPostcode: (pokemon) => {
    return new Promise((resolve, reject) => {
      if (firebase.locations.data[pokemon.lat.replace('.', '_') + 'x' + pokemon.lng.replace('.', '_')]) {
        pokemon.suburb = firebase.locations.data[pokemon.lat.replace('.', '_') + 'x' + pokemon.lng.replace('.', '_')].suburb
        pokemon.postcode = firebase.locations.data[pokemon.lat.replace('.', '_') + 'x' + pokemon.lng.replace('.', '_')].postcode
        resolve(pokemon)
      } else {
        const url = 'http://locationiq.org/v1/reverse.php?key='+key+'&format=json&lat='+pokemon.lat+'&lon='+pokemon.lng

        return resolve(request
          .get(url)
          .set('user-agent', configuration.browser)
          .catch((error) => {
            logger.error('Error obtaining postcode from OSM', url, error)
            return pokemon
          })
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

                firebase.locations.data[pokemon.lat.replace('.', '_') + 'x' + pokemon.lng.replace('.', '_')] = res.body.address
                firebase.db.ref('osm').child(pokemon.lat.replace('.', '_') + 'x' + pokemon.lng.replace('.', '_')).set({
                  suburb: pokemon.suburb ? pokemon.suburb : null,
                  postcode: pokemon.postcode ? pokemon.postcode : null
                })
              }
            } else {
              logger.error('Error in OSM', res.body)
            }

            return pokemon
          })
        )
      }
    })
  }
}

module.exports = osm
