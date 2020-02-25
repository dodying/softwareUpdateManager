'use strict'

let data = {
  url: 'https://www.softpedia.com/get/Internet/Chat/Other-Chat-Tools/Discord.shtml',
  version: async (res, $, fns, choice) => {
    let version
    let versionAll = res.body.match(/spjs_prog_version="(.*?)";/)[1]
    if (versionAll) {
      let versionArr = versionAll.split(' / ')

      if (choice) {
        versionArr = versionArr.filter(i => i.match(choice))
        if (versionArr.length) {
          let matched = versionArr[0].match(choice)
          if (matched[1]) versionArr[0] = matched[1]
        }
      }
      version = versionArr[0]
    } else {
      version = '1.0.0'
    }
    return version
  },
  changelog: async (res, $) => [$('#changelog>ul').eq(0).text() || $('.changelog>ul').eq(0).text(), true],
  download: async (res, $, fns, choice) => {
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

    let links = $1('[href^="https://www.softpedia.com/dyn-postdownload.php/"]').toArray().map(i => {
      return {
        text: $1(i).attr('title'),
        ext: $1(i).find('span').text(),
        link: $1(i).attr('href')
      }
    })

    if (choice) links = links.filter(i => i.text.match(choice))
    let link = links[0].link

    let res2 = await fns.req(link)
    let $2 = fns.cheerio.load(res2.body)
    return $2('[http-equiv="refresh"]').eq(0).attr('content').match(/url=(.*)/)[1]
  }
}
module.exports = data
