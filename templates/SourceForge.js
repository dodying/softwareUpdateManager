'use strict';

let choiceLast;

const data = {
  url: 'https://sourceforge.net/projects/docfetcher/files/docfetcher/',
  version: async (res, $, fns, choice) => {
    choice = choice ? [].concat(choice) : [];
    choiceLast = choice;
    if (!choice.length) {
      choice.push({
        selector: '[headers="files_name_h"]>a',
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
          selector: i[3] || '[headers="files_name_h"]>a',
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
        selector: '[headers="files_name_h"]>a',
        sort: true
      }, {
        selector: '[headers="files_name_h"]>a[href$="/download"]',
        sort: true,
        matchCheck: '.zip'
      });
    } else {
      choice = choice.map((i, index) => {
        i = [].concat(i);
        return {
          matchCheck: i[0] || (index === choice.length - 1 ? '.zip' : undefined),
          sort: i[1] || true,
          match: i[2],
          selector: i[3] || (index === choice.length - 1 ? '[headers="files_name_h"]>a[href$="/download"]' : '[headers="files_name_h"]>a'),
          attr: i[4]
        };
      });
    }
    const url = await fns.walkLink(res, fns, ...choice);
    const urlArr = url.split('/');
    // return `https://master.dl.sourceforge.net/project/${urlArr[4]}/${urlArr.slice(6, -1).join('/')}`;
    return `https://downloads.sourceforge.net/project/${urlArr[4]}/${urlArr.slice(6, -1).join('/')}`;
  }
};
module.exports = data;
