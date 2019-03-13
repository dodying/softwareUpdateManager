'use strict'

/**
 * @description regard the install pack as Inno Setup and Single file
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {string} filter The filter to path
 */

let install = (from, to, filter = /\.exe$/i) => {
  const path = require('path')

  let tmpNumber = Math.random().toString()
  let tmpFolder = path.resolve(__dirname, './../unzip/', tmpNumber)
  let extract = require('./install_inno')(from, path.resolve(tmpFolder, 'tmp.exe'))
  if (extract) {
    let list = require('./walk')(tmpFolder)
    list = list.filter(i => path.basename(i).match(filter))
    if (!list.length) {
      console.error(`Error:\tCan filter the file`)
      return false
    }
    return require('./install_single')(list[0], to)
  }
  return false
}

module.exports = install
