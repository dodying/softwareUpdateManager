'use strict'

let data = {
  url: 'https://www.filecroco.com/download-discord/download/',
  version: {
    selector: 'h1'
  },
  download: {
    selector: '.btn_dld_2',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
