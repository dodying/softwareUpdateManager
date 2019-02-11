'use strict'

let data = {
  useProxy: true,
  url: 'http://www.aimp.ru/?do=download',
  version: {
    selector: 'a:contains("AIMP.RU")',
    attr: 'href',
    match: /(\d+[\d.]+).exe/
  },
  download: {
    selector: 'a:contains("AIMP.RU")',
    attr: 'href'
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
