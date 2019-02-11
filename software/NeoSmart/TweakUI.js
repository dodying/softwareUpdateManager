'use strict'

let id = 6

let data = {
  url: 'https://neosmart.net/Software/Changelog/' + id,
  preferPath: 'TweakUI64.exe',
  version: {
    selector: 'a[name]'
  },
  download: {
    func: async (res, $, req, cheerio) => {
      let res1 = await req('https://neosmart.net/Download/Register', {
        method: 'POST',
        form: {
          id: id
        }
      })
      let $1 = cheerio.load(res1.body)
      let res2 = await req('https://neosmart.net/Download/ThankYou', {
        method: 'POST',
        form: {
          name: 'admin',
          email: 'admin',
          __RequestVerificationToken: $1('[name="__RequestVerificationToken"]').val(),
          productId: id
        }
      })
      let $2 = cheerio.load(res2.body)
      return $2('a[href*="software"]').eq(0).attr('href')
    }
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
