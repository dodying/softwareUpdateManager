'use strict'

let data = {
  url: 'http://www.bandisoft.com/honeyview/',
  version: {
    selector: '.content li a'
  },
  download: {
    plain: 'http://www.bandisoft.com/honeyview/dl.php?web',
    output: '.exe'
  },
  install: function (output, iPath, choice) {
    const readlineSync = require('readline-sync')
    const fs = require('fs')
    const path = require('path')
    const cp = require('child_process')

    let shell, portable
    if (choice) {
      [shell, portable] = choice
    } else {
      shell = readlineSync.keyInYNStrict('Do you use context menu in Windows Explorer?')
      portable = shell ? false : readlineSync.keyInYNStrict('Make it portable?')
    }

    let parentPath = path.parse(iPath).dir
    if (shell) cp.execSync(`regsvr32 /u /s "${parentPath}\\HVShell64.dll"`)
    let installed = require('./../js/install')(output, iPath)
    if (installed) {
      if (shell) cp.execSync(`regsvr32 /s "${parentPath}\\HVShell64.dll"`)
      if (portable) {
        let configFile = path.resolve(parentPath, 'config.ini')
        let config = fs.readFileSync(configFile, 'utf-8')
        config = config.replace(/(is_portable\s+=\s+)0/, '$11')
        fs.writeFileSync(configFile, config)
      }
    }
    return installed
  },
  other: {
    shell: { installChoice: [true, false] },
    portable: { installChoice: [false, true] },
    noshell: { installChoice: [false, false] }
  }
}
module.exports = data
