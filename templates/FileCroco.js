'use strict'

let data = {
  url: 'https://www.filecroco.com/download-discord/download/',
  version: {
    selector: 'h1'
  },
  download: {
    selector: '.btn_dld_2'
  },
  install: function (output, iPath, fns) {
    return fns.install(output, iPath)
  }
}
module.exports = data
