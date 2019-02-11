'use strict'

let data = {
  commercial: 2,
  url: 'https://www.zerotier.com/download.shtml',
  preferPath: 'ZeroTier One.exe',
  version: {
    selector: 'body > div > div.zt-page > div.zt-page-main > b'
  },
  download: {
    plain: 'https://download.zerotier.com/dist/ZeroTier%20One.msi'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
