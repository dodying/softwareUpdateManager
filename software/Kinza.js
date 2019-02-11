'use strict'

let data = {
  url: 'https://www.kinza.jp/en/download/thankyou/windows_x64/',
  version: {
    selector: 'body > section > div > p > a',
    attr: 'href',
    match: /kinza_x64_([\d.]+).exe/
  },
  download: {
    selector: 'body > section > div > p > a'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install')
  }
}
module.exports = data
