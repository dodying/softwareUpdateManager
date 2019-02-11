'use strict'

let data = {
  url: 'https://launchpad.net/acbf/+download',
  version: {
    selector: '.listing td a[href$="exe"]'
  },
  download: {
    selector: '.listing td a[href$="exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
