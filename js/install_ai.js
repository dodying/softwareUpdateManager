'use strict'

/**
 * @description regard the install pack as Advanced Installer
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {(string | array)} excludes what files you don't want to install
 * @param {string} filter The filter to path of folder or file (single)
 */

let install = async (info, excludes = undefined, filter) => {
  const path = require('path')
  const fse = require('fs-extra')
  const cp = require('child_process')
  let parentPath = info.parentPath

  let install = () => {
    cp.execSync(`"${info.output}" /extract:"${info.fns.dirname}\\unzip\\"`)

    let fromNew = fse.readdirSync('unzip')
    let fromNewFilter = fromNew.filter(i => i.match(/^[A-Z0-9]{7}$/))
    if (fromNewFilter.length) {
      fromNew = path.join('unzip', fromNewFilter[0])
    } else {
      fromNew = 'unzip'
    }

    if (filter) {
      let lst = require('./walk')(fromNew, { ignoreFile: '.msi', recursive: false })
      fromNew = lst.filter(i => path.relative(fromNew, i).match(filter))
      if (fromNew.length) {
        fromNew = fromNew[0]
      } else {
        console.error(`Error:\tCan get match path in "install_ai.js"`)
      }
    } else {
      let lst = fse.readdirSync(fromNew).filter(i => !['.msi'].includes(path.extname(i)))
      while (lst.length === 1) {
        fromNew = path.resolve(fromNew, lst[0])
        if (!fse.statSync(fromNew).isDirectory()) {
          fromNew = path.parse(fromNew).dir
          break
        }
        lst = fse.readdirSync(fromNew).filter(i => !['.msi'].includes(path.extname(i)))
      }
    }

    if (fse.statSync(fromNew).isFile()) parentPath = info.path

    require('./copy')(fromNew, parentPath, excludes)
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
