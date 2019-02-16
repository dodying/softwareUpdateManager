'use strict'

let data = {
  url: 'https://github.com/iikira/BaiduPCS-Go/releases/latest',
  version: {
    selector: '.muted-link.css-truncate',
    match: /v(.*)/
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$="windows-x64.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single', 'BaiduPCS-Go.exe')
  }
}
module.exports = data
