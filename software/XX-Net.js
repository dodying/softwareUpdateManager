'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/XX-net/XX-Net/blob/master/code/default/download.md',
  version: {
    selector: '.markdown-body p:contains("Stable") a'
  },
  download: {
    selector: '.markdown-body p:contains("Stable") a',
    attr: 'href',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
