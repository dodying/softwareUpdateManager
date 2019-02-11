'use strict'

let data = {
  url: 'https://antibody-software.com/web/software/software/wizfile-finds-your-files-fast/',
  version: {
    selector: '.smalldark'
  },
  download: {
    selector: 'a[href*="/files/"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
