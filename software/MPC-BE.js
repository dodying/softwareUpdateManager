'use strict'

let data = {
  useProxy: true,
  url: 'https://sourceforge.net/projects/mpcbe/files/',
  version: {
    selector: 'a.download .sub-label'
  },
  download: {
    plain: 'https://sourceforge.net/projects/mpcbe/files/latest/download',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')('install_inno', output, iPath)
  }
}
module.exports = data
