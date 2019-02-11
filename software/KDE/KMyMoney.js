'use strict'

let data = {
  url: 'https://mirrors.shu.edu.cn/kde/ftp/stable/kmymoney/latest/win64/',
  version: {
    selector: 'a[href$="bin.7z"]',
    match: /mingw32-(.*)-bin/
  },
  download: {
    selector: 'a[href$="bin.7z"]'
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
