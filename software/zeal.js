'use strict'

let data = {
  useProxy: true,
  url: 'https://zealdocs.org/download.html',
  version: {
    selector: 'a[href*="portable"][href$="x64.7z"]',
    attr: 'href'
  },
  download: {
    selector: 'a[href*="portable"][href$="x64.7z"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
