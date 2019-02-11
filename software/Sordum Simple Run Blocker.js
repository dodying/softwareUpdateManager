'use strict'

let data = {
  url: 'https://www.sordum.org/8486/',
  version: {
    selector: '.entry-title'
  },
  download: {
    plain: 'https://www.sordum.org/files/simple-run-blocker/RunBlock.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
