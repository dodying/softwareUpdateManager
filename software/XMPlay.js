'use strict'

let data = {
  url: 'http://www.un4seen.com/xmplay.html',
  version: {
    selector: '#phead > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2)'
  },
  download: {
    selector: 'a[href^="download.php"]',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
