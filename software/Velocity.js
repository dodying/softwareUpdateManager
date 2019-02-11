'use strict'

let data = {
  commercial: true,
  url: 'https://velocity.silverlakesoftware.com/',
  version: {
    selector: '#downloadbutton',
    attr: 'href'
  },
  download: {
    selector: '#downloadbutton',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath)
  }
}
module.exports = data
