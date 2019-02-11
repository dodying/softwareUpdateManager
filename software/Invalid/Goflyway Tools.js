'use strict'

let data = {
  useProxy: true,
  url: 'https://doub.io/dbrj-11/',
  version: {
    selector: '.article-content>p>strong:contains("当前版本")'
  },
  download: {
    plain: 'https://i.jpg.dog/doubi/Goflyway%20Tools.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
