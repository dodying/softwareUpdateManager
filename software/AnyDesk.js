'use strict'

let data = {
  commercial: true,
  url: 'https://anydesk.com/platforms/windows',
  version: {
    selector: '#updates .u-type-bold'
  },
  download: {
    plain: 'http://download.anydesk.com/AnyDesk.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
