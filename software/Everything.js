'use strict'

let data = {
  url: 'https://www.voidtools.com/downloads/',
  version: {
    selector: '#dl'
  },
  download: {
    plain: 'https://www.voidtools.com/Everything-{version}.x64.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
