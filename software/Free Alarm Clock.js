'use strict'

let data = {
  commercial: 2,
  url: 'http://freealarmclocksoftware.com/',
  version: {
    selector: 'a[style="FONT-SIZE: 10pt"][href$="FreeAlarmClockSetup.exe"]'
  },
  download: {
    plain: 'http://freealarmclocksoftware.com/FreeAlarmClockPortable.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
