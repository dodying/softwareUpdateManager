'use strict'

let data = {
  url: 'https://sourceforge.net/projects/xlideit/files',
  version: {
    selector: 'a.download .sub-label'
  },
  download: {
    plain: 'https://sourceforge.net/projects/xlideit/files/latest/download',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single')
  }
}
module.exports = data
