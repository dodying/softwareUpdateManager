'use strict'

let data = {
  url: 'https://github.com/dscharrer/innoextract/releases/latest',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$="windows.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single', 'innoextract.exe')
  }
}
module.exports = data
