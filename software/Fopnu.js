'use strict'

let data = {
  url: 'https://www.fopnu.com/download/windows64.html',
  version: {
    selector: 'a[href$="install.exe"]'
  },
  download: {
    selector: 'a[href$="install.exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single')
  }
}
module.exports = data
