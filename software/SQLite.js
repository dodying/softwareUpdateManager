'use strict'

let data = {
  url: 'https://sqlite.org/download.html',
  version: {
    func: async (res, $) => res.body.match(/d391\('a9','(.*)'\);/)[1].match(/x86-(\d+).zip/)[1]
  },
  download: {
    func: async (res, $, req, cheerio) => res.body.match(/'a10','(.*?)'/)[1]
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single', 'sqlite3.exe')
  }
}
module.exports = data
