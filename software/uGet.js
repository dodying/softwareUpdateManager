'use strict'

let data = {
  withoutHeader: true,
  url: 'https://ugetdm.com/downloads/windows/',
  version: {
    selector: '[data-content-shortcode="vcache type=\\"uget\\" mode=\\"versions\\" key=\\"stable\\" label=\\"uGet: \\""]'
  },
  download: {
    plain: 'https://ugetdm.com/go/windows-download',
    output: '.7z'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
