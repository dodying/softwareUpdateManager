'use strict';

/**
 * @description
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {string[]} args
 * @param {object} options
 * @param {function} callback
 */

const install = async (info, args, options = {}, callback) => {
  return info.fns.install.cli(info, null, ['/S'].concat(args || []), Object.assign({ wait: true }, options), callback);
};

module.exports = install;
