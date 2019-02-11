'use strict'

let data = {
  url: 'https://www.python.org/downloads/windows/',
  preferPath: 'python.exe',
  version: {
    selector: 'a[href^="/downloads/release/python-2"]'
  },
  download: {
    plain: 'https://www.python.org/ftp/python/{version}/python-{version}.amd64.msi'
  },
  install: function (output, iPath) {
    let installed = require('./../js/install_msi')(output, iPath, null, data.preferPath)
    if (installed) {
      const path = require('path')
      const fse = require('fs-extra')
      const cp = require('child_process')

      let { dir: parentPath } = path.parse(iPath)

      let bundledPath = path.resolve(parentPath, 'Lib\\ensurepip\\_bundled')
      let whls = fse.readdirSync(bundledPath)
      let pip = whls.filter(i => i.match(/^pip-/))[0]
      pip = path.resolve(bundledPath, pip)
      let pipNew = path.resolve(parentPath, 'pip.whl')
      fse.copySync(pip, pipNew)
      whls.forEach(whl => {
        cp.execSync(`cd /d ${parentPath} & ${path.resolve(parentPath, 'python.exe')} pip.whl/pip install --no-index ${path.resolve(bundledPath, whl)}`)
      })
      fse.unlinkSync(pipNew)
    } else {
      return false
    }
  }
}
module.exports = data
