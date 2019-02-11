'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/Mapaler/FastCopy-M/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href$="64bit.zip"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
