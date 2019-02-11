'use strict'

let data = {
  url: 'https://mediaarea.net/en/MediaInfo/Download/Windows',
  version: {
    selector: 'a[href$="Windows_x64_WithoutInstaller.7z"]',
    attr: 'href'
  },
  download: {
    selector: 'a[href$="Windows_x64_WithoutInstaller.7z"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
