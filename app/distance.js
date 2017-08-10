const toRadians = (val) => {
  val = val ? val + '' : '0'
  return parseFloat(val.replace(/[^0-9\.\-]/g, '')) * Math.PI / 180
}

const between = (p1, p2) => {
  // Taken from http://www.movable-type.co.uk/scripts/latlong.html
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
}

const convert = (distance) => {
  distance = distance.toString()
  const value = parseFloat(distance.replace(/[^0-9\.\-]/g, ''))

  if (isNaN(value)) {
    return 0
  } else if (distance.indexOf('km') !== -1) {
    return value * 1000
  } else if (distance.indexOf('mi') !== -1) {
    return value * 1609.344
  } else {
    return value
  }
}

const closest = (point, groupOfPoints) => {
  let closestPoint = {
    point: {},
    distance: Number.MAX_SAFE_INTEGER
  }

  groupOfPoints.some(groupPoint => {
    if (Math.abs(point.lat - groupPoint.lat) > 0.1 || Math.abs(point.lng - groupPoint.lng) > 0.15) {
      return false
    }

    const distance = between(point, groupPoint)

    if (distance < closestPoint.distance) {
      closestPoint.point = groupPoint
      closestPoint.distance = distance
    }

    if (distance <= 100) {
      return true
    }

    return false
  })

  return closestPoint
}

module.exports = {
  between: between,
  convert: convert,
  closest: closest,
}
