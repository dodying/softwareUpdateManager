'use strict'

let data = {
  commercial: 3,
  url: 'http://scootersoftware.com/download.php?zz=dl4',
  version: {
    selector: '#content a[href*="zh"]',
    attr: 'href'
  },
  download: {
    selector: '#content a[href*="zh"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno_with_type')(output, iPath)
  }
}
module.exports = data
