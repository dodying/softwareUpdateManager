'use strict'

let data = {
  withoutHeader: true,
  url: 'https://sourceforge.net/projects/kdiff3/files/',
  version: {
    selector: 'a.download .sub-label'
  },
  download: {
    plain: 'https://sourceforge.net/projects/kdiff3/files/latest/download',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
