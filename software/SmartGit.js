'use strict'

let data = {
  commercial: true,
  url: 'https://www.syntevo.com/smartgit/download/',
  version: {
    selector: '.formatted-content'
  },
  download: {
    selector: 'a[href*="portable"][href$=".7z"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
