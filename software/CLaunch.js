'use strict'

let data = {
  useProxy: true,
  url: 'http://hp.vector.co.jp/authors/VA018351/claunch.html',
  version: {
    selector: '.links a'
  },
  download: {
    selector: '.links a:contains("64-bit")',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
