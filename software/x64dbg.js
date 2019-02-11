'use strict'

let data = {
  url: 'https://github.com/x64dbg/x64dbg/releases/latest',
  version: {
    selector: '.release-header a',
    match: /(\d+[\d-_]+)/
  },
  download: {
    plain: 'https://sourceforge.net/projects/x64dbg/files/latest/download',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, null, 'release\\')
  }
}
module.exports = data
