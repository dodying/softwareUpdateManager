'use strict'

let data = {
  url: 'http://www.emdb.eu/',
  version: {
    selector: '.article-header',
    match: /V(\d+[\d.]+\d+)/
  },
  download: {
    plain: 'http://www.emdb.eu/bin/emdb.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
