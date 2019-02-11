'use strict'

let data = {
  url: 'https://gifcam.cn.uptodown.com/windows/download',
  version: {
    selector: '.version>span',
    match: /(.*)/
  },
  download: {
    selector: '.data.download',
    output: '.zip'
  },
  install: async function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
