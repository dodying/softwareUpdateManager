'use strict'

let data = {
  url: 'https://github.com/OneQuick/OneQuick.github.io/tree/master/bin',
  version: async (res, $, fns, choice) => fns.walkLink(res, fns, {
    selector: '.content .js-navigation-open',
    sort: true,
    match: /OneQuick.([\d.]+).x64.zip/
  }),
  download: async (res, $, fns, choice) => fns.walkLink(res, fns, {
    selector: '.content .js-navigation-open',
    sort: true,
    matchCheck: /OneQuick.([\d.]+).x64.zip/
  }, {
    selector: '#raw-url'
  })
}
module.exports = data
