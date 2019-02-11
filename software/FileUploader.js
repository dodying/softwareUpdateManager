'use strict'

let data = {
  url: 'http://z-o-o-m.eu/down.htm',
  version: {
    selector: '#content a'
  },
  download: {
    plain: 'http://z-o-o-m.eu/down/FileUploader.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
