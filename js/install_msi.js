'use strict'

/**
 * @description regard the install pack as Windows Installer Package
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | array)} excludes what files you don't want to install
 */

let install = (from, to, excludes = undefined) => {
  const fse = require('fs-extra')
  const path = require('path')

  let killed = require('./kill')(from, to)
  if (!killed) return false
  let {dir: parentPath, name, base} = path.parse(to)
  let bin = path.parse(parentPath).base === 'bin'
  if (bin) parentPath = path.parse(parentPath).dir
  require('child_process').execSync(`start /wait msiexec /a "${from}" /quiet /qn TARGETDIR="${process.cwd()}\\unzip\\${name}\\"`)
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
  let rootPath = list.filter(i => path.parse(i).base === base)[0]
  rootPath = path.parse(rootPath).dir
  if (bin) rootPath = path.parse(rootPath).dir
  fse.copySync(rootPath, parentPath, opt)
  return true
}

module.exports = install
