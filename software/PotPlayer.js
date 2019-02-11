'use strict'

let data = {
  url: 'https://potplayer.daum.net/',
  version: {
    selector: '.tit_version'
  },
  download: {
    plain: 'http://get.daum.net/PotPlayer64/Version/Latest/PotPlayerSetup64.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
