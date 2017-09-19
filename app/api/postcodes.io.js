const request = require('superagent')
const firebase = require('./firebase.js')
const logger = require('../logger.js')
const configuration = require('../../configuration/configuration.json')

module.exports = {
  getPostcode: (pokemon) => {
    return new Promise((resolve, reject) => {
      if (firebase.postcodes.data[pokemon.lat.replace('.', '_') + 'x' + pokemon.lng.replace('.', '_')]) {
        pokemon.postcode = firebase.postcodes.data[pokemon.lat.replace('.', '_') + 'x' + pokemon.lng.replace('.', '_')].postcode
        resolve(pokemon)
      } else {
        const url = 'https://api.postcodes.io/postcodes?lat=' + pokemon.lat + '&lon=' + pokemon.lng

        return resolve(request
          .get(url)
          .timeout({
            response: 5000,  // Wait 5 seconds for the server to start sending,
            deadline: 60000, // but allow 1 minute for the file to finish loading.
          })
          .set('user-agent', configuration.browser)
          .catch((error) => {
            logger.error('Error obtaining postcode from Postcodes.io', url, error)
            return pokemon
          })
          .then((res) => {
            if (res && res.status === 200 && res.body) {
              if (res.body.result != null && res.body.result.length && res.body.result[0].outcode) {
                pokemon.postcode = res.body.result[0].outcode
              } else {
                pokemon.postcode = pokemon.postcode ? pokemon.postcode + '?' : pokemon.postcode
              }

              firebase.postcodes.data[pokemon.lat.replace('.', '_') + 'x' + pokemon.lng.replace('.', '_')] = { postcode: pokemon.postcode }
              firebase.db.ref('postcodes-io').child(pokemon.lat.replace('.', '_') + 'x' + pokemon.lng.replace('.', '_')).set({
                postcode: pokemon.postcode ? pokemon.postcode : null
              })
            }

            return pokemon
          })
        )
      }
    })
  }
}
