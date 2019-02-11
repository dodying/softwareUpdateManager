'use strict'

let data = {
  url: 'https://git-fork.com/releasenoteswin',
  version: {
    selector: '.header4'
  },
  download: {
    plain: 'https://git-fork.com/update/win/ForkInstaller.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install', 'full.nupkg', null, 'lib\\net45')
  },
  afterInstall: async function (output, iPath) {
    const path = require('path')
    const fs = require('fs')
    const cp = require('child_process')
    let parentPath = path.parse(iPath).dir

    let git = fs.readdirSync(parentPath).filter(i => i.match(/^PortableGit.*\.7z/))
    if (git.length) {
      let version = git[0].split('-')[1]
      let src = path.join(parentPath, git[0])
      let dist = path.join(process.env.LOCALAPPDATA, 'Fork\\gitInstance', version)
      cp.execSync(`plugins\\7z.exe x -y -o"${dist}" "${src}"`)
      fs.unlinkSync(src)
    }
  }
}
module.exports = data
