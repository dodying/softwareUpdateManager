'use strict'

let data = {
  url: 'https://audacious-media-player.org/download',
  version: {
    selector: 'a[href$="win32.zip"]'
  },
  download: {
    selector: 'a[href$="win32.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
