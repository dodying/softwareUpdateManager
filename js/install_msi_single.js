'use strict'

/**
 * @description regard the install pack as Windows Installer Package and Single file
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {string} preferPath
 */

let install = async (from, to, preferPath) => {
  const path = require('path')

  let tmpNumber = Math.random().toString()
  let tmpFolder = path.resolve(__dirname, './../unzip/', tmpNumber)
  let extract = require('./install_msi')(from, path.resolve(tmpFolder, preferPath), null, preferPath)
  if (extract) {
    let list = require('./walk')(tmpFolder)
    list = list.filter(i => path.basename(i) === preferPath)
    if (!list.length) {
      console.error(`Error:\tCan filter the file`)
      return false
    }
    return require('./install_single')(list[0], to)
  }
  return false
}

module.exports = install
