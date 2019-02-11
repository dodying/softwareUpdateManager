'use strict'

let data = {
  url: 'https://github.com/git-for-windows/git/releases/latest',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href*="MinGit"][href$="64-bit.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
