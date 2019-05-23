'use strict'

let data = {
  url: 'https://gifcam.cn.uptodown.com/windows/download',
  version: {
    selector: '.version>span',
    match: /(.*)/
  },
  download: {
    selector: '.data.download'
  },
  install: async function (output, iPath, fns) {
    return fns.install(output, iPath)
  }
}
module.exports = data
