'use strict';

const path = require('path');

/**
 * @description regard the install pack as Windows Installer Package
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {string[]} args
 * @param {object} options
 * @param {function} callback
 */

const install = async (info, args, options = {}, callback) => {
  const log = path.resolve(__dirname, './../debug/', path.parse(info.output).name + '.log');
  args = [].concat('/i', `"${info.output}"`, '/passive', '/qr', '/norestart', '/log', '"' + log + '"', 'TARGETDIR="{dir}"', 'INSTALLDIR="{dir}"', args || []);
  options = Object.assign({ wait: true, shell: true }, options);
  return require('./install_cli')(info, 'msiexec.exe', args, options, callback);
};

module.exports = install;
