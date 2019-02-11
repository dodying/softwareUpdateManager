'use strict'

let data = {
  commercial: 2,
  url: 'https://www.privatetunnel.com/apps/',
  version: {
    selector: 'a[href$=".exe"]',
    attr: 'href'
  },
  download: {
    selector: 'a[href$=".exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
