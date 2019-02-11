'use strict'

let data = {
  useProxy: true,
  url: 'https://www.filehorse.com/download-freegate/download/',
  version: {
    selector: '.pageing>li:nth-child(3)'
  },
  download: {
    selector: '#download_url'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
