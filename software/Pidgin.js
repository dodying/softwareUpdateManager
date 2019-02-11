'use strict'

let data = {
  url: 'https://www.pidgin.im/',
  version: {
    selector: '.number'
  },
  download: {
    selector: '.sourceforge_accelerator_link',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
