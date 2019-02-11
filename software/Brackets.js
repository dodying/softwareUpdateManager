'use strict'

let data = {
  url: 'https://github.com/adobe/brackets/releases/latest',
  preferPath: 'Brackets.exe',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$=".msi"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
