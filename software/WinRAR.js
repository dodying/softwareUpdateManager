'use strict'

let data = {
  commercial: 2,
  url: 'https://www.rarlab.com/download.htm',
  version: {
    selector: 'body > table > tbody > tr > td.maintd2 > table:nth-child(4) > tbody > tr:nth-child(3) > td:nth-child(1) > a',
    match: /\(64 bit\)\s+(.*)/
  },
  download: {
    selector: 'body > table > tbody > tr > td.maintd2 > table:nth-child(4) > tbody > tr:nth-child(3) > td:nth-child(1) > a'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
