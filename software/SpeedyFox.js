'use strict'

let data = {
  url: 'https://www.crystalidea.com/speedyfox',
  version: {
    selector: '.font-xs'
  },
  download: {
    plain: 'https://www.crystalidea.com/downloads/speedyfox.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
