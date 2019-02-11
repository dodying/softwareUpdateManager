'use strict'

let data = {
  commercial: true,
  url: 'http://www.torchsoft.com/en/download.html',
  version: {
    selector: 'table>tbody>tr'
  },
  download: {
    plain: 'http://www.torchsoft.com/download/RegistryWorkshop.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
