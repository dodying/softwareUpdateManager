'use strict'

let data = {
  url: 'http://www.softwareok.com/?seite=Freeware/Q-Dir/History',
  version: {
    selector: '#HOPALA_WEG3 > a:nth-child(4)'
  },
  download: {
    plain: 'http://www.softwareok.com/Download/Q-Dir_Portable_x64.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
