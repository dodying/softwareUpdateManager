'use strict'

let data = {
  useProxy: true,
  url: 'https://sourceforge.net/projects/launch4j/files/',
  version: {
    selector: 'a.download .sub-label'
  },
  download: {
    plain: 'https://sourceforge.net/projects/launch4j/files/latest/download',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
