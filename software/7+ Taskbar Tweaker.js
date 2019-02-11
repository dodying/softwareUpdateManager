'use strict'

let data = {
  useProxy: true,
  url: 'https://rammichael.com/downloads/7tt_setup.exe?changelog',
  version: {
    selector: 'b'
  },
  download: {
    plain: 'https://rammichael.com/downloads/7tt_setup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, '^inject.dll')
  }
}
module.exports = data
