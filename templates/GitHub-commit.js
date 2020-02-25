'use strict'

let data = {
  url: 'https://github.com/benbuck/rbtray/releases',
  version: async (res, $, fns, choice) => {
    let text = $('.commit-title>a').eq(0).text().trim()
    if (choice) {
      return text.match(choice)[1]
    } else if (text.match(/^v(.*)$/)) {
      return text.match(/^v(.*)$/)[1]
    } else {
      return text
    }
  },
  download: 'a[href*="/archive/"][href$=".zip"]'
}
module.exports = data
