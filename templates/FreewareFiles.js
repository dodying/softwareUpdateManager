'use strict'

let data = {
  url: 'https://www.freewarefiles.com/Discord-Download-Page-108759.html',
  version: {
    selector: '.download-title>a'
  },
  download: {
    selector: '.dwnlocations'
  },
  install: function (output, iPath, fns) {
    return fns.install(output, iPath)
  }
}
module.exports = data
