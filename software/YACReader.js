'use strict'

let data = {
  url: 'http://www.yacreader.com/downloads',
  version: {
    selector: '.latestversion'
  },
  download: {
    selector: '.dwnld.windows>a'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
