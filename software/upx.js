'use strict'

let data = {
  url: 'https://github.com/upx/upx/releases/latest',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href*="win64"][href$=".zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single', 'upx.exe')
  }
}
module.exports = data
