'use strict'

let data = {
  url: 'http://www.maxthon.cn/mx5/changelog/',
  version: {
    selector: 'h2'
  },
  download: {
    plain: 'http://www.maxthon.cn/mx5/portable/dl',
    output: '.7z'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
