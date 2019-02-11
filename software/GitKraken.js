'use strict'

let data = {
  commercial: 1,
  url: 'https://www.gitkraken.com/download',
  version: {
    selector: '#download strong'
  },
  download: {
    plain: 'https://release.gitkraken.com/win64/GitKrakenSetup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install', 'full.nupkg', null, 'lib\\net45')
  }
}
module.exports = data
