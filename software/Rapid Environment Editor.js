'use strict'

let data = {
  url: 'https://www.rapidee.com/en/download',
  version: {
    selector: '#winxp'
  },
  download: {
    plain: 'https://www.rapidee.com/download/RapidEEx64.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
