'use strict'

let data = {
  url: 'https://en.softonic.com/download/gifcam/windows/post-download',
  version: {
    selector: '[data-auto="app-info"]>dd',
    match: /(.*)/
  },
  download: {
    selector: '[name="trackingConfig[download][internalDownloadUrl]"]',
    attr: 'content'
  },
  install: async function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
