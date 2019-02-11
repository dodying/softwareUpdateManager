'use strict'

let data = {
  url: 'https://biblprog.com/en/google_drive/download/',
  preferPath: 'googledrivesync.exe',
  version: {
    selector: '[itemprop="softwareVersion"]'
  },
  download: {
    plain: 'http://dl.google.com/drive/{version}/gsync.msi'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
