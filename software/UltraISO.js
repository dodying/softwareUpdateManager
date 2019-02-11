'use strict'

let data = {
  url: 'https://www.ultraiso.com/download.html',
  version: {
    selector: '#main > table > tbody > tr:nth-child(7) > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td:nth-child(1)'
  },
  download: {
    selector: 'a[href$=".exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
