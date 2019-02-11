'use strict'

let data = {
  url: 'https://github.com/WikidPad/WikidPad/releases/',
  version: {
    selector: '.muted-link.css-truncate',
    match: /WikidPad-(.*)/
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$=".exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
