'use strict'

let data = {
  url: 'http://www.uderzo.it/main_products/space_sniffer/download_alt.html',
  version: {
    selector: 'body > div > table:nth-child(8) > tbody > tr > td:nth-child(1) > a'
  },
  download: {
    selector: 'body > div > table:nth-child(8) > tbody > tr > td:nth-child(1) > a'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, '.pdf')
  }
}
module.exports = data
