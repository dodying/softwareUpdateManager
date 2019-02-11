'use strict'

let data = {
  url: 'https://fastcopy.jp/',
  version: {
    selector: '.table_head>th'
  },
  download: {
    func: async (res, $) => {
      let url = $('.dl_link>a').attr('href')
      let res1 = await require('request-promise').get(url)
      const $1 = require('cheerio').load(res1)
      return $1('.dl a').attr('href')
    }
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')((fromNew, to, excludes) => {
      let parentPath = require('path').parse(to).dir
      require('child_process').execSync(`"${fromNew}" /SILENT /DIR="${parentPath}" /EXTRACT64 /NOSUBDIR`)
    }, output, iPath)
  }
}
module.exports = data
