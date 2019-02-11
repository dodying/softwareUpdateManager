'use strict'

let data = {
  url: 'http://light-alloy.verona.im/download/',
  version: {
    selector: 'h3>b'
  },
  download: {
    selector: 'a.mirror[href$=".7z"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
