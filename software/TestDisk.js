'use strict'

let data = {
  url: 'https://www.cgsecurity.org/wiki/TestDisk_Download',
  version: {
    func: async (res, $) => $('#mw-content-text > div > script:nth-child(9)').eq(0).text().match(/<span class="download-title">TestDisk (.*?)<img /)[1]
  },
  download: {
    func: async (res, $) => $('#mw-content-text > div > script:nth-child(9)').eq(0).text().match(/<a class="download-link" href=".*?">/)[1].replace('/Download_and_donate.php', '')
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
