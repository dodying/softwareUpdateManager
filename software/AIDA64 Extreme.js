'use strict'

let data = {
  commercial: 2,
  url: 'https://www.aida64.co.uk/download',
  version: {
    selector: 'table.download_table > tbody > tr:nth-child(2) > td.version'
  },
  download: {
    selector: 'table.download_table > tbody > tr:nth-child(2) > td.button > a'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
