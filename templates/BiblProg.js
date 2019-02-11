'use strict'

let data = {
  url: 'https://biblprog.com/en/dropbox/download/',
  version: {
    selector: '[itemprop="softwareVersion"]'
  },
  download: {
    selector: '.download_prog a',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')('install', output, iPath, null, 'Installer.exe', null, '$0')
  }
}
module.exports = data
