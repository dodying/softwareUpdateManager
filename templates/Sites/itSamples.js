'use strict';

const data = {
  version: async (res, $, fns, choice) => choice || $('.download').text().match(/version: (\d+[\d.]+\d+)/i) ? $('.download').text().match(/version: (\d+[\d.]+\d+)/i)[1] : $('.download').text().match(/revised (.*?)\)/i)[1],
  download: '.download>a[title="Download"]'
};
module.exports = data;
