'use strict'

let data = {
  url: 'https://handbrake.fr/downloads.php',
  version: {
    selector: 'h2'
  },
  download: {
    func: async (res, $, req, cheerio) => {
      let res1 = await req('https://handbrake.fr/' + $('a[href$="64-Win_GUI.zip"]').attr('href'))
      let $1 = cheerio.load(res1.body)
      return $1('a[href$="64-Win_GUI.zip"]').attr('href')
    }
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
