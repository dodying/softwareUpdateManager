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
  const cp = require('child_process')

  try {
    cp.execSync(`plugins\\7z.exe t "${from}"`)
  } catch (error) {
    fse.unlinkSync(from)
    console.error(`Output:\t${from}\nError:\tFile Error`)
    return false
  }

  let install = () => {
    let { dir: parentPath, name } = path.parse(to)

    while (parentPath.toLowerCase().split(/[/\\]+/).includes('bin')) {
      parentPath = path.parse(parentPath).dir
    }

    cp.execSync(`plugins\\7z.exe x -y -o"unzip\\${name}\\" "${from}" ${filterInZip || ''}`)
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
    let fromNew = `unzip\\${name}`
    let list = fse.readdirSync(fromNew)
    while (list.length === 1) {
      fromNew = path.resolve(fromNew, list[0])
      if (!fse.statSync(fromNew).isDirectory()) {
        fromNew = path.parse(fromNew).dir
        break
      }
      list = fse.readdirSync(fromNew)
    }

    fse.copySync(fromNew, parentPath, opt)
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
