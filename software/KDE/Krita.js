'use strict'

let data = {
  url: 'https://krita.org/en/download/krita-desktop/',
  version: {
    selector: '#sixty-four-bit-windows-installer',
    attr: 'href'
  },
  download: {
    func: async (res, $) => $('#sixty-four-bit-windows-installer').eq(0).href.replace('http://download.kde.org/', 'https://mirrors.shu.edu.cn/kde/ftp/')
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
