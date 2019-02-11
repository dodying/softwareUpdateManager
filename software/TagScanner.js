'use strict'

let data = {
  url: 'https://www.xdlab.ru/en/download.htm',
  version: {
    selector: 'a[href$=".zip"]'
  },
  download: {
    selector: 'a[href$=".zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
