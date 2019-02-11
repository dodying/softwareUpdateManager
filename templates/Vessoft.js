'use strict'

let data = {
  url: 'https://zh.vessoft.com/software/windows/download/minecraft',
  version: {
    selector: '.dd'
  },
  download: {
    selector: '#js_download_link'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
