'use strict'

let data = {
  url: 'http://www.cloudbuckit.com/download',
  preferPath: 'CloudBuckitApp.exe',
  version: {
    selector: '.text-center>strong+span'
  },
  download: {
    plain: 'http://www.cloudbuckit.com/downloads/CloudBuckit-Setup.msi'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
