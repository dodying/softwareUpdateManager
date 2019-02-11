'use strict'

let data = {
  commercial: 2,
  url: 'http://www.winamp.com/',
  version: {
    selector: 'h2'
  },
  download: {
    selector: '.btn-download'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
