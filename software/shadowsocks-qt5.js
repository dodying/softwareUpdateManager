'use strict'

let data = {
  url: 'https://github.com/shadowsocks/shadowsocks-qt5/releases/latest',
  version: {
    selector: '.muted-link.css-truncate',
    match: /v(.*)/
  }
}
module.exports = data
