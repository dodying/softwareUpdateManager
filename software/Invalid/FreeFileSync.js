'use strict'

let data = {
  url: 'https://freefilesync.org/download.php',
  version: {
    selector: '.changelog-header'
  },
  download: {
    selector: '.dl-section .direct-download-link[href*="Windows"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
