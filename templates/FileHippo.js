'use strict';

const data = {
  url: 'https://filehippo.com/download_spacesniffer/',
  version: ['[data-qa="program-version"]', 'text', /(.*)/],
  changelog: '.program-changelog',
  download: async (res, $, fns) => {
    const uri1 = $('[data-qa="program-actions-header-download"]').eq(0).attr('href');
    const res1 = await fns.req(uri1);
    const $1 = fns.cheerio.load(res1.body);
    const uri2 = $1('[data-qa-download-url]').attr('data-qa-download-url');
    return uri2;
  }
};
module.exports = data;
