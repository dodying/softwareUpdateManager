'use strict'

let data = {
  url: 'https://www.kcsoftwares.com/?download',
  version: {
    selector: 'h3:contains("HDDExpert")+small>code'
  },
  download: {
    plain: 'https://www.kcsoftwares.com/files/hdde.zip'
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
