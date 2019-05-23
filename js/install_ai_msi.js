'use strict'

/**
 * @description regard the install pack as Advanced Installer With Raw Msi
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | array)} excludes what files you don't want to install
 * @param {(string | RegExp)} installMsi what msi you want to install (with .msi) // String: 完全相等, RegExp: 匹配即可
 * @param {string} preferPath
 * @param {(string | array)} msiParams
 */

let install = async (from, to, excludes = [], installMsi, preferPath, msiParams) => {
  const path = require('path')
  const fse = require('fs-extra')
  const cp = require('child_process')

  let install = () => {
    let { dir: parentPath } = path.parse(to)
    while (parentPath.toLowerCase().split(/[/\\]+/).includes('bin')) {
      parentPath = path.parse(parentPath).dir
    }

    let tmpNumber = Math.random().toString()
    let tmpFolder = path.resolve(__dirname, './../unzip/', tmpNumber)
    fse.mkdirSync(tmpFolder)
    cp.execSync(`"${from}" /extract:"${tmpFolder}"`)

    let fromNew = tmpFolder
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
        return require('./install_msi')(_path, to, excludes, preferPath, msiParams)
      } else {
        continue
      }
    }

    return false
  }

  let killed = require('./kill')(from, to)
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
