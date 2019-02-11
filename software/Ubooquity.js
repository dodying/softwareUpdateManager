'use strict'

let data = {
  url: 'http://vaemendis.net/ubooquity/static2/download',
  version: {
    selector: '#static-2 > p:nth-child(8)'
  },
  download: {
    selector: '#static-2 > p:nth-child(7) > a',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single')
  }
}
module.exports = data
