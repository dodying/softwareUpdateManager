'use strict';

/**
 * @description regard the install pack as Nullsoft Scriptable Install System
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {string[]} args
 * @param {object} options
 */

const install = async (info, args, options = {}) => {
  // https://nsis.sourceforge.io/Docs/Chapter3.html
  args = [].concat('/S', args || [], '/D={dir}');
  options = Object.assign({ wait: true }, options);
  if (options.nosilent) args.splice(0, 1);
  return require('./install_cli')(info, null, args, options);
};

module.exports = install;
