'use strict'

let data = {
  commercial: 2,
  url: 'https://hotalarmclock.com/download/',
  version: {
    selector: '#idesc > table:nth-child(5) > tbody > tr:nth-child(1) > th'
  },
  download: {
    plain: 'https://hotalarmclock.com/files/HotAlarmClockSetup.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_inno')
  }
}
module.exports = data
