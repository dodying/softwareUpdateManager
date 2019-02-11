'use strict'

let data = {
  url: 'https://eternallybored.org/misc/gifsicle/',
  version: {
    selector: 'a[href$="win64.zip"]'
  },
  download: {
    selector: 'a[href$="win64.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
