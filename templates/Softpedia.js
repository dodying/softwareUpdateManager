'use strict'

let data = {
  url: 'https://www.softpedia.com/get/Internet/Chat/Other-Chat-Tools/Discord.shtml',
  version: {
    func: async (res, $) => res.body.match(/spjs_prog_version="(.*?)";/)[1]
  },
  download: {
    func: async (res, $, fns) => {
      let tsf = res.body.match(/var spjs_prog_tsf=(.*);/)[1] * 1
      let form = $('[itemprop="downloadUrl"]').eq(0).attr('onclick').match(/popup6_open\({(.*),tsf/)[1]
      form = JSON.parse('{' + form.replace(/'/g, '"').replace(',tk:', ',"tk":') + '}')
      form.tsf = tsf
      let res1 = await fns.req({
        method: 'POST',
        uri: 'https://www.softpedia.com/_xaja/dlinfo.php',
        form: form
      })
      let $1 = fns.cheerio.load(res1.body)

      // let links = $1('[href^="https://www.softpedia.com/dyn-postdownload.php/"]').toArray().map(i => {
      //   return {
      //     text: $1(i).find('span').text(),
      //     link: $1(i).attr('href')
      //   }
      // })
      // let link = links[0].link

      let link = $1('[href^="https://www.softpedia.com/dyn-postdownload.php/"]').eq(0).attr('href')
      let res2 = await fns.req(link)
      let $2 = fns.cheerio.load(res2.body)
      return $2('[http-equiv="refresh"]').eq(0).attr('content').match(/url=(.*)/)[1]
    }
  },
  install: function (output, iPath, fns) {
    return fns.install(output, iPath)
  }
}
module.exports = data
