'use strict'

let data = {
  url: 'http://www.aimp.ru/?do=download&os=windows',
  version: {
    selector: 'h1'
  },
  download: {
    selector: 'a:contains("Programki.net")'
  },
  install: function (output, iPath, choice) {
    let killed = require('./../js/kill')(output, iPath)
    if (!killed) return false
    const path = require('path')
    let parentPath = path.parse(iPath).dir
    require('child_process').execSync(`"${output}" /AUTO="${parentPath}" /PORTABLE /SILENT`)
    if (typeof choice === 'undefined' && require('readline-sync').keyInYNStrict('Continue to delete backup?')) {
      require('fs-extra').removeSync(path.resolve(parentPath, '!Backup'))
    } else if (typeof choice === 'boolean' && choice) {
      require('fs-extra').removeSync(path.resolve(parentPath, '!Backup'))
    }
    return true
  },
  other: {
    backup: { installChoice: false },
    nobackup: { installChoice: true }
  }
}
module.exports = data
