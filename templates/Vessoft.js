'use strict';

const data = {
  url: 'https://zh.vessoft.com/software/windows/download/minecraft',
  version: '.di .ds .f',
  download: (res, $) => res.body.match(/window.document.getElementById\("js_download_link"\).setAttribute\("href","(.*?)"/)[1].replace(/@/g, '')
};
module.exports = data;
