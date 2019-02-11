'use strict'

let data = {
  url: 'https://softs.loan/?dir=%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91/PC/Brook/Brook%20Tools',
  version: {
    selector: 'a[href*="Brook%20Tools"][href$=".zip"]'
  },
  download: {
    selector: 'a[href*="Brook%20Tools"][href$=".zip"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
