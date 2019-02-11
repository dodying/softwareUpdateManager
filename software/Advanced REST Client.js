'use strict'

let data = {
  url: 'https://github.com/advanced-rest-client/arc-electron/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$="setup.exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install', 'app-64.7z')
  }
}
module.exports = data
