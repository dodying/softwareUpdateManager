'use strict'

let data = {
  commercial: true,
  url: 'http://www.eassos.com/download.php',
  version: {
    selector: 'tr:contains("DiskGenius") .download-ver'
  },
  download: {
    selector: '.menu-partitionguru .par-group>a',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno_with_bit')(output, iPath)
  }
}
module.exports = data
