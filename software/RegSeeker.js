'use strict'

let data = {
  commercial: 1,
  url: 'http://www.hoverdesk.net/download.php',
  version: {
    selector: '.blog-date+h4'
  },
  download: {
    selector: 'a[href$=".zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
