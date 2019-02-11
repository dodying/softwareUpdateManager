'use strict'

let data = {
  commercial: 1,
  url: 'https://www.getmusicbee.com/downloads/',
  version: {
    selector: '.installer_layer_wrapper>h2'
  },
  download: {
    selector: 'a[href*="Portable"][href$=".zip/file"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install')
  }
}
module.exports = data
