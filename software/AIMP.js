'use strict'

let data = {
  url: 'http://www.aimp.ru/?do=download&os=windows',
  version: {
    selector: 'h1'
  },
  download: {
    selector: 'a:contains("Programki.net")'
  },
  install: function (output, iPath) {
    let killed = require('./../js/kill')(output, iPath)
    if (!killed) return false
    const path = require('path')
    let parentPath = path.parse(iPath).dir
    require('child_process').execSync(`"${output}" /AUTO="${parentPath}" /PORTABLE /SILENT`)
    if (require('readline-sync').keyInYNStrict('Continue to delete backup?')) {
      require('fs-extra').removeSync(path.resolve(parentPath, '!Backup'))
    }
    return true
  }
}
module.exports = data
