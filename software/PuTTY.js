'use strict'

let data = {
  url: 'https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html',
  preferPath: 'putty.exe',
  version: {
    selector: 'h1'
  },
  download: {
    selector: 'a[href$="installer.msi"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
