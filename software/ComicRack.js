'use strict'

let data = {
  url: 'http://comicrack.cyolito.com/downloads',
  version: {
    selector: 'strong:contains("ComicRack for Windows")'
  },
  download: {
    selector: '.btn-lg'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
