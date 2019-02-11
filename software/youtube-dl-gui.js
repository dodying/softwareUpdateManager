'use strict'

let data = {
  url: 'https://github.com/MrS0m30n3/youtube-dl-gui/releases/latest',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$="win-setup.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_inno')
  }
}
module.exports = data
