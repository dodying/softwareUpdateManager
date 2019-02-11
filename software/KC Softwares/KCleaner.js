'use strict'

let data = {
  commercial: 2,
  url: 'https://www.kcsoftwares.com/?download',
  version: {
    selector: 'h3:contains("KCleaner")+small>code'
  },
  download: {
    plain: 'https://www.kcsoftwares.com/files/kcleaner.zip'
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
