'use strict';

const data = { // Visual C++ Redistributable Runtimes
  url: 'https://gitlab.com/api/v4/projects/11037551/releases',
  version: (res, $) => res.json[0].tag_name.match(/v(.*)/)[1],
  changelog: (res, $) => res.json[0].description,
  download: async (res, $, fns, choice) => {
    const $1 = fns.cheerio.load(res.json[0].description_html);
    return [$1('[href*="2019_WinAll"]').eq(0).attr('href'), '.wa'];
  }
};
module.exports = data;
