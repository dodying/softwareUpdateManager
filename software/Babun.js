'use strict'

let data = {
  url: 'https://github.com/babun/babun/releases',
  version: {
    selector: '.commit-title'
  },
  download: {
    plain: 'http://projects.reficio.org/babun/download',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
