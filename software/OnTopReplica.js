'use strict'

let data = {
  url: 'https://github.com/LorenzCK/OnTopReplica/releases/latest',
  preferPath: 'OnTopReplica.exe',
  version: {
    selector: '.muted-link.css-truncate',
    match: /v(.*)/
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$=".zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_msi', null, null, data.preferPath)
  }
}
module.exports = data
