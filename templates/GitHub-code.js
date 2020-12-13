'use strict';

let choiceLast;

const data = {
  url: 'https://github.com/OneQuick/OneQuick.github.io/tree/master/bin',
  version: async (res, $, fns, choice) => {
    choice = choice ? [].concat(choice) : [];
    choiceLast = choice;
    if (!choice.length) {
      choice.push({
        selector: '.js-navigation-open[title]',
        attr: 'text',
        sort: true,
        match: /(\d+[\d.-]+\d+)/
      });
    } else {
      choice = choice.map((i, index) => {
        i = [].concat(i);
        return {
          match: i[0],
          sort: i[1] || true,
          matchCheck: i[2],
          selector: i[3] || '.js-navigation-open[title]',
          attr: i[4] || index === choice.length - 1 ? 'text' : 'href'
        };
      });
    }
    return fns.walkLink(res, fns, ...choice);
  },
  download: async (res, $, fns, choice) => {
    choice = choice || choiceLast;
    choice = choice ? [].concat(choice) : [];
    if (!choice.length) {
      choice.push({
        selector: '.js-navigation-open[title]',
        sort: true
      });
    } else {
      choice = choice.map((i, index) => {
        i = [].concat(i);
        return {
          matchCheck: i[0] || (index === choice.length - 1 ? '.zip' : undefined),
          sort: i[1] || true,
          match: i[2],
          selector: i[3] || '.js-navigation-open[title]',
          attr: i[4]
        };
      });
    }
    const url = await fns.walkLink(res, fns, ...choice);
    return url.replace('/blob/', '/raw/');
  }
};
module.exports = data;
