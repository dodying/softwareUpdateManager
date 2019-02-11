'use strict'

let data = {
  commercial: 2,
  url: 'https://koofr.eu/desktop-apps/',
  version: {
    func: async (res, $, req, cheerio) => {
      let res1 = await req('https://app.koofr.net/dl/apps/win', {
        method: 'HEAD'
      })
      return res1.headers['content-disposition'].match(/filename="(.*)"/)[1].match(/v(\d+[\d.]+\d+)/)[1]
    }
  },
  download: {
    plain: 'https://app.koofr.net/dl/apps/win',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
