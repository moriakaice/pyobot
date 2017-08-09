module.exports = {
  getDate: (timecode) => {
    const date = timecode ? new Date(timecode) : new Date()
    const fullYear = date.getFullYear()
    const month = '0' + (date.getMonth() + 1)
    const day = '0' + date.getDate()
    return fullYear + '-' + month.substr(-2) + '-' + day.substr(-2)
  },
  getTime: (timecode) => {
    const date = timecode ? new Date(timecode) : new Date()
    const hours = '0' + date.getHours()
    const minutes = '0' + date.getMinutes()
    const seconds = '0' + date.getSeconds()
    return hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
  },
  remainingTime: (time) => {
    time = time - Math.floor(new Date().getTime() / 1000)
    return time > 0 ? time : 0
  },
  timeToString: (seconds) => {
    if (seconds < 0) {
      return 'Expired'
    }

    const minuteString = '0' + Math.floor(seconds / 60)
    const secondString = '0' + seconds % 60

    return minuteString.substr(-2) + ':' + secondString.substr(-2)
  },
  timeToFullString: (seconds) => {
    if (seconds < 0) {
      seconds = 0
    }

    const timeArray = []

    if (seconds >= 86400) {
      timeArray.push(Math.floor(seconds / 86400) + ' d')
      seconds = seconds % 86400
    }

    if (seconds >= 3600) {
      timeArray.push(Math.floor(seconds / 3600) + ' h')
      seconds = seconds % 3600
    }

    if (seconds >= 60) {
      timeArray.push(Math.floor(seconds / 60) + ' m')
      seconds = seconds % 60
    }

    if (seconds > 0) {
      timeArray.push(seconds + ' s')
    }

    return timeArray.length ? timeArray.join(' ') : ''
  },
}
