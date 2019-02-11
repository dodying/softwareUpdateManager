'use strict'

/**
 * @description regard the install pack as a zipped file
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | array)} excludes what files you don't want to install
 * @param {string} filterInZip The filter to real install pack in zipped file
 */

let install = (from, to, excludes = undefined, filterInZip = '') => {
  const fse = require('fs-extra')
  const path = require('path')

  let killed = require('./kill')(from, to)
  if (!killed) return false
  let {dir: parentPath, name} = path.parse(to)
  if (path.parse(parentPath).base === 'bin') parentPath = path.parse(parentPath).dir
  require('child_process').execSync(`plugins\\7z.exe x -y -o"unzip\\${name}\\" "${from}" ${filterInZip}`)
  let list = fse.readdirSync(`unzip\\${name}`)
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
  if (list.length === 1 && fse.statSync(`unzip\\${name}\\${list[0]}`).isDirectory()) {
    fse.copySync(`unzip\\${name}\\${list[0]}`, parentPath, opt)
  } else {
    fse.copySync(`unzip\\${name}`, parentPath, opt)
  }
  return true
}

module.exports = install
