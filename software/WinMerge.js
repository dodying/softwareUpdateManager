'use strict'

let data = {
  url: 'http://winmerge.org/downloads/',
  version: {
    selector: 'h3'
  },
  download: {
    selector: 'a[href$="x64-exe.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
