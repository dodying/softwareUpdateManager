'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/freegate-release/website/',
  version: {
    selector: 'article.markdown-body h3'
  },
  download: {
    plain: 'https://raw.githubusercontent.com/freegate-release/website/gh-pages/files/fgp.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
