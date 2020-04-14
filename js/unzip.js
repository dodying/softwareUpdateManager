'use strict';

/**
 * @description unzip
 * @returns {boolean} if unzip completed
 * @param {string} zip A path to the zipped file.
 * @param {string} dist A folder path to the dist.
 * @param {string} filterInZip The filter to real install pack in zipped file
 */

const unzip = (zip, dist, filterInZip = '') => {
  const cp = require('child_process');
  try {
    cp.execSync(`plugins\\7z.exe x -sccUTF-8 -y -o"${dist}" "${zip}" ${filterInZip || ''}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = unzip;
