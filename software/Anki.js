'use strict'

let data = {
  useProxy: true,
  url: 'https://apps.ankiweb.net/',
  version: {
    selector: '#windows a.btn'
  },
  download: {
    selector: '#windows a.btn',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
