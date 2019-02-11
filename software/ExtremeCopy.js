'use strict'

let data = {
  commercial: 3,
  url: 'http://www.easersoft.com/product.html',
  preferPath: 'ExtremeCopy.exe',
  version: {
    selector: 'a[href$=".zip"]+span>span'
  },
  download: {
    plain: 'http://www.easersoft.com/Download/ExtremeCopy-{version}-pro-64bits.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_msi', null, null, data.preferPath)
  }
}
module.exports = data
