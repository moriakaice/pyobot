const turfInside = require("turf-inside") // Point in polygon
const turfDistance = require("turf-distance") // Geodesic distance
module.exports.g = g // Formatted endpoint
module.exports.gB = gB // Finds exact borough (exact at boundaries)
module.exports.gP = gP // Finds exact postal district (approximate at boundaries)
module.exports.gSt = gSt // Finds nearest station marker (within 500m)
module.exports.gSu = gSu // Finds nearest suburb marker (unbounded)

const postcodes = require('./data/Postcodes.json') // Doogal postcode polygons
const boroughs = require('./data/Boroughs.json') // Data.gov borough polygons
const suburbs = require('./data/Suburbs.json').features // OSM suburb/town nodes (modified)
const stations = require('./data/Stations.json').features // OSM railway station nodes (expanded)
const boroughDict = require('./data/boroughDict.json') // Three-letter codes for boroughs

// wrapper for turf-inside (point in polygon algorithm)
function inside(lat, lng, polygon) {
  const point = { "type": "Point", "coordinates": [lng, lat] }
  if (polygon.geometry.type == "Polygon") {
    return turfInside(point, polygon)
  } else if (polygon.geometry.type == "GeometryCollection") {
    // would need to adapt imported module to fix
    return polygon.properties.name + " is not a polygon."
  }
}

// wrapper for turf-distance (spherical distance between points)
function distance(lat1, lng1, lat2, lng2) {
  const point1 = { "type": "Point", "coordinates": [lng1, lat1] }
  const point2 = { "type": "Point", "coordinates": [lng2, lat2] }
  return turfDistance(point1, point2, "kilometres")
}

// finds postcode from co-ords (London + HP)
function gP(lat, lng) {
  let finalPostcode = ''
  postcodes.some(postcode => {
    const isInside = inside(lat, lng, postcode)
    if (isInside) {
      finalPostcode = postcode.properties.name
    }
    return isInside
  })

  return finalPostcode
}

// finds borough from co-ords (London + HC)
function gB(lat, lng) {
  let finalBorough = ''
  boroughs.some(borough => {
    const isInside = inside(lat, lng, borough)
    if (isInside) {
      finalBorough = borough.properties.lad16nm
    }
    return isInside
  })

  return finalBorough
}

// finds suburb from co-ords (M25)
function gSu(lat, lng) {
  let closestDistance = Number.MAX_SAFE_INTEGER
  let closestName = ''
  suburbs.some(suburb => {
    const howFar = distance(lat, lng, suburb.geometry.coordinates[1], suburb.geometry.coordinates[0])
    if (howFar < closestDistance) {
      closestDistance = howFar
      closestName = suburb.properties.name
    }
    return howFar <= 0.1 ? true : false
  })

  return closestName
}

// finds station from co-ords (M25)
function gSt(lat, lng) {
  let closestDistance = 0.5 // will only return stations within 0.5km
  let closestName = ''
  stations.some(station => {
    const howFar = distance(lat, lng, station.geometry.coordinates[1], station.geometry.coordinates[0])
    if (howFar < closestDistance) {
      closestDistance = howFar
      closestName = station.properties.name
    }
    return howFar <= 0.1 ? true : false
  })

  return closestName
}

// endpoint
function g(lat, lng) {
  let name = gSt(lat, lng)
  if (name == "(none found)") {
    name = "~ " + gSu(lat, lng)
  } else {
    name = "@ " + name
  }
  return gP(lat, lng) + " " + boroughDict[gB(lat, lng)] + " " + name
}
