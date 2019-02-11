'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/yingDev/WGestures/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href$=".zip"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')('install_msi', output, iPath)
  }
}
module.exports = data
