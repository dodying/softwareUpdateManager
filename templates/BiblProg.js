'use strict'

let data = {
  url: 'https://biblprog.com/en/dropbox/download/',
  version: '[itemprop="softwareVersion"]',
  changelog: async (res, $, fns) => {
    let url = data.url.replace(/\/download\/$/, '/historychanges/')
    let res1 = await fns.req(url)
    let $1 = fns.cheerio.load(res1.body)
    return $1('.page_content>ul').eq(0).text()
  },
  download: '.download_prog a'
}
module.exports = data
