'use strict'

let data = {
  url: 'https://github.com/BoostIO/boost-releases/releases/latest',
  version: {
    selector: '.muted-link.css-truncate',
    match: /v(.*)/
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$="full.nupkg"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, null, 'lib\\net45')
  }
}
module.exports = data
