'use strict'

let data = {
  url: 'https://launchpad.net/acbf/+download',
  version: '.listing td a[href$="exe"]',
  changelog: '[id^="release-information"]',
  download: '.listing td a[href$="exe"]',
  install: 'install_nsis'
}
module.exports = data
