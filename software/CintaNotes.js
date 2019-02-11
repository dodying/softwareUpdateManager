'use strict'

let data = {
  commercial: 2,
  url: 'http://cintanotes.com/download/',
  version: {
    selector: '.download-button>a'
  },
  download: {
    func: async (res, $) => $('a[href$=".zip"]').attr('href').replace('/download-start?file=', '')
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
