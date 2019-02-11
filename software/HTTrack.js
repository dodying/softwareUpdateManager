'use strict'

let data = {
  url: 'http://www.httrack.com/page/2/en/index.html',
  version: {
    selector: 'h2',
    match: /(\d+[\d.-]+\d+)/
  },
  download: {
    selector: 'a[href*="x64"][href$=".zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, null, 'httrack')
  }
}
module.exports = data
