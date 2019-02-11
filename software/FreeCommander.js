'use strict'

let data = {
  commercial: 2,
  url: 'https://freecommander.com/en/downloads/',
  version: {
    selector: '#post-29 > div > p:nth-child(2) > strong > span',
    match: /Build (\d[\d\w]+)/
  },
  download: {
    plain: 'https://freecommander.com/downloads/FreeCommanderXE-32-public_setup.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_inno')
  }
}
module.exports = data
