'use strict'

let data = {
  url: 'https://www.seamonkey-project.org/releases/',
  version: {
    selector: 'h2>a'
  },
  download: {
    plain: 'https://download-installer.cdn.mozilla.net/pub/seamonkey/releases/{version}/win32/zh-CN/SeaMonkey%20Setup%20{version}.exe'
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath, null, 'core')
  }
}
module.exports = data
