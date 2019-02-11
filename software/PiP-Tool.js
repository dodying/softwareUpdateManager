'use strict'

let data = {
  url: 'https://github.com/LionelJouin/PiP-Tool/releases/latest',
  preferPath: 'PiP-Tool.exe',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$=".msi"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
