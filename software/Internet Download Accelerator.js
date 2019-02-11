'use strict'

let data = {
  commercial: 1,
  url: 'https://www.westbyte.com/ida/index.phtml?page=download',
  version: {
    selector: '.mainbig01'
  },
  download: {
    plain: 'https://www.westbyte.com/ida/download/idasetup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
