'use strict'

let data = {
  url: 'https://www.bandisoft.com/bandizip/',
  version: {
    selector: '.content li a'
  },
  download: {
    plain: 'https://www.bandisoft.com/bandizip/dl.php?web',
    output: '.exe'
  },
  install: function (output, iPath) {
    const readlineSync = require('readline-sync')
    const fs = require('fs')
    const path = require('path')
    const cp = require('child_process')

    let parentPath = path.parse(iPath).dir
    let shell = readlineSync.keyInYNStrict('Do you use context menu in Windows Explorer?')
    if (shell) cp.execSync(`plugins\\RegDll64.exe /calldll "${parentPath}\\bdzshl64.dll" unregSvr`)
    let portable = shell ? false : readlineSync.keyInYNStrict('Make it portable?')
    let installed = require('./../js/install')(output, iPath)
    if (installed) {
      if (shell) cp.execSync(`plugins\\RegDll64.exe /calldll "${parentPath}\\bdzshl64.dll" RegSvr`)
      if (portable) {
        let configFile = path.resolve(parentPath, 'config.ini')
        let config = fs.readFileSync(configFile, 'utf-8')
        config = config.replace(/(is_portable\s+=\s+)0/, '$11')
        fs.writeFileSync(configFile, config)
      }
    }
    return installed
  }
}
module.exports = data
