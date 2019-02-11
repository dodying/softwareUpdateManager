'use strict'

let data = {
  commercial: 1,
  url: 'https://www.xnview.com/en/xnview/',
  version: {
    selector: '.muted'
  },
  download: {
    plain: 'https://download.xnview.com/XnView-win-full.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
