'use strict'

/**
 * @description regard the install pack as Advanced Installer
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | array)} excludes what files you don't want to install
 * @param {string} filter The filter to path
 */

let install = (from, to, excludes = undefined, filter) => {
  const path = require('path')
  const fse = require('fs-extra')
  const cp = require('child_process')

  let install = () => {
    let { dir: parentPath } = path.parse(to)

    while (parentPath.toLowerCase().split(/[/\\]+/).includes('bin')) {
      parentPath = path.parse(parentPath).dir
    }

    cp.execSync(`"${from}" /extract "${path.parse(__dirname).dir}\\unzip\\"`)
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
    let fromNew = fse.readdirSync('unzip')
    fromNew = path.join('unzip', fromNew[0])
    if (filter) {
      let lst = require('./walk')(fromNew)
      fromNew = lst.filter(i => path.relative(fromNew, i).match(filter))
      if (fromNew.length) {
        fromNew = fromNew[0]
      } else {
        console.error(`Error:\tCan get match path in "install_ai.js"`)
      }
    }
    fse.copySync(fromNew, parentPath, opt)
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
