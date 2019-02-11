'use strict'

let data = {
  url: 'http://hddscan.com/',
  version: {
    selector: 'body > center > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div:nth-child(2)'
  },
  download: {
    plain: 'http://hddscan.com/download/HDDScan.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
