'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/v2ray/v2ray-core/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href$="windows-64.zip"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
