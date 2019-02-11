'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/James1201/Fanhuaji-GUI-Release/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href$="win64.7z"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
