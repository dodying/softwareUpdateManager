'use strict'

let data = {
  url: 'https://biblprog.com/en/dropbox/download/',
  version: {
    selector: '[itemprop="softwareVersion"]'
  },
  download: {
    selector: '.download_prog a',
    attr: 'href'
  },
  install: function (output, iPath, fns) {
    return fns.install.zipped(output, iPath, 'install', null, 'Installer.exe', null, '$0')
  }
}
module.exports = data
