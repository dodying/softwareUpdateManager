'use strict'

let data = {
  url: 'https://api.pzhacm.org/iivb/cu.json',
  version: {
    func: async (res, $) => JSON.parse(res.body).Stable.x64.version
  },
  download: {
    func: async (res, $) => JSON.parse(res.body).Stable.x64.url[0]
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install')
  }
}
module.exports = data
