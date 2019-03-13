'use strict'

/**
 * @description regard the install pack as Windows Installer Package
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | array)} excludes what files you don't want to install
 * @param {string} preferPath
 */

let install = (from, to, excludes = [], preferPath) => {
  excludes = [].concat(excludes, '.msi$')

  const fse = require('fs-extra')
  const path = require('path')

  let install = () => {
    let { dir: parentPath, name } = path.parse(to)

    require('child_process').execSync(`start /wait msiexec /a "${from}" /passive /qr /norestart TARGETDIR="${path.parse(__dirname).dir}\\unzip\\${name}\\"`)

    let list = require('./walk')(`unzip\\${name}`)
    let pathSplit, rootPath
    if (preferPath) {
      pathSplit = preferPath.split('/')
      rootPath = list.filter(i => path.parse(i).base.toLocaleLowerCase() === pathSplit[0].toLocaleLowerCase())[0]
    } else {
      rootPath = list.find(i => fse.statSync(i).isFile() && path.dirname(path.relative(`unzip\\${name}`, i)) === '.')
      pathSplit = path.relative(`unzip\\${name}`, rootPath).split('/')
    }

    for (let i = 1; i < pathSplit.length; i++) {
      rootPath = path.parse(rootPath).dir
      parentPath = path.parse(parentPath).dir
    }

    if (fse.statSync(rootPath).isFile()) rootPath = path.parse(rootPath).dir

    require('./copy')(rootPath, parentPath, excludes)
    return true
  }

  let killed = require('./kill')(from, to)
  if (!killed) return false

  try {
    let installed = install()
    return installed
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = install
