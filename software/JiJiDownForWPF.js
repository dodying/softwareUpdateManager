'use strict'

let data = {
  url: 'http://l.acesheep.com/bili/re.php?callback=?',
  version: {
    func: async (res, $) => require('cheerio').load(JSON.parse(res.body.match(/\?\((.*)\)/)[1]).txt).text().match(/(\d+[\d.]+\d+)/)[1]
  },
  download: {
    func: async (res, $) => require('cheerio').load(JSON.parse(res.body.match(/\?\((.*)\)/)[1]).txt)('a[href$=".zip"]').attr('href')
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
