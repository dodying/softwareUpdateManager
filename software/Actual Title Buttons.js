'use strict'

let data = {
  commercial: true,
  useProxy: true,
  url: 'https://www.actualtools.com/titlebuttons/',
  version: {
    selector: 'a[href="/titlebuttons/whatsnew/"]'
  },
  download: {
    plain: 'https://www.actualtools.com/files/atbsetup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno_with_bit')(output, iPath)
  }
}
module.exports = data
