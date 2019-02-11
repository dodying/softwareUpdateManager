'use strict'

let data = {
  url: 'https://mkvtoolnix.download/doc/NEWS.md',
  version: {
    selector: 'body'
  },
  download: {
    plain: 'https://mkvtoolnix.download/windows/releases/{version}/mkvtoolnix-64-bit-{version}-setup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
