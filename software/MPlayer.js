'use strict'

let data = {
  url: 'http://oss.netfarm.it/mplayer/',
  version: {
    selector: '#content>ul>li',
    match: /MPlayer (r\d+)/
  },
  download: {
    selector: 'a[rel="external"][href*="x86_64"]',
    output: '.7z'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
