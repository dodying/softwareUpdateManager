'use strict'

let data = {
  url: 'https://plex.tv/api/downloads/1.json',
  version: {
    func: async (res, $) => JSON.parse(res.body).computer.Windows.version
  },
  download: {
    func: async (res, $) => JSON.parse(res.body).computer.Windows.releases[0].url
  },
  install: function (output, iPath) {
    return require('./../js/install_wix')(output, iPath, null, 'pms')
  }
}
module.exports = data
