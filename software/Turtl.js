'use strict'

let data = {
  url: 'https://github.com/turtl/desktop/releases/latest',
  preferPath: 'turtl.exe',
  version: {
    selector: '.muted-link.css-truncate',
    match: /v(.*)/
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$="windows64.msi"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
