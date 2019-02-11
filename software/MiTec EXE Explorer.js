'use strict'

let data = {
  url: 'http://www.mitec.cz/index.html',
  version: {
    selector: '.apps[href="exe.html"]'
  },
  download: {
    plain: 'http://www.mitec.cz/Downloads/EXE.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
