'use strict';

const data = {
  version: ['.\\[hide_empty\\:version\\]>.badge', 'text', /(.*)/],
  download: ['a.wpdm-download-link', 'onclick', /href='(.*?)';/]
};
module.exports = data;
