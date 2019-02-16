'use strict'

let getDownloadUrl = async (res, $, req, cheerio) => {
  let id = res.request.uri.href.match(/(\d+)$/)[1]
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

module.exports = getDownloadUrl
