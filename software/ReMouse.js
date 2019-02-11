'use strict'

let data = {
  commercial: 2,
  url: 'https://www.remouse.com/downloads.html',
  version: {
    selector: 'body > div.macro > div.down > table > tbody > tr:nth-child(3) > td:nth-child(2)'
  },
  download: {
    plain: 'http://dl.remouse.com/ReMouseStandard-Setup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
