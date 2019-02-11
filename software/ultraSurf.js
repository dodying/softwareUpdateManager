'use strict'

let data = {
  useProxy: true,
  url: 'http://wujieliulan.com/',
  version: {
    selector: '#Right+div'
  },
  download: {
    plain: 'http://wujieliulan.com/download/u.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
