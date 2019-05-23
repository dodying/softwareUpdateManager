'use strict'

/**
 * @description regard the install pack as Windows Installer Package
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | array)} excludes what files you don't want to install
 * @param {string} preferPath
 * @param {(string | array)} msiParams
 */

let install = async (from, to, excludes = [], preferPath, msiParams) => {
  let install = () => {
    const fse = require('fs-extra')
    const path = require('path')
    const replace = require('./replaceWithDict')

    let { dir: parentPath, name } = path.parse(to)

    excludes = [].concat(excludes, '.msi$')
    msiParams = [].concat(msiParams).filter(i => i).map(i => replace(i, { dir: parentPath }))

    require('child_process').execSync(`start /wait msiexec /a "${from}" /passive /qr /norestart TARGETDIR="${path.parse(__dirname).dir}\\unzip\\${name}" ${msiParams.join(' ')}`)

    let list = require('./walk')(`unzip\\${name}`)
    let pathSplit, rootPath
    if (preferPath) {
      pathSplit = preferPath.split(/[/\\]+/)
      rootPath = list.filter(i => {
        return path.basename(i).toLowerCase() === pathSplit[pathSplit.length - 1].toLowerCase()
      }).filter(i => {
        let _path = i.split(/[/\\]+/)
        if (_path.length < pathSplit.length) return false
        for (let i = 1; i <= pathSplit.length; i++) {
          let a = pathSplit[pathSplit.length - i].toLowerCase()
          let b = _path[_path.length - i].toLowerCase()
          if (a !== b) return false
        }
        return true
      })
      if (rootPath.length) {
        rootPath = rootPath[0]
      } else {
        return false
      }
    } else {
      rootPath = list.find(i => fse.statSync(i).isFile() && path.dirname(path.relative(`unzip\\${name}`, i)) === '.')
      pathSplit = path.relative(`unzip\\${name}`, rootPath).split('/')
    }

    for (let i = 0; i < pathSplit.length; i++) {
      rootPath = path.parse(rootPath).dir
      if (i !== 0) parentPath = path.parse(parentPath).dir
    }

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
