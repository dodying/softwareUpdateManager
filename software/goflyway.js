'use strict'

let data = {
  commercial: false,
  useProxy: true,
  url: 'https://github.com/coyove/goflyway/releases',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href$="amd64.zip"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
