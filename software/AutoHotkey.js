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
    let installed = require('./../js/install')(output, iPath)
    if (installed) {
      const path = require('path')
      let parentPath = path.parse(iPath).dir
      require('fs-extra').copySync(path.resolve(parentPath, 'AutoHotkeyU64.exe'), path.resolve(parentPath, 'AutoHotkey.exe'))
    }
    return installed
  }
}
module.exports = data
