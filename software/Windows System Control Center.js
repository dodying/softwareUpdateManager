'use strict'

let data = {
  useProxy: true,
  url: 'http://www.kls-soft.com/wscc/downloads.php',
  version: {
    selector: '.graytext'
  },
  download: {
    plain: 'http://www.kls-soft.com/downloads/wscc_x64.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
