'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/HelloZeroNet/ZeroNet/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    plain: 'https://github.com/HelloZeroNet/ZeroNet-win/archive/dist/ZeroNet-win.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
