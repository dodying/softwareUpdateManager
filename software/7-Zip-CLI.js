'use strict'

let data = {
  url: 'https://www.7-zip.org/download.html',
  version: {
    selector: 'h1+p'
  },
  download: {
    selector: '.Item>a[href$="x64.exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, null, '7z.exe 7z.dll')
  }
}
module.exports = data
