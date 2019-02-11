'use strict'

let data = {
  commercial: 1,
  url: 'https://www.xnview.com/en/xnviewmp/',
  version: {
    selector: '.muted'
  },
  download: {
    plain: 'https://download.xnview.com/XnViewMP-win-x64.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
