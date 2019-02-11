'use strict'

let data = {
  url: 'https://www.kdevelop.org/download',
  version: {
    selector: 'a[href$="x64-setup.exe"]'
  },
  download: {
    func: async (res, $) => $('a[href$="x64-setup.exe"]').eq(0).href.replace('http://download.kde.org/', 'https://mirrors.shu.edu.cn/kde/ftp/')
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
