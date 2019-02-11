'use strict'

/**
 * @description regard the install pack as a Windows Installer XML
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | array)} excludes what files you don't want to install
 * @param {(string | array | RegExp)} installMsi what msi you want to install (without .msi)
 * @param {boolean} recurse when $installMsi=1 and this ignored, this will be true
 */

let install = (from, to, excludes, installMsi, recurse) => {
  excludes = excludes ? [].concat(excludes) : []
  excludes.push('.msi$')

  installMsi = [].concat(installMsi).map(i => typeof i === 'string' ? i + '.msi' : i)
  if (installMsi.length === 1 && recurse === undefined) recurse = true

  const path = require('path')
  const fse = require('fs-extra')
  const cp = require('child_process')

  let install = () => {
    let { dir: parentPath, name } = path.parse(to)

    while (parentPath.split(/[/\\]+/).includes('bin')) {
      parentPath = path.parse(parentPath).dir
    }

    cp.execSync(`plugins\\dark.exe "${from}" -x ".\\unzip\\${name}"`)

    let opt = {
      filter: (src, dest) => {
        let arr = require('./../config').excludeGlobal
        if (excludes) arr = arr.concat(excludes)
        let str = path.relative(parentPath, dest)
        for (let i = 0; i < arr.length; i++) {
          if (str.match(arr[i])) return false
        }
        return true
      }
    }

    let fromNew = `unzip\\${name}\\AttachedContainer`
    let list = fse.readdirSync(fromNew)
    while (list.length === 1) {
      fromNew = path.resolve(fromNew, list[0])
      if (!fse.statSync(fromNew).isDirectory()) {
        fromNew = path.parse(fromNew).dir
        break
      }
      list = fse.readdirSync(fromNew)
    }

    for (let file of list) {
      let { name, ext } = path.parse(file)
      let _path = path.resolve('./', fromNew, file)

      let match = installMsi.some(i => {
        return typeof i === 'string' ? i === file : !!file.match(i)
      })

      if (!match) {
        fse.removeSync(_path)
        continue
      }

      if (ext === '.msi') {
        console.log(`Installing:\tExtract from ${file}`)
        let folderNew = `${path.parse(__dirname).dir}\\${fromNew}\\${name}_msi`
        cp.execSync(`start /wait msiexec /a "${_path}" /quiet /qn TARGETDIR="${folderNew}"`)
        fse.removeSync(_path)

        if (recurse) {
          while (true) {
            let files = fse.readdirSync(folderNew)
            files = files.filter(i => path.parse(i).ext !== '.msi')
            if (files.length === 1 && fse.statSync(path.resolve(folderNew, files[0])).isDirectory()) {
              folderNew = path.resolve(folderNew, files[0])
            } else {
              break
            }
          }
        }

        if (installMsi.length === 1 && recurse) {
          fse.copySync(folderNew, parentPath, opt)
          return true
        } else {
          fse.copySync(folderNew, `${path.parse(__dirname).dir}\\${fromNew}`, opt)
          fse.removeSync(`${path.parse(__dirname).dir}\\${fromNew}\\${name}_msi`)
        }
      }
    }

    fse.copySync(fromNew, parentPath, opt)
    return true
  }

  let killed = require('./kill')(from, to)
  if (!killed) return false

  try {
    let installed = install()
    return installed
  } catch (error) {
    return false
  }
}

module.exports = install
