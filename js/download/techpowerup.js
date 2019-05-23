'use strict'

let getDownloadUrl = async (res, $, fns) => {
  let url = res.request.uri.href
  let res1 = await fns.req({
    uri: url,
    method: 'POST',
    form: {
      id: $('.version:not(.hidden) form>input[name="id"]').val()
    }
  })

  let $1 = fns.cheerio.load(res1.body)
  let res2 = await fns.req({
    uri: url,
    method: 'POST',
    form: {
      id: $('.version:not(.hidden) form>input[name="id"]').val(),
      server_id: $1('[name="server_id"]').attr('value')
    }
  }, {
    check: res => [200, 302].includes(res.statusCode)
  })
  return res2.headers.location
}

module.exports = getDownloadUrl
