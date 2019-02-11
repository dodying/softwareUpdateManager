'use strict'

let data = {
  url: 'https://irzyxa.blogspot.com/p/downloads.html',
  version: {
    selector: '.entry-content span[style*="0069d2"]'
  },
  download: {
    selector: '.entry-content a[href$=".zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, 'Config.ini')
  }
}
module.exports = data
