'use strict'

let data = {
  url: 'http://www.snapfiles.com/downloads/virtualdvd/dlvirtualdvd.html',
  version: {
    selector: '.main-dlink'
  },
  download: {
    selector: '.main-dlink'
  },
  install: function (output, iPath, fns) {
    return fns.install(output, iPath)
  }
}
module.exports = data
