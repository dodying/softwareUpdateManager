'use strict'

let data = {
  url: 'https://www.nirsoft.net/utils/custom_explorer_toolbar.html',
  version: {
    selector: '.utilcaption'
  },
  download: {
    plain: 'https://www.nirsoft.net/utils/customexplorertoolbar.zip'
  },
  install: function (output, iPath) {
    return require('./../../js/install_zipped')(output, iPath, 'install_single', '.exe')
  }
}
module.exports = data
