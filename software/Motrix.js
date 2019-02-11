'use strict'

let data = {
  url: 'https://github.com/agalwood/Motrix/releases',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$=".zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install', 'app-64.7z')
  }
}
module.exports = data
