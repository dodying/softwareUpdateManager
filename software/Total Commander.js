'use strict'

let data = {
  commercial: true,
  useProxy: true,
  url: 'https://www.ghisler.com/download.htm',
  version: {
    selector: 'h3'
  },
  download: {
    selector: 'a[href$="x64.exe"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')('install', output, iPath, '*.CAB')
  }
}
module.exports = data
