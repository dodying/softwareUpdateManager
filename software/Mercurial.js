'use strict'

let data = {
  url: 'https://www.mercurial-scm.org/wiki/Download',
  version: {
    selector: 'a[href$="x64.exe"]',
    attr: 'href'
  },
  download: {
    selector: 'a[href$="x64.exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
