'use strict';

const data = {
  version: ['[itemprop="softwareVersion"]', 'text', /(.*)/],
  changelog: 'p:has(#whatsnew)+ul',
  download: async (res, $, fns, choice) => {
    let link;
    if ($('.download_options .multi_line>li>a').length) {
      let links = $('.download_options .multi_line>li>a').toArray().map(i => {
        return {
          text: $(i).text().trim(),
          link: $(i).attr('href')
        };
      });

      if (choice) links = links.filter(i => i.text.match(choice));
      link = links[0].link;
    } else {
      link = $('.download_button').eq(0).attr('href');
    }

    const res1 = await fns.req(link);
    return 'https://www.techspot.com/downloads' + res1.body.match(/location.href="\/downloads(.*?)"/)[1];
  }
};
module.exports = data;
