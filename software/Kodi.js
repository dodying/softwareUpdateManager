'use strict'

let data = {
  url: 'https://kodi.tv/download/849',
  version: {
    selector: '.group-right>h2'
  },
  download: {
    selector: 'a.download-link[href$=".exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
