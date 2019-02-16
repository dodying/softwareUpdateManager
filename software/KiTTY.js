'use strict'

let data = {
  url: 'https://www.softpedia.com/get/Network-Tools/Telnet-SSH-Clients/9bis-KiTTY.shtml',
  version: {
    selector: '.dllabel+span'
  },
  download: {
    func: async (res, $, req, cheerio) => require('./../js/download_softpedia')(res, $, req, cheerio)
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
