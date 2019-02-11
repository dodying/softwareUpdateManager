'use strict'

let data = {
  url: 'https://www.gnupg.org/download/index.html',
  version: {
    selector: '#text-1-1 > table > tbody:nth-child(3) > tr > td:nth-child(2)'
  },
  download: {
    selector: 'a[href$=".exe"][href*="w32"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
