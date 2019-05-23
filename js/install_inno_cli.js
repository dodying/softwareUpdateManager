'use strict'

/**
 * @description regard the install pack as Inno Setup
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {string[]} args
 * @param {object} options
 * @param {function} callback
 */

let install = async (from, to, args = [], options = {}, callback) => {
  // http://www.jrsoftware.org/ishelp/topic_setupcmdline.htm
  args = [].concat('/SP-', '/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART', '/CLOSEAPPLICATIONS', '/RESTARTAPPLICATIONS', args, '/DIR="{dir}"')
  options = Object.assign({ wait: true, shell: true }, options)
  return require('./install_cli')(from, to, from, args, options, callback)
}

module.exports = install
