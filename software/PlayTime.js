'use strict'

let data = {
  useProxy: true,
  url: 'http://www.dcmembers.com/skwire/download/playtime/',
  version: {
    selector: 'a.wpdm-download-link'
  },
  download: {
    selector: 'a.wpdm-download-link',
    attr: 'onclick',
    match: /^this.href='(.*)';$/,
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
