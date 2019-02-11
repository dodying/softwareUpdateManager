'use strict'

let data = {
  url: 'https://csharp.love/chrome-update-tool.html',
  version: {
    selector: 'li:contains("当前版本")'
  },
  download: {
    plain: 'https://static.pzhacm.org/software/ChromeUpdateSharp_v{version}.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
