'use strict'

/**
 * @description regard the install pack as a Single file
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 */

let install = (from, to) => {
  let killed = require('./kill_single')(from, to)
  if (!killed) return false
  try {
    require('fs-extra').copyFileSync(from, to)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

module.exports = install
