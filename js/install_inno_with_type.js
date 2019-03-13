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
  while (parentPath.toLowerCase().split(/[/\\]+/).includes('bin')) {
    parentPath = path.parse(parentPath).dir
  }

  let installed = require('./../js/install_inno')(from, to, null, toDirUserDefined)
  if (installed) {
    let list = require('./walk')(parentPath)
    list = list.filter(i => path.parse(i).name.match(/,\d+$/))

    if (!preserveType) preserveType = require('os').arch() === 'x64' ? '2' : '1'
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

    return true
  }
  return installed
}

module.exports = install
