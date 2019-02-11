'use strict'

let data = {
  url: 'https://www.quickaccesspopup.com/',
  version: {
    selector: 'h5:contains("What\'s new")+p'
  },
  download: {
    plain: 'https://www.quickaccesspopup.com/download/quickaccesspopup.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
