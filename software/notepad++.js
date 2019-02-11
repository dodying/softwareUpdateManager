'use strict'

let data = {
  useProxy: true,
  url: 'https://notepad-plus-plus.org/download/',
  version: {
    selector: 'h1'
  },
  download: {
    selector: 'a[href$="x64.7z"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
