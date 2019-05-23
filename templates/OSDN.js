'use strict'

let data = {
  url: 'https://osdn.net/pkg/crystaldiskinfo/CrystalDiskInfo',
  version: {
    selector: '[id^="release-for-"]>div'
  },
  download: {
    func: async (res, $, fns, choice) => {
      let elem = $('h4+[id^="release-file-collapse"]')
      let res1 = await fns.req(`https://osdn.net/ajax/downloads/show_release_item_in.php?release_id=${$(elem).attr('data-release_id')}&group_id=${$(elem).attr('data-group_id')}`)
      let $1 = fns.cheerio.load(res1.body)
      return $1('.name>a[href$=".zip/"]').attr('href')
    }
  },
  install: function (output, iPath, fns) {
    return fns.install(output, iPath)
  }
}
module.exports = data
