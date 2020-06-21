'use strict';

/**
 * @description regard the install pack as Nullsoft Scriptable Install System
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {string[]} args
 * @param {object} options
 */

const install = async (info, args, options = {}) => {
  // https://helpnet.flexerasoftware.com/installshield19helplib/helplibrary/IHelpSetup_EXECmdLine.htm
  // https://www.itninja.com/static/090770319967727eb89b428d77dcac07.pdf
  args = [].concat('/v"INSTALLDIR=\\"{dir}""', args || []);
  options = Object.assign({ wait: true, shell: true }, options);
  return require('./install_cli')(info, null, args, options);
};

module.exports = install;
