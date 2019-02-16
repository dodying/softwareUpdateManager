'use strict'

let data = {
  url: 'https://github.com/Crypto-Notepad/Crypto-Notepad/releases/latest',
  version: {
    selector: '.muted-link.css-truncate',
    match: /v(.*)/
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$=".7z"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single')
  }
}
module.exports = data
