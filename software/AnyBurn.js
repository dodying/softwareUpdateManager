'use strict'

let data = {
  url: 'http://www.anyburn.com/cn/index.htm',
  version: {
    selector: 'font>a[href="download.htm"]',
    match: /v(\d+[\d.]+\d+)/
  },
  download: {
    plain: 'http://www.anyburn.com/anyburn_setup_x64.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
