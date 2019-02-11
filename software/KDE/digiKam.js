'use strict'

let data = {
  url: 'https://mirrors.shu.edu.cn/kde/ftp/stable/digikam/?C=N&O=D',
  version: {
    selector: 'a[href$="Win64.exe"]'
  },
  download: {
    selector: 'a[href$="Win64.exe"]'
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
