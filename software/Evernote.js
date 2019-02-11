'use strict'

let data = {
  url: 'https://evernote.com/intl/zh-cn/download',
  version: {
    selector: 'h1+p>a',
    attr: 'href'
  },
  download: {
    selector: 'h1+p>a',
    attr: 'href'
  }
}
module.exports = data
