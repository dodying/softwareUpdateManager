'use strict'

let data = {
  commercial: 3,
  url: 'http://www.faststone.org/FSCapturerDownload.htm',
  version: {
    selector: 'b>font[size="2"]'
  },
  download: {
    selector: 'a[href$=".zip"]:not([href*="Setup"])'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
