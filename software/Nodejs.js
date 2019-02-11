'use strict'

let data = {
  url: 'https://nodejs.org/en/download/current/',
  version: {
    selector: '.color-lightgray>strong'
  },
  download: {
    selector: '.download-matrix a[href$="x64.zip"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
