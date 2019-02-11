'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/cyfdecyf/cow/releases/latest',
  version: {
    selector: '.release .css-truncate-target'
  },
  download: {
    selector: 'a[href*="win64"][href$=".zip"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
