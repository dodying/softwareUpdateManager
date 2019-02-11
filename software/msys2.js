'use strict'

let data = {
  url: 'https://www.msys2.org/',
  version: {
    selector: '.button[href*="x86_64"]',
    match: /-(\d+)/
  },
  download: {
    selector: '.button[href*="x86_64"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
