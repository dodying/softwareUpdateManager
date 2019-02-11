'use strict'

let data = {
  url: 'http://www.jrsoftware.org/isdl.php',
  version: {
    selector: '.standard tbody>tr:nth-child(2)>td'
  },
  download: {
    plain: 'http://www.jrsoftware.org/download.php/is.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
