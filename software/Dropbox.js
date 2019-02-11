'use strict'

let data = {
  url: 'https://biblprog.com/en/dropbox/download/',
  version: {
    selector: '[itemprop="softwareVersion"]'
  },
  download: {
    selector: '.download_prog a'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install', 'Installer.exe', null, '$0')
  }
}
module.exports = data
