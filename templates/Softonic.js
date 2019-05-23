'use strict'

let data = {
  url: 'https://en.softonic.com/download/gifcam/windows/post-download',
  version: {
    selector: '[data-auto="app-info"]>dd',
    match: /(.*)/
  },
  download: {
    func: async (res, $) => res.body.match(/"internalDownloadUrl":"(.*?)"/)[1]
  },
  install: async function (output, iPath, fns) {
    return fns.install(output, iPath)
  }
}
module.exports = data
