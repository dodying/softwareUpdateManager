'use strict'

let data = {
  url: 'https://www.xnview.com/en/xnsketch/',
  version: {
    selector: '.muted'
  },
  download: {
    plain: 'http://download.xnview.com/XnSketch-win-x64.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
