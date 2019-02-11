'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/kovidgoyal/calibre/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href*="portable"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath) {
    let killed = require('./../js/kill')(output, iPath)
    if (!killed) return false
    let parentPath = require('path').parse(iPath).dir
    require('child_process').execSync(`"${output}" "${parentPath}"`)
    return true
  }
}
module.exports = data
