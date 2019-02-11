'use strict'

let data = {
  useProxy: true,
  url: 'https://picpick.app/zh/download',
  version: {
    selector: 'h3+div'
  },
  download: {
    plain: 'https://www.picpick.org/releases/latest/picpick_portable.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
