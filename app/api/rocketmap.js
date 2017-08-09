const http = require('http')
const logger = require('../logger.js')
const pokemonUtil = require('../pokemonUtil.js')

const rocketMap = {
  getPokemon: () => {
    const server = http.createServer((req, res) => {
      // Webhooks only send POST
      if (req.method !== 'POST') {
        res.end()
        return
      }

      let body = ''
      req.on('data', function (chunk) {
        body += chunk
      })
      req.on('end', function () {
        try {
          body = JSON.parse(body)

          if (Array.isArray(body)) {
            const pokemons = []
            body.forEach(message => {
              if (message.type === "pokemon" && message.message) {
                // Translate RM Pokemon to LPM Pokemon
                const newPokemon = {
                  pokemon_id: message.message.pokemon_id.toString(),
                  lat: message.message.latitude.toString(),
                  lng: message.message.longitude.toString(),
                  despawn: message.message.disappear_time.toString(),
                  disguise: '0',
                  costume: '0',
                  shiny: '0',
                  attack: message.message.individual_attack != null ? message.message.individual_attack.toString() : '-1',
                  defence: message.message.individual_defense != null ? message.message.individual_defense.toString() : '-1',
                  stamina: message.message.individual_stamina != null ? message.message.individual_stamina.toString() : '-1',
                  move1: message.message.move_1 != null ? message.message.move_1.toString() : '-1',
                  move2: message.message.move_2 != null ? message.message.move_2.toString() : '-1',
                  gender: message.message.gender.toString(),
                  form: message.message.form != null ? message.message.form.toString() : '0',
                  cp: message.message.cp != null ? message.message.cp.toString() : '-1',
                }

                pokemons.push(newPokemon)
              }
            })
            pokemonUtil.parsePokemon(pokemons)
            res.writeHead(200)
            res.end()
          } else {
            res.writeHead(200)
            res.end('The only supported type is "pokemon"')
          }
        } catch (error) {
          res.writeHead(500)
          res.end()
        }
      })
    }).listen(0, '0.0.0.0')

    server.on('listening', function () {
      logger.log(`Created webhook listener on: ${server.address().address}:${server.address().port}`)
    })
  }
}

module.exports = rocketMap
