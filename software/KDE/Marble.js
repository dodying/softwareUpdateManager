'use strict'

let data = {
  url: 'https://marble.kde.org/install.php',
  version: {
    selector: 'a[href$="x64.exe"]'
  },
  download: {
    func: async (res, $) => $('a[href$="x64.exe"]').eq(0).href.replace('http://files.kde.org/', 'https://mirrors.shu.edu.cn/kde/files/')
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
