'use strict'

let data = {
  url: 'https://www.7-zip.org/download.html',
  version: {
    selector: 'h1+p'
  },
  download: {
    selector: '.Item>a[href$="x64.exe"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
