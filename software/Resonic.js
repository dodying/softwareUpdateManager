'use strict'

let data = {
  url: 'https://resonic.at/download',
  version: {
    selector: 'h2',
    match: /Resonic Player (.*) /
  },
  download: {
    plain: 'https://resonic.at/get/player/portable',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
