'use strict'

let data = {
  url: 'https://pc.qq.com/detail/1/detail_23761.html',
  version: {
    selector: '.detail-other>li:nth-child(3)',
    match: /版本：(.*)/
  },
  download: {
    selector: '.detail-install-normal'
  },
  install: function (output, iPath, fns) {
    return fns.install(output, iPath)
  }
}
module.exports = data
