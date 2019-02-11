'use strict'

let data = {
  url: 'http://www.foobar2000.org/download',
  version: {
    selector: 'a[href^="/getfile/"]',
    match: /v(\d+[\d.]+\d+)/
  },
  download: {
    func: async (res, $) => $('a[href^="/getfile/"]').attr('href').replace('getfile', 'files')
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
