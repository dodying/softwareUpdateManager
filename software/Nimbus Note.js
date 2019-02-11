'use strict'

let data = {
  commercial: 2,
  url: 'https://nimbusweb.me/nimbus-note-windows.php',
  version: {
    selector: '.product_right_title'
  },
  download: {
    plain: 'https://nimbusweb.me/nimbusnote.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
