'use strict'

let data = {
  url: 'https://www.softpedia.com/get/Internet/Download-Managers/MegaDownloader.shtml',
  version: {
    selector: '.dllabel+span'
  },
  download: {
    func: async (res, $, req, cheerio) => require('./../js/download_softpedia')(res, $, req, cheerio)
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
