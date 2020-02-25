'use strict'

let info

let data = {
  url: 'https://baoku.360.cn/soft/show/appid/100101123',
  version: async (res, $, fns, choice) => {
    let id = $('[data-softid]').eq(0).attr('data-softid')
    let uri1 = `https://cx.soft.360.cn/soft/getinfo?info=%5B%5B${id}%2C%22%22%2C1%5D%5D`
    let res1 = await fns.req(uri1)
    info = Object.values(res1.json.data)[0]
    return info.edition_info.default_edition.version
  },
  changelog: () => info.edition_info.default_edition.brief,
  download: () => info.edition_info.default_edition.down.default.p2p.split('|').slice(-1)[0],
  install: 'install'
}
module.exports = data
