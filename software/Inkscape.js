'use strict'

let data = {
  url: 'https://inkscape.org/release/',
  version: {
    selector: '#sidecategory>h1'
  },
  download: {
    plain: 'https://media.inkscape.org/dl/resources/file/inkscape-{version}-x64.7z'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
