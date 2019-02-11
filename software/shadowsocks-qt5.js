'use strict'

let data = {
  useProxy: true,
  url: 'https://github.com/shadowsocks/shadowsocks-qt5/releases/latest',
  version: {
    selector: '.release-header a'
  }
}
module.exports = data
