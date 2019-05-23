'use strict'

/**
 * @description regard the install pack as Advanced Installer
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {string[]} args
 * @param {object} options
 * @param {function} callback
 */

let install = async (from, to, args = [], options = {}, callback) => {
  // https://www.advancedinstaller.com/user-guide/exe-setup-file.html
  args = [].concat('/i', '//', '/passive', '/qr', '/norestart', 'TARGETDIR="{dir}"', args)
  options = Object.assign({ wait: true }, options)
  return require('./install_cli')(from, to, from, args, options, callback)
}

module.exports = install
