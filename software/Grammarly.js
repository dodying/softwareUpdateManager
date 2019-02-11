'use strict'

let data = {
  url: 'https://www.filehorse.com/download-grammarly/',
  version: {
    selector: '.pageing>li:nth-child(3)'
  },
  download: {
    plain: 'https://download-editor.grammarly.com/windows/GrammarlySetup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install', 'full.nupkg', null, 'lib\\net45')
  }
}
module.exports = data
