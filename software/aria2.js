'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/aria2/aria2/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href*="win-64bit"][href$=".zip"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, null, '*\\aria2c.exe')
  }
}
module.exports = data
