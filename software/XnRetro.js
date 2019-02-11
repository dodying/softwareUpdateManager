'use strict'

let data = {
  url: 'https://www.xnview.com/en/xnretro/',
  version: {
    selector: '.muted'
  },
  download: {
    plain: 'http://download.xnview.com/XnRetro-win-x64.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
