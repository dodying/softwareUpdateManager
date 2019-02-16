'use strict'

let data = {
  url: 'https://u.tools/download.html',
  version: {
    selector: '.v-win64'
  },
  download: {
    selector: '.d-win64'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install', 'app-64.7z')
  }
}
module.exports = data
