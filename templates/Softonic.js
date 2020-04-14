'use strict';

const data = {
  url: 'https://en.softonic.com/download/gifcam/windows/post-download',
  version: ['[data-auto="app-info"]>dd', 'text', /(.*)/],
  download: (res, $) => res.body.match(/"internalDownloadUrl":"(.*?)"/)[1]
};
module.exports = data;
