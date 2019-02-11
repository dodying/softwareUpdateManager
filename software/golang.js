'use strict'

let data = {
  url: 'https://golang.org/dl/',
  preferPath: 'golang.exe',
  version: {
    selector: '.toggleButton'
  },
  download: {
    selector: '.download[href$="amd64.msi"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
