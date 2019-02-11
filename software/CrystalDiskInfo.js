'use strict'

let data = {
  withoutHeader: true,
  url: 'https://crystalmark.info/en/download/',
  version: {
    selector: 'h2:has("#CrystalDiskInfo")',
    match: /CrystalDiskInfo ([\d.]+)/
  },
  download: {
    selector: 'h2:has("#CrystalDiskInfo")+div a.icon-download:contains("zip")',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
