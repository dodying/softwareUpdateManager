'use strict'

let data = {
  commercial: true,
  useProxy: true,
  url: 'http://www.easersoft.com/product.html',
  version: {
    selector: 'a[href$=".zip"]+span>span'
  },
  download: {
    plain: 'http://www.easersoft.com/Download/ExtremeCopy-{version}-pro-64bits.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')('install_msi', output, iPath)
  }
}
module.exports = data
