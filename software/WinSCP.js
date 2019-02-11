'use strict'

let data = {
  withoutHeader: true,
  url: 'https://winscp.net/eng/download.php',
  version: {
    selector: 'h1'
  },
  download: {
    selector: 'a[href$="Setup.exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
