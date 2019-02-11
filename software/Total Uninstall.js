'use strict'

let data = {
  commercial: true,
  useProxy: true,
  url: 'https://www.martau.com/uninstaller-download.php',
  version: {
    selector: '.version'
  },
  download: {
    selector: 'a[href*="Setup"][href$=".exe"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno_with_bit')(output, iPath)
  }
}
module.exports = data
