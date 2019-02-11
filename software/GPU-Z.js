'use strict'

let data = {
  url: 'https://www.techpowerup.com/download/techpowerup-gpu-z/',
  version: {
    selector: '.title'
  },
  download: {
    func: async (res, $, req, cheerio) => {
      let url = 'https://www.techpowerup.com/download/techpowerup-gpu-z/'
      let res1 = await req(url, {
        method: 'POST',
        form: {
          id: $('.version:not(.hidden) form>input[name="id"]').val()
        }
      })

      let $1 = cheerio.load(res1.body)
      let res2 = await req(url, {
        method: 'POST',
        form: {
          id: $('.version:not(.hidden) form>input[name="id"]').val(),
          server_id: $1('[name="server_id"]').attr('value')
        }
      })
      return res2.headers.location
    }
  },
  install: function (output, iPath) {
    return require('./../js/install_single')(output, iPath)
  }
}
module.exports = data
