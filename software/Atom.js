'use strict'

let data = {
  url: 'https://github.com/atom/atom/releases/latest',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$="-x64-windows.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data