module.exports = {
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
}
