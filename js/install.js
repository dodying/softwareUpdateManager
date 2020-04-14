'use strict';

/**
 * @description regard the install pack as a zipped file
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {(string | array)} excludes what files you don't want to install
 * @param {string} filterInZip The filter to real install pack in zipped file
 */

const install = async (info, excludes = undefined, filterInZip = '', params = '') => {
  const fse = require('fs-extra');
  const path = require('path');
  const cp = require('child_process');
  const readlineSync = require('readline-sync');

  const check = () => {
    try {
      cp.execSync(`plugins\\7z.exe t -sccUTF-8 "${info.output}" ${params || ''}`);
    } catch (error) {
      if (error.output.toString().includes('Enter password (will not be echoed):')) {
        const pwd = readlineSync.question('Encrypted zip, please put in password: (find in download page) ');
        params += ` -p"${pwd}"`;
        return true;
      } else {
        fse.unlinkSync(info.output);
        console.error(`Error:\tFile "${info.output}" Error`);
        return false;
      }
    }
  };

  const install = () => {
    const name = Math.random().toString().substr(2);

    cp.execSync(`plugins\\7z.exe x -sccUTF-8 -y -o"unzip\\${name}\\" "${info.output}" ${params || ''} ${filterInZip || ''}`);
    let fromNew = `unzip\\${name}`;
    let list = fse.readdirSync(fromNew);
    while (list.length === 1) {
      fromNew = path.resolve(fromNew, list[0]);
      if (!fse.statSync(fromNew).isDirectory()) {
        fromNew = path.parse(fromNew).dir;
        break;
      }
      list = fse.readdirSync(fromNew);
    }

    require('./copy')(fromNew, info.parentPath, excludes);
    return true;
  };

  const killed = require('./kill')(info.parentPath);
  if (!killed) return false;

  try {
    let checked = true;
    while (checked) {
      checked = check();
    }
    if (checked === false) return;
    const installed = install();
    return installed;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = install;
