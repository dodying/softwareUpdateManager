'use strict'

let data = {
  url: 'https://www.dotpdn.com/downloads/pdn.html',
  version: {
    selector: 'a[href$=".zip"]+b'
  },
  download: {
    selector: 'a[href$=".zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install')
  }
}
module.exports = data
