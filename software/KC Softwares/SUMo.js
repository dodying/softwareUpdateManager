'use strict'

let data = {
  commercial: 2,
  url: 'https://www.kcsoftwares.com/?download',
  version: {
    selector: 'h3:contains("SUMo")+small>code'
  },
  download: {
    plain: 'https://www.kcsoftwares.com/files/sumo.zip'
  },
  install: function (output, iPath) {
    return require('./../../js/install')(output, iPath)
  }
}
module.exports = data
