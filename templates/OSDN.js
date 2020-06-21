'use strict';

const data = {
  url: 'https://osdn.net/projects/crystaldiskinfo/releases/',
  version: '.release-item-title a[href*="/releases/"]',
  download: async (res, $, fns, choice = '.zip$') => {
    const elem = $('h4+[id^="release-file-collapse"]');
    const res1 = await fns.req(`https://osdn.net/ajax/downloads/show_release_item_in.php?release_id=${$(elem).attr('data-release_id')}&group_id=${$(elem).attr('data-group_id')}`);
    const $1 = fns.cheerio.load(res1.body);

    const urls = $1('.name>a').toArray().map(i => ({ href: $1(i).attr('href'), text: $1(i).text() }));
    return urls.find(i => i.text.match(choice)).href;
  }
};
module.exports = data;
