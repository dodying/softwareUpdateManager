'use strict'

let data = {
  url: 'https://gitlab.com/angelkyo/w10-digitallicense/releases',
  version: {
    selector: '.card-body>h2:contains("DigitalLicense")'
  },
  download: {
    selector: '.card-body:has(h2:contains("DigitalLicense")) a[href*="/uploads/"][href$=".zip"]'
  },
  install: function (output, iPath, fns) {
    return fns.install.zipped.single(output, iPath)
  }
}
module.exports = data
