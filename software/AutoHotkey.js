'use strict'

let data = {
  url: 'https://www.autohotkey.com/download/',
  version: {
    selector: 'a[href="../docs/AHKL_ChangeLog.htm"]'
  },
  download: {
    plain: 'https://www.autohotkey.com/download/ahk.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  },
  afterInstall: function (output, iPath) {
    let path = require('path')
    let parentPath = path.parse(iPath).dir
    require('fs').copyFileSync(path.resolve(parentPath, 'AutoHotkeyU64.exe'), path.resolve(parentPath, 'AutoHotkey.exe'))
  }
}
module.exports = data
