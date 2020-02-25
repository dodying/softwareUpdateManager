'use strict'

let data = {
  url: 'https://www.freewarefiles.com/Discord-Download-Page-108759.html',
  version: '.download-title>a',
  changelog: async (res, $, fns) => {
    let url = data.url.replace('-Download-Page-', '_changelog_')
    let res1 = await fns.req(url)
    let $1 = fns.cheerio.load(res1.body)
    return $1('.product-description-holder>ul').eq(0).text()
  },
  download: '.dwnlocations'
}
module.exports = data
