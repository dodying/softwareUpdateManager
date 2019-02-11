'use strict'

let data = {
  url: 'https://www.centbrowser.cn/history.html',
  version: {
    selector: '.list>p',
    attr: 'id'
  },
  download: {
    selector: '.list a[href$="x64_portable.exe"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
