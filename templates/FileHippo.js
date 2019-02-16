'use strict'

let data = {
  url: 'https://filehippo.com/download_spacesniffer/',
  version: {
    selector: '.title-text>span:nth-child(2)',
    match: /(.*)/
  },
  download: {
    func: async (res, $, req, cheerio) => {
      let res1 = await req($('.download-button').eq(0).attr('href'))
      let $1 = cheerio.load(res1.body)
      return $1('#download-link').attr('href')
    },
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
