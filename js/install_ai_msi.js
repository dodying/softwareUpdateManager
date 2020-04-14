'use strict';

/**
 * @description regard the install pack as Advanced Installer With Raw Msi
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {(string | array)} excludes what files you don't want to install
 * @param {(string | RegExp)} installMsi what msi you want to install (with .msi) // String: 完全相等, RegExp: 匹配即可
 * @param {string} preferPath
 * @param {(string | array)} msiParams
 */

const install = async (info, excludes = [], installMsi, preferPath, msiParams) => {
  const path = require('path');
  const fse = require('fs-extra');
  const cp = require('child_process');

  const install = () => {
    const tmpNumber = Math.random().toString();
    const tmpFolder = path.resolve(info.fns.dirname, 'unzip', tmpNumber);
    fse.mkdirSync(tmpFolder);
    cp.execSync(`"${info.output}" /extract:"${tmpFolder}"`);

    let fromNew = tmpFolder;
    let list = fse.readdirSync(fromNew);
    while (list.length === 1) {
      fromNew = path.resolve(fromNew, list[0]);
      if (!fse.statSync(fromNew).isDirectory()) {
        fromNew = path.parse(fromNew).dir;
        break;
      }
      list = fse.readdirSync(fromNew);
    }

    for (const file of list) {
      const _path = path.resolve(fromNew, file);
      if ((typeof installMsi === 'string' && file === installMsi) || (installMsi instanceof RegExp && file.match(installMsi))) {
        info.output = _path;
        return require('./install_msi')(info, excludes, preferPath, msiParams);
      } else {
        continue;
      }
    }

    console.error(`Error:\tCan't find file "${installMsi}"`);
    return false;
  };

  const killed = require('./kill')(info.parentPath);
  if (!killed) return false;

  try {
    const installed = install();
    return installed;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = install;
