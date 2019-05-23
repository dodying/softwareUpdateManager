'use strict'

/**
 * @description regard the install pack as Windows Installer Package
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {string[]} args
 * @param {object} options
 * @param {function} callback
 */

let install = async (from, to, args = [], options = {}, callback) => {
  args = [].concat('/i', `"${from}"`, '/passive', '/qr', '/norestart', 'TARGETDIR="{dir}"', 'INSTALLDIR="{dir}"', args)
  options = Object.assign({ wait: true, shell: true }, options)
  return require('./install_cli')(from, to, 'msiexec.exe', args, options, callback)
}

module.exports = install
