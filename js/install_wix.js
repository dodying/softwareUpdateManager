'use strict'

/**
 * @description regard the install pack as a Windows Installer XML
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {(string | array)} excludes what files you don't want to install
 * @param {(string | RegExp)} installMsi what msi you want to install (with .msi) // String: 完全相等, RegExp: 匹配即可
 * @param {string} preferPath
 * @param {(string | array)} msiParams
 */

let install = async (info, excludes, installMsi, preferPath, msiParams) => {
  excludes = excludes ? [].concat(excludes) : []
  excludes.push('.msi$')

  const path = require('path')
  const fse = require('fs-extra')
  const cp = require('child_process')

  let install = () => {
    cp.execSync(`plugins\\dark.exe "${info.output}" -x ".\\unzip\\${info.name}"`)

    let fromNew = `unzip\\${info.name}\\AttachedContainer`
    let list = fse.readdirSync(fromNew)
    while (list.length === 1) {
      fromNew = path.resolve(fromNew, list[0])
      if (!fse.statSync(fromNew).isDirectory()) {
        fromNew = path.parse(fromNew).dir
        break
      }
      list = fse.readdirSync(fromNew)
    }

    for (let file of list) {
      let _path = path.resolve('./', fromNew, file)
      if ((typeof installMsi === 'string' && file === installMsi) || (installMsi instanceof RegExp && file.match(installMsi))) {
        info.output = _path
        return require('./install_msi')(info, excludes, preferPath, msiParams)
      } else {
        continue
      }
    }

    return false
  }

  let killed = require('./kill')(info.parentPath)
  if (!killed) return false

  try {
    let installed = install()
    return installed
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = install
