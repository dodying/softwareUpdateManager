'use strict'

let data = {
  url: 'https://sourceforge.net/projects/wxhexeditor/files/',
  version: {
    selector: 'a.download .sub-label'
  },
  download: {
    plain: 'https://sourceforge.net/projects/wxhexeditor/files/latest/download',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
