'use strict'

let data = {
  url: 'https://www.thunderbird.net/notes/',
  version: {
    selector: '.notes-head>h2'
  },
  download: {
    plain: 'https://download-installer.cdn.mozilla.net/pub/thunderbird/releases/{version}/win64/zh-CN/Thunderbird%20Setup%20{version}.exe'
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath, null, 'core')
  }
}
module.exports = data
