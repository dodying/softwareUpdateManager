'use strict'

let data = {
  url: 'https://filehippo.com/download_spacesniffer/',
  version: {
    selector: '.title-text>span:nth-child(2)',
    match: /(.*)/
  },
  download: {
    func: async (res, $) => {
      let url = $('.download-button').eq(0).attr('href')
      let res1 = await require('request-promise').get(url)
      let $1 = require('cheerio').load(res1)
      return $1('#download-link').attr('href')
    },
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
