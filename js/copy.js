'use strict';

const fse = require('fs-extra');
const path = require('path');

/**
 * @description copy file
 * @param {string} from A path to file or folder
 * @param {string} to A path to file or folder
 * @param {(string | array)} excludes what files you don't want to copy
 */

const copy = function (from, to, excludes) {
  excludes = require('./../config').excludeGlobal.concat(excludes || []);
  const includes = require('./../config').includeGlobal;

  fse.copySync(from, to, {
    filter: (src, dest) => {
      const relativePath = path.relative(from, src);

      if (includes.some(i => relativePath.match(i))) return true;
      if (excludes.some(i => relativePath.match(i))) {
        console.log(`Excluded File:\t${relativePath}`);
        return false;
      }

      return true;
    }
  });
};

module.exports = copy;
