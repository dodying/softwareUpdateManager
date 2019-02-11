'use strict'

let data = {
  url: 'http://1clipboard.io/',
  version: {
    selector: '#section_download .dotted+.text-center'
  },
  download: {
    plain: 'http://1clipboard.io/download/windows/1ClipboardSetup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install', 'full.nupkg', null, 'lib\\net45')
  }
}
module.exports = data
