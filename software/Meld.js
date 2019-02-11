'use strict'

let data = {
  url: 'http://meldmerge.org/',
  preferPath: 'Meld.exe',
  version: {
    selector: 'a[href$=".msi"]'
  },
  download: {
    selector: 'a[href$=".msi"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
