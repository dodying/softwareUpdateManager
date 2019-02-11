'use strict'

let data = {
  useProxy: true,
  url: 'https://www.vpngate.net/cn/download.aspx',
  version: {
    selector: '#vpngate_inner_contents_td > ul:nth-child(6) > li > a > span:nth-child(3) > em',
    match: /vpngate-client-(.*).zip/
  },
  download: {
    selector: '#vpngate_inner_contents_td > ul:nth-child(6) > li > a'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
