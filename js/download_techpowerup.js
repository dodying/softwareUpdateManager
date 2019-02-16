'use strict'

let getDownloadUrl = async (res, $, req, cheerio) => {
  let url = res.request.uri.href
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

module.exports = getDownloadUrl
