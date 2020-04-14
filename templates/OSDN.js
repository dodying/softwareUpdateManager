'use strict';

const data = {
  url: 'https://osdn.net/pkg/crystaldiskinfo/CrystalDiskInfo',
  version: '[id^="release-for-"]>div',
  download: async (res, $, fns, choice) => {
    const elem = $('h4+[id^="release-file-collapse"]');
    const res1 = await fns.req(`https://osdn.net/ajax/downloads/show_release_item_in.php?release_id=${$(elem).attr('data-release_id')}&group_id=${$(elem).attr('data-group_id')}`);
    const $1 = fns.cheerio.load(res1.body);
    return $1('.name>a[href$=".zip/"]').attr('href');
  }
};
module.exports = data;
