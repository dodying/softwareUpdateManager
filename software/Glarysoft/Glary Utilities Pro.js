'use strict'

let data = {
  commercial: 3,
  url: 'https://www.glarysoft.com/glary-utilities-pro/',
  version: {
    selector: '.index_pro_ver'
  },
  download: {
    selector: '.downloadspeedup'
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
