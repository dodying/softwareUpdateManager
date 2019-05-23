'use strict'

let data = {
  url: 'https://filehippo.com/download_spacesniffer/',
  version: {
    selector: '.title-text>span:nth-child(2)',
    match: /(.*)/
  },
  download: {
    func: async (res, $, fns) => {
      let uri1 = $('.download-button').eq(0).attr('href')
      let res1 = await fns.req(uri1)
      let $1 = fns.cheerio.load(res1.body)
      let uri2 = $1('#download-link').attr('href')
      let res2 = await fns.reqHEAD(uri2)
      return res2.request.uri.href
    }
  },
  install: function (output, iPath, fns) {
    return fns.install(output, iPath)
  }
}
module.exports = data
