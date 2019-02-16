'use strict'

let data = {
  commercial: 1,
  url: 'https://neosmart.net/Software/Changelog/26',
  version: {
    selector: 'a[name]'
  },
  download: {
    func: async (res, $, req, cheerio) => require('./../../js/download_neosmart')(res, $, req, cheerio)
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
