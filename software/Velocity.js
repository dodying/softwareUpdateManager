'use strict'

let data = {
  commercial: 2,
  url: 'https://velocity.silverlakesoftware.com/',
  preferPath: 'Velocity.exe',
  version: {
    selector: '#downloadbutton',
    attr: 'href',
    match: /VelocitySetup-([\d.]+).msi/
  },
  download: {
    selector: '#downloadbutton'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
