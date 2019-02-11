'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/2dust/v2rayN/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href$=".exe"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
