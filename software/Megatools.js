'use strict'

let data = {
  url: 'https://megatools.megous.com/',
  version: {
    selector: 'a[href$="-win64.zip"]'
  },
  download: {
    selector: 'a[href$="-win64.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath, 'mega.ini')
  }
}
module.exports = data
