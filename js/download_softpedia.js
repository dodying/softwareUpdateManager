'use strict'

let getDownloadUrl = async (res, $, req, cheerio) => {
  let tsf = res.body.match(/var spjs_prog_tsf=(.*);/)[1] * 1
  let form = $('[itemprop="downloadUrl"]').eq(0).attr('onclick').match(/popup6_open\({(.*),tsf/)[1]
  form = JSON.parse('{' + form.replace(/'/g, '"').replace(',tk:', ',"tk":') + '}')
  form.tsf = tsf
  let res1 = await req('https://www.softpedia.com/_xaja/dlinfo.php', {
    method: 'POST',
    form: form
  })
  let $1 = cheerio.load(res1.body)
  let url = $1('[href^="https://www.softpedia.com/dyn-postdownload.php/"]').eq(0).attr('href')
  let res2 = await req(url)
  let $2 = cheerio.load(res2.body)
  return $2('[http-equiv="refresh"]').eq(0).attr('content').match(/url=(.*)/)[1]
}

module.exports = getDownloadUrl
