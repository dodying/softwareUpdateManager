'use strict'

let data = {
  url: 'http://www.mitec.cz/Data/XML/data_tmxvh.xml',
  version: {
    selector: 'VERSION'
  },
  download: {
    plain: 'http://www.mitec.cz/Downloads/TMX64.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
