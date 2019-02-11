'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/egoist/devdocs-desktop/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href$=".exe"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')('install', output, iPath, '*\\app-64.7z')
  }
}
module.exports = data
