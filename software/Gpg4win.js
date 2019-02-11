'use strict'

let data = {
  url: 'https://gpg4win.org/download.html',
  version: {
    selector: '#main>h2'
  },
  download: {
    plain: 'https://files.gpg4win.org/gpg4win-latest.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
