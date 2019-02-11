'use strict'

let data = {
  url: 'https://work.weixin.qq.com/',
  version: {
    selector: '.index_log_section_title'
  },
  download: {
    plain: 'https://work.weixin.qq.com/wework_admin/commdownload?platform=win',
    output: '.exe'
  }
}
module.exports = data
