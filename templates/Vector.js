'use strict';

const data = {
  url: 'https://www.vector.co.jp/soft/dl/winnt/writing/se501948.html',
  version: ['.version', 'text', /(.*)/],
  download: async (res, $, fns) => {
    const url = $('.action .download').attr('href');
    const res1 = await fns.req(url);
    const $1 = fns.cheerio.load(res1.body);
    return $1('#summary a').attr('href');
  }
};
module.exports = data;
