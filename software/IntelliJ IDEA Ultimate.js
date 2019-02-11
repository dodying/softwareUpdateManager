'use strict'

let data = {
  commercial: 3,
  url: 'https://data.services.jetbrains.com/products/releases?code=IIU&latest=true&type=release',
  version: {
    func: async (res, $) => JSON.parse(res.body).IIU[0].version
  },
  download: {
    func: async (res, $) => JSON.parse(res.body).IIU[0].downloads.windowsZip.link
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
