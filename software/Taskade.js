'use strict'

let data = {
  url: 'https://www.taskade.com/downloads',
  version: {
    selector: '.win-app',
    attr: 'href'
  },
  download: {
    selector: '.win-app'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_zipped', null, 'install', 'app-64.7z')
  }
}
module.exports = data
