'use strict'

/**
 * @description regard the install pack as a Single file
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 */

let install = (from, to) => {
  let killed = require('./kill_single')(from, to)
  let fs = require('fs-extra')
  if (!killed) return false
  try {
    let dir = require('path').parse(to).dir
    fs.mkdirsSync(dir)
    fs.copySync(from, to)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = install
