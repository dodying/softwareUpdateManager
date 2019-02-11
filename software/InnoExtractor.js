'use strict'

let data = {
  url: 'http://www.havysoft.cl/descargar.html',
  version: {
    selector: '#principal > table:nth-child(6) > tbody > tr:nth-child(1) > td:nth-child(2)'
  },
  download: {
    plain: 'http://www.havysoft.cl/download/IE_Install.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_inno')
  }
}
module.exports = data
