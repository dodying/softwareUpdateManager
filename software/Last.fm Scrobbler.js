'use strict'

let data = {
  url: 'https://www.last.fm/about/trackmymusic',
  preferPath: 'Last.fm Desktop Scrobbler.exe',
  version: {
    func: async (res, $, req, cheerio) => {
      let res1 = await req('https://www.last.fm/download/windows-scrobbler', {
        method: 'HEAD'
      })
      return res1.request.uri.href.match(/(\d+[\d.]+\d+)/)[1]
    }
  },
  download: {
    plain: 'https://www.last.fm/download/windows-scrobbler',
    output: '.msi'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
