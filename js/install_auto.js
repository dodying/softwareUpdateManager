'use strict';

/**
 * @description Auto
 * @returns {boolean} if install completed
 * @param {string} vars
 * @param {(string | array)} excludes what files you don't want to install
 */

const install = async (vars, excludes = undefined) => {
  const fse = require('fs-extra');
  const path = require('path');
  const cp = require('child_process');
  const installerFile = vars.output;

  const innounp = () => {
    let list;
    try {
      list = cp.execSync(`plugins\\innounp.exe -t "${installerFile}"`, { encoding: 'utf8' });
    } catch (error) {
      return false;
    }
    list = list.split(/[\r\n]/).filter(i => i.match(/^#\d+\s+(.*)$/)).map(i => i.match(/^#\d+\s+(.*)$/)[1]);
    if (list.filter(i => path.parse(i).name.match(/,\d+$/)).length) {
      console.log('Inno Setup With Types');
      return require('./install_inno_type')(vars, excludes);
    } else {
      console.log('Inno Setup');
      return require('./install_inno')(vars, excludes);
    }
  };
  try {
    let info = cp.execSync(`plugins\\7z.exe l -sccUTF-8 "${installerFile}"`, { encoding: 'utf8' });
    info = info.split(/[\r\n]+/);

    const anchor = info.filter(i => i.match(/(-{4,}\s+){4}/));
    const start = info.indexOf(anchor[0]);
    const end = info.indexOf(anchor[1], start + 1);
    info = info.splice(start + 1, end - start - 1);

    const files = [];
    const anchorIndex = [];
    anchor[0].split(/\s+/).forEach((item, index) => {
      const prev = index ? anchorIndex[index - 1].start + anchorIndex[index - 1].length : 0;
      anchorIndex.push({
        start: anchor[0].indexOf(item, prev),
        length: item.length
      });
    });

    for (let i = 0; i < info.length; i++) {
      const arr = anchorIndex.map((item, index) => info[i].substr(item.start, index === anchorIndex.length - 1 ? info[i].length : item.length).trim());
      files.push({
        date: arr[0],
        attr: arr[1],
        size: arr[2],
        compressed: arr[3],
        name: arr[4]
      });
    }

    if (files.filter(i => i.name === '.rdata').length) {
      if (files.filter(i => i.name === '.rsrc\\version.txt').length) {
        cp.execSync(`plugins\\7z.exe e -sccUTF-8 -y -o"unzip\\" "${installerFile}" ".rsrc\\string.txt"`);
        let content = fse.readFileSync('./unzip/string.txt', 'utf-8');
        fse.unlinkSync('./unzip/string.txt');
        /* eslint-disable no-control-regex */
        content = content.replace(/\u0000/g, '');
        if (content.match('Advanced Installer')) {
          console.log('Advanced Installer');
          return require('./install_ai')(vars, excludes);
        } else {
          return false;
        }
      } else {
        innounp();
      }

      // binaries
    } else if (files.filter(i => i.name === '!File').length) {
      console.log('MSI');
      return require('./install_msi')(vars, excludes);
    } else if (files.filter(i => i.name.match(/app-64\.7z$/i)).length) {
      console.log('app-64');
      return require('./install_zipped')(vars, 'install', 'app-64.7z');
    } else if (files.filter(i => i.name.match(/app-32\.7z$/i)).length) {
      console.log('app-32');
      return require('./install_zipped')(vars, 'install', 'app-32.7z');
    } else if (files.filter(i => i.name.match(/full\.nupkg$/i)).length) {
      console.log('nupkg');
      return require('./install_zipped')(vars, 'install', 'full.nupkg', null, 'lib\\net45');
    } else if (files.filter(i => i.name.match(/^u\d*$/i)).length) {
      console.log('WIX');
      return require('./install_wix')(vars, excludes);
    } else {
      console.log('Normal Zip or NSIS');
      return require('./install')(vars, excludes);
    }
  } catch (error) {
    return innounp();

    // console.error(error)
    // return false
  }
};

module.exports = install;
