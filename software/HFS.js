'use strict'

let data = {
  url: 'http://www.rejetto.com/hfs/?f=dl',
  version: {
    selector: '#lastver>b',
    match: /(.*)/
  },
  download: {
    plain: 'http://www.rejetto.com/hfs/download',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
