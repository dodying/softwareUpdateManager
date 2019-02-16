'use strict'

let data = {
  commercial: 1,
  url: 'http://www.faststone.org/FSViewerDownload.htm',
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
