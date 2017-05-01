const toRadians = (val) => {
  return val * Math.PI / 180
}

module.exports = {
  // Taken from http://www.movable-type.co.uk/scripts/latlong.html
  between: (p1, p2) => {
    const R = 6371e3
    const φ1 = toRadians(p1.lat), λ1 = toRadians(p1.lng)
    const φ2 = toRadians(p2.lat), λ2 = toRadians(p2.lng)
    const Δφ = φ2 - φ1
    const Δλ = λ2 - λ1

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2)
      + Math.cos(φ1) * Math.cos(φ2)
      * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c

    return d
  },
  convert: (distance) => {
    const value = parseFloat(distance)

    if (distance.indexOf('km') !== -1) {
      return value * 1000
    } else if (distance.indexOf('mi') !== -1) {
      return value * 1609.344
    } else {
      return value
    }
  },
}
