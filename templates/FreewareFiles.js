'use strict'

let data = {
  url: 'https://www.freewarefiles.com/Discord-Download-Page-108759.html',
  version: {
    selector: '.download-title>a'
  },
  download: {
    selector: '.dwnlocations',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
