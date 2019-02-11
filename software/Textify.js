'use strict'

let data = {
  useProxy: true,
  url: 'https://rammichael.com/downloads/textify_setup.exe?changelog',
  version: {
    selector: 'b'
  },
  download: {
    plain: 'https://rammichael.com/downloads/textify_setup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, ['Textify.ini', 'WebApp.ini'])
  }
}
module.exports = data
