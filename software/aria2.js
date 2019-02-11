'use strict'

let data = {
  url: 'https://github.com/aria2/aria2/releases/latest',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href*="win-64bit"][href$=".zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single', 'aria2c.exe')
  }
}
module.exports = data
