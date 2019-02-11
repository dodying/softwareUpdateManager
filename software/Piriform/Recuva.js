'use strict'

let data = {
  commercial: 2,
  url: 'https://www.ccleaner.com/recuva/download',
  version: {
    selector: '.icon_edit+strong'
  },
  download: {
    func: async (res, $, req, cheerio) => {
      let res1 = await req('https://www.ccleaner.com/recuva/download/standard')
      let $1 = cheerio.load(res1.body)
      return $1('#BigDownload a').attr('href')
    }
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath, '\\$_\\d+_')
  }
}
module.exports = data
