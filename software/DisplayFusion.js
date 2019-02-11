'use strict'

let data = {
  useProxy: true,
  commercial: true,
  url: 'https://www.displayfusion.com/ChangeLog/',
  version: {
    selector: 'h1+h2'
  },
  download: {
    plain: 'https://www.binaryfortress.com/Data/Download/?package=displayfusion&log=101',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
