'use strict'

let data = {
  commercial: 2,
  url: 'https://www.duplicatecleaner.com/index.html',
  version: {
    selector: '#feature-list h1'
  },
  download: {
    plain: 'https://www.duplicatecleaner.com/download/DuplicateCleanerPro4_setup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
