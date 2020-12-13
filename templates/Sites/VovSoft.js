'use strict';

const data = {
  version: 'h1>b',
  changelog: {
    url: '[href^="/version-history/"]',
    selector: '.w3-twothird'
  },
  download: async (res, $, fns, choice) => {
    const uri1 = $('[href^="/download/"]').attr('href');
    const res1 = await fns.req(uri1);
    const $1 = fns.cheerio.load(res1.body);

    return 'https://files.vovsoft.com/' + $1('.w3-cell-middle tbody>tr:nth-child(2)').text().match(/^Filename:(.*)/i)[1];
  }
};
module.exports = data;
