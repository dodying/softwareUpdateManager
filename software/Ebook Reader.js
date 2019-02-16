'use strict'

let data = {
  commercial: 2,
  url: 'https://icecreamapps.com/Ebook-Reader/',
  version: {
    selector: '.fab-minspecs'
  },
  download: {
    selector: 'https://icecreamapps.com/download/ebook_reader_setup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
