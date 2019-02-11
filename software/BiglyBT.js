'use strict'

let data = {
  url: 'https://github.com/BiglySoftware/BiglyBT/releases/latest',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$=".jar"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
