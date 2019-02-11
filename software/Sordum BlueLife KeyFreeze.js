'use strict'

let data = {
  url: 'https://www.sordum.org/7921/',
  version: {
    selector: '.entry-title'
  },
  download: {
    plain: 'https://www.sordum.org/files/bluelife-keyfreeze/KeyFreeze.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
