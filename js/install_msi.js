'use strict'

/**
 * @description regard the install pack as Windows Installer Package
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | array)} excludes what files you don't want to install
 */

let install = (from, to, excludes = [], preferPath) => {
  excludes = [].concat(excludes, '.msi$')

  const fse = require('fs-extra')
  const path = require('path')

  let install = () => {
    let { dir: parentPath, name } = path.parse(to)
    require('child_process').execSync(`start /wait msiexec /a "${from}" /quiet /qn TARGETDIR="${path.parse(__dirname).dir}\\unzip\\${name}\\"`)
    let opt = {
      filter: (src, dest) => {
        let arr = require('./../config').excludeGlobal
        if (excludes) arr = arr.concat(excludes)
        let str = path.relative(parentPath, dest)
        for (let i = 0; i < arr.length; i++) {
          if (str.match(arr[i])) return false
        }
        return true
      }
    }
    let list = require('./walk')(`unzip\\${name}`)
    let pathSplit = preferPath.split('/')
    let rootPath = list.filter(i => path.parse(i).base.toLocaleLowerCase() === pathSplit[0].toLocaleLowerCase())[0]

    for (let i = 1; i < pathSplit.length; i++) {
      rootPath = path.parse(rootPath).dir
      parentPath = path.parse(parentPath).dir
    }

    if (fse.statSync(rootPath).isFile()) rootPath = path.parse(rootPath).dir

    fse.copySync(rootPath, parentPath, opt)
    return true
  }

  let killed = require('./kill')(from, to)
  if (!killed) return false

  try {
    let installed = install()
    return installed
  } catch (error) {
    return false
  }
}

module.exports = install
