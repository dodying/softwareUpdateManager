'use strict'

let data = {
  useProxy: true,
  url: 'https://www.qbittorrent.org/download.php',
  version: {
    selector: '.flexbox strong'
  },
  download: {
    selector: '.flexbox a[href*="x64_setup.exe"]',
    attr: 'href',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
