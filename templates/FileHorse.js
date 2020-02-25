'use strict'

let data = {
  version: (res, $) => {
    let name = $('[itemprop="name"]').eq(0).text().trim()
    return $('[itemprop="softwareVersion"]').eq(0).text().replace(new RegExp(name, 'gi'), '').replace(/LATEST/i, '').trim()
  },
  changelog: {
    url: '[href$="/change-log/"]',
    selector: '.software_menu+div>p:nth-child(2)'
  },
  download: async (res, $, fns, choice) => fns.walkLink(res, fns, '[itemprop="downloadUrl"]', '#download_url')
}
module.exports = data
