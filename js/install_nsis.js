'use strict'

/**
 * @description regard the install pack as Nullsoft Scriptable Install System
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {string[]} args
 * @param {object} options
 * @param {function} callback
 */

let install = async (from, to, args = [], options = {}, callback) => {
  // https://nsis.sourceforge.io/Docs/Chapter3.html
  args = [].concat('/S', args, '/D={dir}')
  options = Object.assign({ wait: true }, options)
  if (options.nosilent) args.splice(0, 1)
  return require('./install_cli')(from, to, from, args, options, callback)
}

module.exports = install
