'use strict'

let data = {
  url: 'https://github.com/VerySleepy/verysleepy/releases/latest',
  version: {
    selector: '.muted-link.css-truncate',
    match: /v(.*)/
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$=".exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno_with_type')(output, iPath)
  }
}
module.exports = data
