'use strict'

/**
 * @description regard the install pack as Inno Setup and contains 64 and 32 bit file
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {(string | array)} excludes what files you don't want to install
 * @param {string | object} preserveType
 * @param {object} toDirUserDefined
 */

let install = async (info, excludes = undefined, preserveType = undefined, toDirUserDefined = {}) => {
  const path = require('path')
  const fse = require('fs-extra')

  let installed = require('./../js/install_inno')(info, excludes, toDirUserDefined)
  if (installed) {
    let list = require('./walk')(info.parentPath)
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
      let base = `${name},${type}${ext}`
      if (type === preferType.toString()) {
        fse.renameSync(i, path.join(dir, name + ext))
        console.log(`Rename:\t${base} ==> ${name + ext}`)
      } else {
        fse.unlinkSync(i)
        console.log(`Delete:\t${base}`)
      }
    }

    return true
  }
  return installed
}

module.exports = install
