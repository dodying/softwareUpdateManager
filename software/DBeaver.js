'use strict'

let data = {
  commercial: 2,
  url: 'https://dbeaver.io/download/',
  version: {
    selector: '#post-6 > div.post-entry > table > tbody > tr:nth-child(1) > td:nth-child(1) > h2'
  },
  download: {
    plain: 'https://dbeaver.io/files/dbeaver-ce-latest-win32.win32.x86_64.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
