const logger = require('./logger.js')
const configuration = require('../configuration/configuration.json')

if (configuration.firebase.databaseURL) {
  if (configuration.notifications.facebook && configuration.keys.facebook && configuration.keys.facebookVerifyToken) {
    const server = require('./server.js')
    server.run()
  }

  if (configuration.map) {
		const dicts = require('./dicts.js')
		
		const trackedPokemon = []
		configuration.tracked.forEach((id) => {
			trackedPokemon.push(dicts.pokeDict[id])
		})

		logger.log('Starting tracking for:', trackedPokemon.join(', '))

    const map = require('./api/' + configuration.map + '.js')
    map.getPokemon(0)
  }
}
