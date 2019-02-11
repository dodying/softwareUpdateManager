'use strict'

let data = {
  url: 'https://tortoisegit.org/download/',
  preferPath: 'bin/TortoiseGitBlame.exe',
  version: {
    selector: 'h1+p'
  },
  download: {
    selector: '.dl[href$="64bit.msi"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
