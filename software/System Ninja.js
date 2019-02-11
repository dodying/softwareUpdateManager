'use strict'

let data = {
  commercial: 2,
  url: 'https://singularlabs.com/software/system-ninja/confirm-download/',
  version: {
    selector: 'h2'
  },
  download: {
    plain: 'https://singularlabs.com/download/10294/',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
