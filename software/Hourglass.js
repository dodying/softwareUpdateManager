'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/dziemborowicz/hourglass/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href$="Portable.exe"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
