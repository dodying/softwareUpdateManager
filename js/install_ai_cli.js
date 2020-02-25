'use strict'

/**
 * @description regard the install pack as Advanced Installer
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {string[]} args
 * @param {object} options
 * @param {function} callback
 */

let install = async (info, args, options = {}, callback) => {
  // https://www.advancedinstaller.com/user-guide/exe-setup-file.html
  args = [].concat('/i', '//', '/passive', '/qr', '/norestart', 'TARGETDIR="{dir}"', 'INSTALLDIR="{dir}"', args || [])
  options = Object.assign({ wait: true, shell: true }, options)
  return require('./install_cli')(info, null, args, options, callback)
}

module.exports = install
