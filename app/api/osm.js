const request = require('superagent')
const Datastore = require('nedb')
const logger = require('../logger.js')
const configuration = require('../../configuration/configuration.json')
const db = new Datastore({ filename: __dirname + '/../../db/osm-locations.db', autoload: true })

module.exports = {
  getPostcode: (pokemon) => {
    return new Promise((resolve, reject) => {
      db.find({ lat: pokemon.lat, lng: pokemon.lng }, (err, locationData) => {
        if (!err && locationData.length) {
          pokemon.suburb = locationData[0].suburb
          pokemon.postcode = locationData[0].postcode
          resolve(pokemon)
        } else {
          const url = 'http://nominatim.openstreetmap.org/reverse?format=json&lat='+pokemon.lat+'&lon='+pokemon.lng

          return resolve(request
            .get(url)
            .set('user-agent', configuration.browser)
            .catch((error) => {
              logger.error('Error obtaining postcode from OSM', url, error)
              return error
            })
            .then((res) => {
              if (res && res.status === 200 && res.body) {
                if (res.body.address) {
                  if (res.body.address.suburb) {
                    pokemon.suburb = res.body.address.suburb
                  }

                  if (res.body.address.postcode) {
                    pokemon.postcode = res.body.address.postcode.split(' ')[0]
                  }

                  db.insert({
                    lat: pokemon.lat,
                    lng: pokemon.lng,
                    postcode: pokemon.postcode,
                    suburb: pokemon.suburb
                  })
                }
              }

              return pokemon
            })
          )
        }
      })
    })
  }
}
