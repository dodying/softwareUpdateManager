'use strict'

let data = {
  commercial: 3,
  url: 'http://www.wiz.cn/downloads-windows.html',
  version: {
    selector: '#headerCtn>p:contains("最新版本")'
  },
  download: {
    plain: 'http://url.wiz.cn/u/windows',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
