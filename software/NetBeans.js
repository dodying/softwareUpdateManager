'use strict'

let data = {
  url: 'https://netbeans.apache.org/download/index.html',
  version: {
    selector: 'h1'
  },
  download: {
    func: async (res, $, req, cheerio) => {
      let res1 = await req('https://netbeans.apache.org/download/nb100/nb100.html')
      let $1 = cheerio.load(res1.body)
      return $1('a[href$="bin.zip"]').eq(0).attr('href').replace('https://www.apache.org/dyn/closer.cgi/', 'https://mirrors.shu.edu.cn/apache/')
    }
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
