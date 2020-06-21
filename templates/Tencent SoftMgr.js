'use strict';

const data = {
  url: 'https://pc.qq.com/detail/1/detail_23761.html',
  version: (res, $, fns, choice = /(\d+[\d.]+\d+)/) => {
    if ($('.detail-other>li:nth-child(3)').length) {
      return $('.detail-other>li:nth-child(3)').text().match(/版本：(.*)/)[1];
    } else if ($('.J_qq_download+a').length) {
      return $('.J_qq_download+a').attr('href').split('/').slice(-1)[0].match(choice)[1];
    }
  },
  changelog: (res, $) => {
    return $('.whatnews').length ? [$('.whatnews').text(), true] : null;
  },
  download: '.detail-install-normal, .J_qq_download+a'
};
module.exports = data;
