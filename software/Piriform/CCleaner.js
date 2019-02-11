'use strict'

let data = {
  commercial: 2,
  url: 'https://www.ccleaner.com/ccleaner/download',
  version: {
    selector: '.icon_square:contains("Release notes")+div strong'
  },
  download: {
    func: async (res, $, req, cheerio) => {
      let res1 = await req('https://www.ccleaner.com/ccleaner/download/standard')
      let $1 = cheerio.load(res1.body)
      return $1('[data-download-url]').attr('data-download-url')
    }
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath, '\\$_\\d+_')
  }
}
module.exports = data
