'use strict'

let data = {
  commercial: 2,
  url: 'http://www.eassos.com/download.php',
  version: {
    selector: 'tr:contains("DiskGenius") .download-ver'
  },
  download: {
    selector: '.menu-partitionguru .par-group>a'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno_with_type')(output, iPath)
  }
}
module.exports = data
