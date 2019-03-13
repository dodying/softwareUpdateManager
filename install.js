// ==Headers==
// @Name:               install
// @Description:        install
// @Version:            1.0.35
// @Author:             dodying
// @Date:               2019-2-17 18:04:39
// @Namespace:          https://github.com/dodying/Nodejs
// @SupportURL:         https://github.com/dodying/Nodejs/issues
// @Require:
// ==/Headers==

// 导入原生模块
const fse = require('fs-extra')
const path = require('path')

// 导入第三方模块

// Function

// Main
const main = async () => {
  let args = process.argv.splice(2)
  let install = require('./js/install_auto')
  for (let file of args) {
    let fullpath = path.resolve(process.cwd(), file)

    if (!fse.existsSync(fullpath)) continue

    fse.emptyDirSync('./unzip')

    let { dir, name } = path.parse(fullpath)

    let topath = path.join(dir, name)
    let topathTrue = topath
    let order = 1
    while (fse.existsSync(topathTrue)) {
      topathTrue = topath + '-' + (order++)
    }

    await install(fullpath, path.resolve(topathTrue, name))

    fse.emptyDirSync('./unzip')
  }
}

main().then(async () => {
  //
}, async err => {
  console.error(err)
  process.exit()
})
