'use strict';

const data = {
  url: 'https://github.com/aria2/aria2/releases/latest',
  version: async (res, $, fns, choice = {}) => {
    if (choice && (typeof choice === 'string' || choice instanceof Array || choice instanceof RegExp)) {
      choice = [].concat(choice);
      choice = { match: choice[0], header: choice[1] };
    }

    const text = $(choice.header ? '.release-header a' : '.muted-link.css-truncate').eq(0).text().trim();
    // if (true) {
    //   let uri1 = res.request.uri.href.match(/https?:\/\/github.com\/.*?\/releases/)[0]
    //   if (!res.request.uri.href.match('releases/tag/')) uri1 += '/latest'
    //   let res1 = await fns.req(uri1)
    //   let $1 = fns.cheerio.load(res1.body)
    //   let text1 = $1(choice.header ? '.release-header a' : '.muted-link.css-truncate').eq(0).text().trim()
    //   if (text !== text1) console.log({ text, text1, equal: text === text1 })
    // }
    if (choice.match) {
      return text.match(choice.match)[1];
    } else if (text.match(/^v(.*)$/i)) {
      return text.match(/^v(.*)$/i)[1];
    } else {
      return text;
    }
  },
  changelog: '.release-header+.markdown-body',
  download: async (res, $, fns, choice) => {
    choice = [].concat(choice);
    const href = $(`a[href*="/releases/download/"]${choice[0] || '[href$=".zip"]'}`).eq(0).attr('href');
    return [href, choice[1]];
  }
};
module.exports = data;
