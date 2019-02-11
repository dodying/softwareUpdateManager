'use strict'

let data = {
  url: 'https://keepass.info/download.html',
  version: {
    selector: 'body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > small > b'
  },
  download: {
    selector: 'a[href$=".zip/download"]',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
