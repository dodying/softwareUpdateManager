'use strict'

let data = {
  commercial: 2,
  url: 'http://www.sublimetext.com/3',
  version: {
    selector: '.current>h3'
  },
  download: {
    selector: 'a[href$="x64.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
