'use strict'

let data = {
  url: 'http://madvr.com/',
  version: {
    selector: 'body > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(1) > tbody > tr:nth-child(6) > td:nth-child(3) > div > p:nth-child(1)'
  },
  download: {
    plain: 'http://madshi.net/madVR.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
