'use strict'

let getDownloadUrl = async (res, $, fns) => {
  let id = res.request.uri.href.match(/(\d+)$/)[1]
  let res1 = await fns.req({
    uri: 'https://neosmart.net/Download/Register',
    method: 'POST',
    form: {
      id: id
    }
  })
  let $1 = fns.cheerio.load(res1.body)
  let res2 = await fns.req({
    uri: 'https://neosmart.net/Download/ThankYou',
    method: 'POST',
    form: {
      name: 'admin',
      email: 'admin',
      __RequestVerificationToken: $1('[name="__RequestVerificationToken"]').val(),
      productId: id
    }
  })
  let $2 = fns.cheerio.load(res2.body)
  return $2('a[href*="software"]').eq(0).attr('href')
}

module.exports = getDownloadUrl
