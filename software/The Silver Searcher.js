'use strict'

let data = {
  url: 'https://github.com/k-takata/the_silver_searcher-win32/releases',
  version: {
    selector: '.muted-link.css-truncate',
    match: /(.*)/
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$="x64.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single', '.exe')
  }
}
module.exports = data
