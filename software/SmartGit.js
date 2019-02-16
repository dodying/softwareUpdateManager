'use strict'

let data = {
  commercial: 1,
  url: 'https://www.syntevo.com/smartgit/download/',
  version: {
    selector: '.formatted-content'
  },
  download: {
    selector: 'a[href*="portable"][href$=".7z"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  },
  afterInstall: function (output, iPath) {
    let path = require('path')
    let fs = require('fs')
    let parentPath = path.parse(iPath).dir

    while (parentPath.toLowerCase().split(/[/\\]+/).includes('bin')) {
      parentPath = path.parse(parentPath).dir
    }

    let setting = path.resolve(parentPath, '.settings', 'settings.xml')
    if (fs.existsSync(setting)) fs.unlinkSync(setting)
  }
}
module.exports = data
