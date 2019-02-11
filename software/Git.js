'use strict'

let data = {
  url: 'https://github.com/git-for-windows/git/releases/latest',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href*="PortableGit"][href$="64-bit.7z.exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
