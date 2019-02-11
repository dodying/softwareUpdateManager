'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/yinghuocho/firefly-proxy/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    plain: 'https://raw.githubusercontent.com/xiayhc/yhc/master/greenyhc.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
