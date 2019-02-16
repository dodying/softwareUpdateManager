'use strict'

let data = {
  url: 'https://neosmart.net/Software/Changelog/23',
  version: {
    selector: 'a[name]'
  },
  download: {
    func: async (res, $, req, cheerio) => require('./../../js/download_neosmart')(res, $, req, cheerio)
  }
}
module.exports = data
