'use strict'

let data = {
  url: 'http://www.imagemagick.org/script/download.php#windows',
  version: {
    selector: 'a[href*="portable"][href$="x64.zip"]',
    attr: 'href'
  },
  download: {
    selector: 'a[href*="portable"][href$="x64.zip"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
