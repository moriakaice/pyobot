const request = require('superagent')
const Datastore = require('nedb')
const logger = require('../logger.js')
const configuration = require('../../configuration/configuration.json')
const db = new Datastore({ filename: __dirname + '/../../db/postcodes.io-locations.db', autoload: true })

module.exports = {
  getPostcode: (pokemon) => {
    return new Promise((resolve, reject) => {
      db.find({ lat: pokemon.lat, lng: pokemon.lng }, (err, locationData) => {
        if (!err && locationData.length) {
          pokemon.postcode = locationData[0].postcode
          resolve(pokemon)
        } else {
          const url = 'https://api.postcodes.io/postcodes?lat='+pokemon.lat+'&lon='+pokemon.lng

          return resolve(request
            .get(url)
            .set('user-agent', configuration.browser)
            .catch((error) => {
              logger.error('Error obtaining postcode from Postcodes.io', url, error)
              return error
            })
            .then((res) => {
              if (res && res.status === 200 && res.body) {
                if (res.body.result && res.body.result.length) {
                  pokemon.postcode = res.body.result[0].outcode
                } else {
                  pokemon.postcode = pokemon.postcode ? pokemon.postcode + '?' : pokemon.postcode
                }

                db.insert({
                  lat: pokemon.lat,
                  lng: pokemon.lng,
                  postcode: pokemon.postcode
                })
              }

              return pokemon
            })
          )
        }
      })
    })
  }
}
