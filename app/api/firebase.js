const admin = require('firebase-admin')
const configuration = require('../../configuration/configuration.json')

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(configuration.firebase.credentials),
  databaseURL: configuration.firebase.databaseURL
}, 'firebase')
const db = firebaseApp.database()

const users = { data: {} }
Object.keys(configuration.notifications).forEach(type => {
  if (configuration.notifications[type]) {
    users.data[type] = {}
  }
})
db.ref('users').on('value', function (snapshot) {
  users.data = snapshot.val() ? snapshot.val() : users.data
}, function (errorObject) {
  logger.error('[Firebase][Users] The read failed: ' + errorObject.code)
})

const trackings = { data: {} }
db.ref('trackings').on('value', function (snapshot) {
  trackings.data = snapshot.val() ? snapshot.val() : trackings.data
}, function (errorObject) {
  logger.error('[Firebase][Trackings] The read failed: ' + errorObject.code)
})

const postcodes = { data: {} }
db.ref('postcodes-io').on('value', function (snapshot) {
  postcodes.data = snapshot.val() ? snapshot.val() : postcodes.data
}, function (errorObject) {
  logger.error('[Firebase][Postcodes] The read failed: ' + errorObject.code)
})

const locations = {data: {}}
db.ref('osm').on('value', function(snapshot) {
  locations.data = snapshot.val() ? snapshot.val() : locations.data
}, function (errorObject) {
  logger.error('[Firebase][Locations] The read failed: ' + errorObject.code)
})

module.exports = {
  db: db,
  users: users,
  trackings: trackings,
  postcodes: postcodes,
  locations: locations,
}
