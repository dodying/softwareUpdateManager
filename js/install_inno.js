'use strict'

/**
 * @description regard the install pack as Inno Setup
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
  let {dir: parentPath, name} = path.parse(to)
  if (path.parse(parentPath).base === 'bin') parentPath = path.parse(parentPath).dir
  // http://innounp.sourceforge.net/#Usage
  require('child_process').execSync(`plugins\\innounp.exe -x -d"unzip\\${name}\\" -b -a -y "${from}"`)
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
  if (list.includes('{app}')) {
    fse.copySync(`unzip\\${name}\\{app}`, parentPath, opt)
  }
  if (list.includes('{userappdata}')) {
    fse.copySync(`unzip\\${name}\\{userappdata}`, `${process.env.APPDATA}`, opt)
  }
  return true
}

module.exports = install
