'use strict'

/**
 * @description regard the install pack as Inno Setup and Single file
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {string} filter The filter to path
 */

let install = async (from, to, filter = /\.exe$/i) => {
  return require('./install_zipped')(from, to, 'install_single', filter)
}

module.exports = install
