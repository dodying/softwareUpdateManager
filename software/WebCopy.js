'use strict'

let data = {
  url: 'https://www.cyotek.com/cyotek-webcopy/downloads',
  version: {
    selector: '.file-version>a'
  },
  download: {
    func: async (res, $) => $('.file-option>a').eq(0).attr('href').replace('/info/', '/get/')
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
