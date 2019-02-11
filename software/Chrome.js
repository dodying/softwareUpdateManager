'use strict'

let data = {
  useProxy: true,
  url: 'https://api.shuax.com/tools/getchrome',
  version: {
    selector: 'a[name="Stablex64"]+div code'
  },
  download: {
    selector: 'a[name="Stablex64"]+div a[href^="https"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')('install', output, iPath)
  }
}
module.exports = data
