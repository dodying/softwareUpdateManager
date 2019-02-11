'use strict'

let data = {
  commercial: true,
  url: 'https://www.ccleaner.com/ccleaner/download',
  version: {
    selector: '.icon_square:contains("Release notes")+div strong'
  },
  download: {
    func: async () => {
      let url = 'https://www.ccleaner.com/ccleaner/download/standard'
      let res = await require('request-promise').get(url)
      const $ = require('cheerio').load(res)
      return $('#BigDownload a').attr('href')
    }
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, '\\$_\\d+_')
  }
}
module.exports = data
