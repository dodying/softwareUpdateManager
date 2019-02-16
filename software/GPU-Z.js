'use strict'

let data = {
  url: 'https://www.techpowerup.com/download/techpowerup-gpu-z/',
  version: {
    selector: '.title'
  },
  download: {
    func: async (res, $, req, cheerio) => require('./../js/download_techpowerup')(res, $, req, cheerio)
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
