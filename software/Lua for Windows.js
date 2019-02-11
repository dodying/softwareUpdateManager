'use strict'

let data = {
  url: 'https://github.com/rjpcomputing/luaforwindows/releases/latest',
  version: {
    selector: '.muted-link.css-truncate',
    match: /v(\d[\d.-]+)/
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$=".exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
