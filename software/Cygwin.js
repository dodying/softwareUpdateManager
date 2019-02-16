'use strict'

let data = {
  url: 'http://mirrors.kernel.org/sourceware/cygwin/x86_64/',
  version: {
    func: async (res, $) => res.body.match(/<a href="release\/">release\/<\/a>\s+(\d+[\da-zA-Z\s:-]+\d+)\s/)[1].replace(/:|\s+/g, '-')
  },
  download: {
    plain: 'https://www.cygwin.com/setup-x86_64.exe'
  },
  install: function (output, iPath) {
    let path = require('path')
    let { dir: parentPath } = path.parse(iPath)

    while (parentPath.toLowerCase().split(/[/\\]+/).includes('bin')) {
      parentPath = path.parse(parentPath).dir
    }
    return require('child_process').execSync(`start /wait ${output} --root ${parentPath} --no-admin --no-shortcuts --local-package-dir ${parentPath}\\packages --wait --only-site --site http://mirrors.163.com/cygwin/ --upgrade-also --quiet-mode --verbose --wait`)
  }
}
module.exports = data
