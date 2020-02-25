'use strict'

/**
 * @description regard the install pack as a Single file
 * @returns {boolean} if install completed
 * @param {string} info
 */

let install = async (info) => {
  let killed = require('./kill_single')(info.path)
  let fs = require('fs-extra')
  if (!killed) return false
  try {
    fs.mkdirsSync(info.parentPath)
    fs.copySync(info.output, info.path)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = install
