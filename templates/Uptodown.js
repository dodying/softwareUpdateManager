'use strict'

let data = {
  url: 'https://gifcam.cn.uptodown.com/windows/download',
  version: ['.version>span', 'text', /(.*)/],
  download: '.data.download'
}
module.exports = data
