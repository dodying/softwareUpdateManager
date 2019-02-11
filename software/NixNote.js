'use strict'

let data = {
  url: 'https://sourceforge.net/projects/nevernote/files',
  version: {
    selector: '.download',
    attr: 'title',
    match: / - (\d+[\d.]+\d+)/
  },
  download: {
    plain: 'https://sourceforge.net/projects/nevernote/files/latest/download',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
