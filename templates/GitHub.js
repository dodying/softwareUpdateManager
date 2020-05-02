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
  download: async (res, $, fns, choice = '[href$=".zip"]') => {
    choice = [].concat(choice);
    let href;
    if (typeof choice[0] === 'boolean') {
      href = $('a[href*="/archive/"][href$=".zip"]').eq(0).attr('href');
    } else {
      try {
        const elem = $(`a[href*="/releases/download/"]${choice[0] || '[href$=".zip"]'}`);
        if (elem.length === 0) throw new Error('');
        href = elem.eq(0).attr('href');
      } catch (error) {
        const urls = $('a[href*="/releases/download/"]').toArray().map(i => $(i).attr('href'));
        href = urls.find(i => i.split('/').slice(-1)[0].match(choice[0]));
      }
    }
    return [href, choice[1]];
  }
};
module.exports = data;
