'use strict';

let downloadUrl;

const data = {
  version: async (res, $, fns, choice = {}) => {
    if (choice && (typeof choice === 'string' || choice instanceof Array)) {
      choice = [].concat(choice);
      choice = { url: choice[0], match: choice[1], replace: choice[2] };
    }

    if (!choice.url.match(/^https?:/)) choice.url = $(choice.url).eq(0).attr('href');
    const res1 = await fns.reqHEAD(choice.url);
    downloadUrl = res1.request.uri.href;

    let filename;
    if (res1.headers['content-disposition'] && res1.headers['content-disposition'].match(/filename="(.*)"/)) {
      filename = res1.headers['content-disposition'].match(/filename="(.*)"/)[1];
    } else {
      filename = res1.request.uri.href;
    }
    console.debug({ downloadUrl, filename });

    let version = decodeURIComponent(filename).match(choice.match || /(\d+[\d.]+\d+)/);
    if (choice.replace) {
      version = version[0].replace(choice.match, choice.replace);
    } else {
      version = version[1];
    }
    return version;
  },
  download: () => downloadUrl
};
module.exports = data;
