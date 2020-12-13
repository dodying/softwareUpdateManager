'use strict';

const data = {
  version: (res, $) => $('.entry-title').text().match(/v([\d.]+)/) ? $('.entry-title').text().match(/v([\d.]+)/)[1] : '1',
  changelog: '.entry-content>p:has([style="color: #008000;"]):not(:has(a[href*="virustotal.com"]))',
  download: async (res, $, fns, choice) => 'https://www.sordum.org/files/downloads.php' + $('[href*="/downloads/?"]').eq(0).attr('href').match(/\?.*$/)[0]
};
module.exports = data;
