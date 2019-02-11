'use strict'

let data = {
  commercial: 3,
  url: 'https://www.proxifier.com/',
  version: {
    selector: '.changelog-win'
  },
  download: {
    plain: 'https://www.proxifier.com/download/ProxifierSetup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
