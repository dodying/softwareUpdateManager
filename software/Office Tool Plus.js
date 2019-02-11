'use strict'

let data = {
  url: 'https://otp.landian.la/zh-cn/',
  version: {
    selector: '.templatemo_homewrapper p'
  },
  download: {
    selector: '.templatemo_homewrapper a',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
