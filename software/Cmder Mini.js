'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/cmderdev/cmder/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href$="mini.zip"]:has(small.text-gray)'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
