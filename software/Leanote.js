'use strict'

let data = {
  commercial: 2,
  url: 'http://app.leanote.com/',
  version: {
    selector: 'body > section > div.download > table > tbody > tr:nth-child(1) > td:nth-child(1)'
  },
  download: {
    selector: 'body > section > div.download > table > tbody > tr:nth-child(1) > td:nth-child(3) > a'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
