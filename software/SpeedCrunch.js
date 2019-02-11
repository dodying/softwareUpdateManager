'use strict'

let data = {
  url: 'http://speedcrunch.org/download.html',
  version: {
    selector: 'h1'
  },
  download: {
    selector: '.dl-button[href$="win32.exe"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
