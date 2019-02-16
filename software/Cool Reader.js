'use strict'

let data = {
  withoutHeader: true,
  url: 'https://sourceforge.net/projects/crengine/files/',
  version: {
    selector: 'a.download .sub-label'
  },
  download: {
    plain: 'https://sourceforge.net/projects/crengine/files/latest/download',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
