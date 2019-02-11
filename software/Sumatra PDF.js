'use strict'

let data = {
  url: 'https://www.sumatrapdfreader.org/sumatra.js',
  version: {
    func: async (res, $) => res.body.match(/gSumVer = "(.*)"/)[1]
  },
  download: {
    plain: 'https://www.sumatrapdfreader.org/dl/SumatraPDF-{version}-64.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
