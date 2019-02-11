'use strict'

let data = {
  url: 'https://dynvpn.com/download/',
  version: {
    selector: 'h3'
  },
  download: {
    selector: 'body > section.section-content > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > a'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
