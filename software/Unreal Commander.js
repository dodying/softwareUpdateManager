'use strict'

let data = {
  url: 'https://x-diesel.com/?download',
  version: {
    selector: '#style1'
  },
  download: {
    plain: 'https://x-diesel.com/download/uncomsetup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
