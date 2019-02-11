'use strict'

let data = {
  commercial: 3,
  url: 'https://www.martau.com/uninstaller-download.php',
  version: {
    selector: '.version'
  },
  download: {
    selector: 'a[href*="Setup"][href$=".exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno_with_type')(output, iPath)
  }
}
module.exports = data
