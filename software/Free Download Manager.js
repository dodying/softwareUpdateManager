'use strict'

let data = {
  url: 'https://www.freedownloadmanager.org/download.htm',
  version: {
    selector: '.download_btn_new+div'
  },
  download: {
    selector: '.download_btn_new'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath, null, { '{code_CefInstallDir}': require('path').parse(iPath).dir })
  }
}
module.exports = data
