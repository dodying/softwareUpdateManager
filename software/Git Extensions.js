'use strict'

let data = {
  url: 'https://github.com/gitextensions/gitextensions/releases',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href*="Portable"][href$=".zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
