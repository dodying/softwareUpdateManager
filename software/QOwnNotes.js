'use strict'

let data = {
  url: 'https://www.qownnotes.org/installation',
  version: {
    selector: '#accordion-Windows+div .build-number'
  },
  download: {
    selector: '#accordion-Windows+div .ezbinaryfile-field'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
