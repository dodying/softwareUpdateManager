'use strict';

module.exports = {
  url: 'http://www.softsea.com/review/Dark-Turn-off-Monitor.html',
  version: (res, $) => $('.entry li:contains("Version")').text().split(':')[1].trim() || '1',
  download: async (res, $, fns, choice) => fns.walkLink(res, fns, '.item', '.item')
};
