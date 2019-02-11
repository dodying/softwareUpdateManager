'use strict'

let data = {
  url: 'http://wincdemu.sysprogs.org/portable/',
  version: {
    selector: '.download_button',
    attr: 'href'
  },
  download: {
    selector: '.download_button',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
