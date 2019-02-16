'use strict'

let data = {
  url: 'https://github.com/wixtoolset/wix3/releases/latest',
  version: {
    selector: '.release-header a',
    match: /v(.*)/
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$="binaries.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
