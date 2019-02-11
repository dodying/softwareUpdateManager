'use strict'

let data = {
  url: 'https://shuax.com/project/mouseinc/',
  version: {
    selector: '.title'
  },
  download: {
    plain: 'https://shuax.com/mi',
    output: '.7z'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
