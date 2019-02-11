'use strict'

let data = {
  url: 'https://www.nirsoft.net/utils/dpapi_data_decryptor.html',
  version: {
    selector: '.utilcaption'
  },
  download: {
    plain: 'https://www.nirsoft.net/toolsdownload/dataprotectiondecryptor-x64.zip'
  },
  install: function (output, iPath) {
    return require('./../../js/install_zipped')(output, iPath, 'install_single', '.exe')
  }
}
module.exports = data
