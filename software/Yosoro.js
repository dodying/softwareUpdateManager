'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/IceEnd/Yosoro/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href*="win32-x64"][href$=".zip"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
