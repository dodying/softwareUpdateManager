'use strict'

/**
 * @description regard the install pack as Inno Setup and Single file
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {string} filter The filter to path
 */

let install = async (info, filter = /\.exe$/i) => {
  return require('./install_zipped')(info, 'install_single', filter)
}

module.exports = install
