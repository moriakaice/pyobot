const spdy = require('spdy')
const http = require('http')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('superagent')
const path = require('path')
const Datastore = require('nedb')
const facebook = require('./api/facebook.js')
const configuration = require('../configuration/configuration.json')
const app = express()

const server = {
  run: () => {
    // Redirect from http port 80 to https
    http.createServer(function (req, res) {
      res.writeHead(301, { 'Location': 'https://' + req.headers['host'] + req.url })
      res.end()
    }).listen(80)

    const options = {
      key: fs.readFileSync('/etc/letsencrypt/live/' + configuration.sslDomain + '/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/' + configuration.sslDomain + '/fullchain.pem')
    }

    spdy.createServer(options, app).listen(443, (error) => {
      if (error) {
        console.error(error)
        return process.exit(1)
      } else {
        console.log('Server started and listening on port 443')
      }
    })
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname, '..', 'static', 'index.html'))
    })

    app.get('/historical', function (req, res) {
      res.sendFile(path.join(__dirname, '..', 'static', 'historical.html'))
    })

    app.get('/historical/:pokemonId', function (req, res) {
      const pokemonId = parseInt(req.params.pokemonId, 10)

      fs.exists(path.join(__dirname, '..', 'db', 'historical-' + pokemonId + '.db'), (exists) => {
        if (exists) {
          const data = new Datastore({ filename: path.join(__dirname, '..', 'db', 'historical-' + pokemonId + '.db'), autoload: true })
          data.find({}, function (err, docs) {
            if (docs && docs.length) {
              res.json(docs)
            } else {
              res.sendStatus(404)
            }
          })
        } else {
          res.sendStatus(404)
        }
      })
    })

    // Facebook Webhook
    app.get('/webhook', function (req, res) {
      if (req.query['hub.verify_token'] === configuration.keys.facebookVerifyToken) {
        res.send(req.query['hub.challenge'])
      } else {
        res.sendStatus(400)
        res.send('Invalid verify token')
      }
    })

    // handler receiving messages
    app.post('/webhook', function (req, res) {
      const events = req.body.entry[0].messaging
      if (events && Array.isArray(events) && events.length) {
        events.forEach((event) => {
          if (!event.message || event.message.is_echo) {
            return false
          }

          facebook.parseEvent(event)
        })
      }
      res.sendStatus(200)
    })
  }
}

module.exports = server
