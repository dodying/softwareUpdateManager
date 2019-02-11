'use strict'

let data = {
  url: 'https://apps.ankiweb.net/',
  version: {
    selector: '#windows a.btn'
  },
  download: {
    selector: '#windows a.btn'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
