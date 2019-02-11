'use strict'

let data = {
  commercial: 3,
  url: 'https://www.kcsoftwares.com/?download',
  version: {
    selector: 'h3:contains("PhotoToFilm")+small>code'
  },
  download: {
    plain: 'https://kcsoftwares.com/files/phototofilm_lite.exe'
  },
  install: function (output, iPath) {
    return require('./../../js/install_inno')(output, iPath)
  }
}
module.exports = data
