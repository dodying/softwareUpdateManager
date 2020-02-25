'use strict'

/**
 * @description regard the install pack as Inno Setup
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {string[]} args
 * @param {object} options
 * @param {function} callback
 */

let install = async (info, args, options = {}, callback) => {
  // http://www.jrsoftware.org/ishelp/topic_setupcmdline.htm
  args = [].concat('/SP-', '/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART', '/CLOSEAPPLICATIONS', '/RESTARTAPPLICATIONS', args || [], '/DIR="{dir}"')
  options = Object.assign({ wait: true, shell: true }, options)
  return require('./install_cli')(info, null, args, options, callback)
}

module.exports = install
