'use strict'

let data = {
  url: 'https://tortoisesvn.net/downloads.html',
  preferPath: 'bin/TortoiseBlame.exe',
  version: {
    selector: '.title +div>h1'
  },
  download: {
    selector: 'a[href*="x64"][href$=".msi"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
