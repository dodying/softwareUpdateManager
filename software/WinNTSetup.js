'use strict'

let data = {
  url: 'https://msfn.org/board/topic/149612-winntsetup/',
  version: {
    selector: 'h1'
  },
  download: {
    plain: 'http://jfx.cwcodes.net/WinNTSetup/Release/WinNTSetup3.rar'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
