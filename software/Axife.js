'use strict'

let data = {
  commercial: 3,
  url: 'https://www.axife.com/downloads.html',
  version: {
    selector: 'body > div.macro > div.down > table > tbody > tr:nth-child(3) > td:nth-child(2)'
  },
  download: {
    plain: 'http://dl.axife.com/AxifeStandard-Setup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
