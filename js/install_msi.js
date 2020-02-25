'use strict'

/**
 * @description regard the install pack as Windows Installer Package
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {(string | array)} excludes what files you don't want to install
 * @param {string} preferPath
 * @param {(string | array)} msiParams
 */

let install = async (info, excludes = [], preferPath, msiParams) => {
  let install = () => {
    const fse = require('fs-extra')
    const path = require('path')
    const replace = require('./replaceWithDict')

    excludes = [].concat(excludes, '.msi$')
    msiParams = [].concat(msiParams).filter(i => i).map(i => replace(i, { dir: info.parentPath }))

    let log = path.resolve(__dirname, './../debug/', path.parse(info.output).name + '.log')

    require('child_process').execSync(`start /wait msiexec /a "${info.output}" /passive /qr /norestart /log "${log}" TARGETDIR="${path.parse(__dirname).dir}\\unzip\\${info.name}" ${msiParams.join(' ')}`)

    let list = require('./walk')(`unzip\\${info.name}`)
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
      rootPath = list.find(i => fse.statSync(i).isFile() && path.dirname(path.relative(`unzip\\${info.name}`, i)) === '.')
      pathSplit = path.relative(`unzip\\${info.name}`, rootPath).split('/')
    }

    for (let i = 0; i < pathSplit.length; i++) {
      rootPath = path.parse(rootPath).dir
    }

    require('./copy')(rootPath, info.parentPath, excludes)
    return true
  }

  let killed = require('./kill')(info.parentPath)
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
