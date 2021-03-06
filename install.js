// ==Headers==
// @Name:               install
// @Description:        install
// @Version:            1.0.62
// @Author:             dodying
// @Modified:           2020-1-17 10:51:35
// @Namespace:          https://github.com/dodying/Nodejs
// @SupportURL:         https://github.com/dodying/Nodejs/issues
// @Require:            fs-extra,readline-sync
// ==/Headers==

// 导入原生模块
const path = require('path');

// 导入第三方模块
const fse = require('fs-extra');
const readlineSync = require('readline-sync');

// Function

// Main
const main = async () => {
  const args = process.argv.splice(2);
  const install = require('./js/install_auto');
  for (const file of args) {
    const fullpath = path.resolve(process.cwd(), file);

    if (!fse.existsSync(fullpath)) continue;
    console.log(fullpath);
    fse.emptyDirSync('./unzip');

    const { dir, name } = path.parse(fullpath);

    const topath = path.join(dir, name);
    let topathTrue = topath;
    let order = 1;
    while (fse.existsSync(topathTrue)) {
      topathTrue = topath + '-' + (order++);
    }

    await install({
      output: fullpath,
      parentPath: topathTrue,
      path: path.resolve(topathTrue, name)
    });

    fse.emptyDirSync('./unzip');
  }
  readlineSync.keyInPause('Press any key to exit');
};

main().then(async () => {
  //
}, async err => {
  console.error(err);
  readlineSync.keyInPause('Press any key to exit');
  process.exit();
});
