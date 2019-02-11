'use strict'

let data = {
  url: 'https://www.glarysoft.com/software-update/',
  version: {
    selector: '.index_pro_ver'
  },
  download: {
    plain: 'http://download.glarysoft.com/susetup.exe'
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
