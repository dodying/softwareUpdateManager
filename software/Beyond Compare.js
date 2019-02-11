'use strict'

let data = {
  commercial: true,
  url: 'http://scootersoftware.com/download.php?zz=dl4',
  version: {
    selector: '#content a[href*="zh"]',
    attr: 'href'
  },
  download: {
    selector: '#content a[href*="zh"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno_with_bit')(output, iPath)
  }
}
module.exports = data
