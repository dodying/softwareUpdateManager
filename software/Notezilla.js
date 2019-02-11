'use strict'

let data = {
  commercial: 3,
  url: 'https://www.conceptworld.com/Notezilla/Portable',
  version: {
    selector: 'body > main > div > div.container > div > div.col-lg-9 > section > div > div:nth-child(1) > div > div'
  },
  download: {
    func: async (res, $) => $('a[onclick^="downloadProduct"]').attr('onclick').match(/downloadProduct\('(.*)'\)/)[1]
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
