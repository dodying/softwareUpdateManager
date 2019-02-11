'use strict'

let data = {
  url: 'https://mpc-hc.org/downloads/',
  version: {
    selector: '.downloads-version'
  },
  download: {
    selector: 'a[href$="x64.7z"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
