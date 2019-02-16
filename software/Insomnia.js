'use strict'

let data = {
  commercial: 2,
  url: 'https://github.com/getinsomnia/insomnia/releases/latest',
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
