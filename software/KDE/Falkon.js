'use strict'

let data = {
  url: 'https://www.falkon.org/',
  version: {
    selector: 'h3'
  },
  download: {
    plain: 'https://mirrors.shu.edu.cn/kde/ftp/stable/falkon/{version}/Falkon-{version}.exe'
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
