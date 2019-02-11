'use strict'

let data = {
  url: 'https://fastcopy.jp/',
  version: {
    selector: '.table_head>th'
  },
  download: {
    func: async (res, $, req, cheerio) => {
      let url = $('.dl_link>a').attr('href')
      let res1 = await req(url)
      let $1 = cheerio.load(res1.body)
      return $1('.dl a').attr('href')
    }
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')((fromNew, to) => {
      let parentPath = require('path').parse(to).dir
      require('child_process').execSync(`"${fromNew}" /SILENT /DIR="${parentPath}" /EXTRACT64 /NOSUBDIR`)
    }, output, iPath)
  }
}
module.exports = data
