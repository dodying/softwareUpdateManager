'use strict'

let data = {
  url: 'https://en.smath.com/view/SMathStudio/summary',
  version: {
    selector: '[itemprop="softwareVersion"]'
  },
  download: {
    selector: '[title="tar.gz package"]+[itemprop="downloadUrl"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
