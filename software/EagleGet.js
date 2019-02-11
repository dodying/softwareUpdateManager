'use strict'

let data = {
  url: 'http://www.eagleget.com/download-eagleget-portable/',
  version: {
    selector: 'a[href^="http://dl."]'
  },
  download: {
    selector: 'a[href^="http://dl."]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
