'use strict'

let data = {
  url: 'https://mixxx.org/download/',
  version: {
    selector: 'h1'
  },
  download: {
    selector: 'a[href$="win64.exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_wix')(output, iPath, null, /mixxx/)
  }
}
module.exports = data
