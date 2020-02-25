'use strict'

let data = {
  url: 'https://filehippo.com/download_spacesniffer/',
  version: ['[data-qa="program-version"]', 'text', /(.*)/],
  changelog: '.program-changelog',
  download: async (res, $, fns) => {
    let uri1 = $('[data-qa="program-actions-header-download"]').eq(0).attr('href')
    let res1 = await fns.req(uri1)
    let $1 = fns.cheerio.load(res1.body)
    let uri2 = $1('[data-qa-download-url]').attr('data-qa-download-url')
    return uri2
  }
}
module.exports = data
