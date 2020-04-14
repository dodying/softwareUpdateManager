'use strict';

/**
 * @description regard the install pack as Inno Setup and Single file
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {string} filter The filter to path
 */

const install = async (info, filter = /\.exe$/i) => {
  const path = require('path');

  const tmpNumber = Math.random().toString();
  const tmpFolder = path.resolve(__dirname, './../unzip/', tmpNumber);

  const tmpInfo = Object.assign({}, info, {
    parentPath: tmpFolder,
    path: path.resolve(tmpFolder, 'tmp.exe')
  });

  const extract = require('./install_inno')(tmpInfo);
  if (extract) {
    let list = require('./walk')(tmpFolder);
    list = list.filter(i => path.basename(i).match(filter));
    if (!list.length) {
      console.error('Error:\tCan filter the file');
      return false;
    }

    info.output = list[0];
    return require('./install_single')(info);
  }
  return false;
};

module.exports = install;
