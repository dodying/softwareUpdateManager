'use strict'

let data = {
  url: 'https://www.libreoffice.org/download/download/',
  preferPath: 'program/swriter.exe',
  version: {
    selector: '.dl_version_number'
  },
  download: {
    plain: 'https://download.documentfoundation.org/libreoffice/stable/{version}/win/x86_64/LibreOffice_{version}_Win_x64.msi'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
