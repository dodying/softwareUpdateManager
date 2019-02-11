'use strict'

/**
 * @description regard the install pack as Inno Setup and contains 64 and 32 bit file
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | array)} excludes what files you don't want to install
 * @param {string | object} preserveType
 * @param {object} toDirUserDefined
 */

let install = (from, to, excludes = undefined, preserveType = undefined, toDirUserDefined = {}) => {
  const path = require('path')
  const fse = require('fs-extra')

  let { dir: parentPath } = path.parse(to)

  let installed = require('./../js/install_inno')(from, 'unzip/path/bin.exe', null, toDirUserDefined)
  if (installed) {
    let list = require('./walk')('unzip/path')
    list = list.filter(i => path.parse(i).name.match(/,\d+$/))

    if (preserveType === undefined) preserveType = require('os').arch() === 'x64' ? '2' : '1'
    for (let i of list) {
      let { dir, name, ext } = path.parse(i)
      let type
      [, name, type] = name.match(/(.*),(\d+)$/)
      let preferType
      if (typeof preserveType === 'string') {
        preferType = preserveType
      } else if (typeof preserveType === 'object') {
        preferType = preserveType[name] || preserveType['default']
      }
      if (type === preferType) {
        fse.renameSync(i, path.join(dir, name + ext))
      } else {
        fse.unlinkSync(i)
      }
    }
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

    fse.copySync('unzip/path', parentPath, opt)

    return true
  }
  return installed
}

module.exports = install
