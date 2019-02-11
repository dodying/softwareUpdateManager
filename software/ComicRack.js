'use strict'

let data = {
  useProxy: true,
  url: 'http://comicrack.cyolito.com/downloads',
  version: {
    selector: 'strong:contains("ComicRack for Windows")'
  },
  download: {
    selector: '.btn-lg',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
