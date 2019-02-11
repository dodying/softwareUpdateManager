'use strict'

let data = {
  url: 'https://www.cockos.com/licecap/',
  version: {
    selector: 'a[href$="install.exe"]'
  },
  download: {
    selector: 'a[href$="install.exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single', 'licecap.exe')
  }
}
module.exports = data
