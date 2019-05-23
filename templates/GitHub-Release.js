'use strict'

let data = {
  url: 'https://github.com/aria2/aria2/releases/latest',
  version: {
    selector: '.muted-link'
  },
  download: {
    selector: 'a[href*="win-64bit"][href$=".zip"]:has(small.text-gray)',
    attr: 'href'
  },
  install: function (output, iPath, fns) {
    return fns.install(output, iPath, null, '*\\aria2c.exe')
  }
}
module.exports = data
