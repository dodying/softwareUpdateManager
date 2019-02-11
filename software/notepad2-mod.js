'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/XhmikosR/notepad2-mod/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href$="x64.zip"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
