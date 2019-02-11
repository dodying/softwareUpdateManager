'use strict'

let data = {
  useProxy: true,
  commercial: 2,
  url: 'https://www.tunnelbear.com/core/getVersionHistory?platform=pc',
  version: {
    func: async (res, $) => JSON.parse(res.body)[0].version.match(/(\d+[\d.]+\d+)/)[1]
  },
  download: {
    plain: 'https://tunnelbear.s3.amazonaws.com/downloads/pc/public/TunnelBear-Installer.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_wix')(output, iPath, null, 'TunnelBear.Setup')
  }
}
module.exports = data
