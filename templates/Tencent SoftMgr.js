'use strict'

let data = {
  url: 'https://pc.qq.com/detail/1/detail_23761.html',
  version: ['.detail-other>li:nth-child(3)', 'text', /版本：(.*)/],
  changelog: '.whatnews',
  download: '.detail-install-normal'
}
module.exports = data
