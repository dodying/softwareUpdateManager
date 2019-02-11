'use strict'

let data = {
  url: 'https://privazer.com/download.php',
  version: {
    selector: 'h1'
  },
  download: {
    plain: 'https://privazer.com/PrivaZer.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
