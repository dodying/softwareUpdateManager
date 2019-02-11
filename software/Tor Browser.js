'use strict'

let data = {
  useProxy: true,
  url: 'https://www.torproject.org/download/download-easy.html.en',
  version: {
    selector: '.desc>em'
  },
  download: {
    plain: 'https://www.torproject.org/dist/torbrowser/{version}/torbrowser-install-{version}_zh-CN.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, null, 'Browser\\')
  }
}
module.exports = data
