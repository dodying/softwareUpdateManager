'use strict'

let data = {
  commercial: true,
  url: 'https://www.ccleaner.com/recuva/download',
  version: {
    selector: '.icon_edit+strong'
  },
  download: {
    func: async () => {
      let url = 'https://www.ccleaner.com/recuva/download/standard'
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
