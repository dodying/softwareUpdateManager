'use strict'

let data = {
  url: 'https://touchpad-blocker.com',
  version: {
    selector: '#quick dd'
  },
  download: {
    plain: 'https://touchpad-blocker.com/files/touchpad-blocker.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single', 'TouchpadBlocker')
  }
}
module.exports = data
