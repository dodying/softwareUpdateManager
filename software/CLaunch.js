'use strict'

let data = {
  url: 'http://hp.vector.co.jp/authors/VA018351/claunch.html',
  version: {
    selector: '.links a'
  },
  download: {
    selector: '.links a:contains("64-bit")'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
