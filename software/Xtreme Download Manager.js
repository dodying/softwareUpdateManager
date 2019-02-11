'use strict'

let data = {
  url: 'http://xdman.sourceforge.net/',
  version: {
    selector: 'body > div > div > div:nth-child(4) > div > h3',
    match: /Version (\d+[\d.]+\d+)/
  },
  download: {
    plain: 'http://xdman.sourceforge.net/xdman.jar'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
