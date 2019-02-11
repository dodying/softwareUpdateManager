'use strict'

let data = {
  url: 'https://github.com/frostwire/frostwire/releases',
  version: {
    selector: '.muted-link:contains("desktop")'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$="windows.github.exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
