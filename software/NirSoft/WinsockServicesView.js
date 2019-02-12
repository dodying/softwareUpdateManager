'use strict'

let data = {
  url: 'https://www.nirsoft.net/utils/winsock_service_providers.html',
  version: {
    selector: '.utilcaption'
  },
  download: {
    plain: 'https://www.nirsoft.net/utils/winsockservicesview.zip'
  },
  install: function (output, iPath) {
    return require('./../../js/install_zipped')(output, iPath, 'install_single', '.exe')
  }
}
module.exports = data