'use strict';

/**
 * @description regard the install pack as Inno Setup
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {string[]} args
 * @param {object} options
 */

const install = async (info, args, options = {}) => {
  // http://www.jrsoftware.org/ishelp/topic_setupcmdline.htm
  args = [].concat('/SP-', '/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART', '/CLOSEAPPLICATIONS', '/RESTARTAPPLICATIONS', args || [], '/DIR="{dir}"');
  options = Object.assign({ wait: true, shell: true }, options);
  return require('./install_cli')(info, null, args, options);
};

module.exports = install;
