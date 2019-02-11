'use strict'

let data = {
  commercial: 1,
  url: 'https://community.teamviewer.com/t5/Change-Log-Windows/bd-p/Change_Log_Windows',
  version: {
    selector: '.page-link'
  },
  download: {
    plain: 'https://dl.tvcdn.de/download/TeamViewerPortable.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
