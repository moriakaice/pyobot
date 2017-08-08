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

          if (body.type === "pokemon" && body.message) {
            // Translate RM Pokemon to LPM Pokemon
            const newPokemon = {
              pokemon_id: body.message.pokemon_id.toString(),
              lat: body.message.latitude.toString(),
              lng: body.message.longitude.toString(),
              despawn: Math.floor(body.message.disappear_time / 1000).toString(),
              disguise: '0',
              costume: '0',
              shiny: '0',
              attack: body.message.individual_attack != null ? body.message.individual_attack.toString() : '-1',
              defence: body.message.individual_defense != null ? body.message.individual_defense.toString() : '-1',
              stamina: body.message.individual_stamina != null ? body.message.individual_stamina.toString() : '-1',
              move1: body.message.move_1 != null ? body.message.move_1.toString() : '-1',
              move2: body.message.move_2 != null ? body.message.move_2.toString() : '-1',
              gender: body.message.gender.toString(),
              form: body.message.form != null ? body.message.form.toString() : '0',
              cp: body.message.cp != null ? body.message.cp.toString() : '-1',
            }
            pokemonUtil.parsePokemon(newPokemon)
            res.writeHead(200)
            res.end(JSON.stringify(newPokemon))
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
