'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/BiglySoftware/BiglyBT/releases/latest',
  version: {
    selector: '.release-header a'
  },
  download: {
    selector: 'a[href$="Installer64.exe"]:has(small.text-gray)',
    attr: 'href'
  }
}
module.exports = data
