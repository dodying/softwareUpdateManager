'use strict'

let data = {
  url: 'https://github.com/shadowsocksrr/shadowsocksr-csharp/releases',
  version: {
    selector: '.muted-link.css-truncate'
  },
  download: {
    selector: 'a[href*="/releases/download/"][href$=".zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, 'templates')
  }
}
module.exports = data
