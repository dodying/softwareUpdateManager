'use strict'

let data = {
  url: 'https://github.com/txthinking/brook/releases/latest',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$="amd64.exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
