'use strict'

let data = {
  url: 'https://github.com/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest',
  version: {
    selector: '.muted-link.css-truncate',
    match: /v(.*)/
  },
  download: {
    selector: 'a[href*="/releases/download/"][href*="softether-vpnclient"][href$=".exe"]'
  }
}
module.exports = data
