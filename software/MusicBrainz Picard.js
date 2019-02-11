'use strict'

let data = {
  url: 'https://picard.musicbrainz.org/downloads/',
  version: {
    selector: '#downloads > li:nth-child(2) > div > table > tbody > tr > td:nth-child(1)'
  },
  download: {
    selector: 'a[href$=".exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
