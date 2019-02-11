'use strict'

let data = {
  url: 'https://www.fosshub.com/Calibre.html',
  version: {
    selector: '.dwl-link[file*="portable"]',
    match: /version: (\d+[\d.]+\d+)/
  },
  download: {
    selector: '.dwl-link[file*="portable"]',
    attr: 'fdslwdx'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
