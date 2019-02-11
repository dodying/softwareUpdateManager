'use strict'

let data = {
  useProxy: true,
  url: 'https://golang.org/dl/',
  version: {
    selector: '.toggleButton'
  },
  download: {
    selector: '.download[href$="amd64.msi"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath)
  }
}
module.exports = data
