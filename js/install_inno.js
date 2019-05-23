'use strict'

/**
 * @description regard the install pack as Inno Setup
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | array)} excludes what files you don't want to install
 * @param {object} toDirUserDefined
 */

let install = async (from, to, excludes = undefined, toDirUserDefined = {}) => {
  const fse = require('fs-extra')
  const path = require('path')
  const cp = require('child_process')
  const replace = require('./replaceWithDict')

  try {
    cp.execSync(`plugins\\innounp.exe -t "${from}"`)
  } catch (error) {
    fse.unlinkSync(from)
    console.error(`Output:\t${from}\nError:\tFile Error`)
    return false
  }

  let install = () => {
    let { dir: parentPath, name } = path.parse(to)
    while (parentPath.toLowerCase().split(/[/\\]+/).includes('bin')) {
      parentPath = path.parse(parentPath).dir
    }

    // http://innounp.sourceforge.net/#Usage
    cp.execSync(`plugins\\innounp.exe -x -d"unzip\\${name}\\" -b -a -y "${from}"`)
    let list = fse.readdirSync(`unzip\\${name}`).filter(i => fse.statSync(`unzip\\${name}\\` + i).isDirectory())

    // let is64bit = require('os').arch() === 'x64'

    let toDir = Object.assign({
      '{app}': parentPath,
      // '{win}': process.env.SystemRoot,
      '{win}': null,
      // '{sys}': process.env.SystemRoot + '\\system32',
      '{sys}': null,
      // '{syswow64}': process.env.SystemRoot + '\\SysWOW64',
      '{syswow64}': null,
      // '{sd}': process.env.SystemDrive,
      '{sd}': null,
      // '{pf}': process.env.ProgramFiles,
      '{pf}': null,
      // '{pf32}': is64bit ? process.env['ProgramFiles(x86)'] : process.env.ProgramFiles,
      '{pf32}': null,
      // '{pf64}': process.env.ProgramFiles,
      '{pf64}': null,
      // '{cf}': process.env.CommonProgramFiles,
      '{cf}': null,
      // '{cf32}': is64bit ? process.env['CommonProgramFiles(x86)'] : process.env.CommonProgramFiles,
      '{cf32}': null,
      // '{cf64}': process.env.CommonProgramFiles,
      '{cf64}': null,
      // '{fonts}': process.env.SystemRoot + '\\Fonts',
      '{fonts}': null,
      // '{dao}': process.env.ProgramFiles + '\\Microsoft Shared\\DAO',
      '{dao}': null,

      // '{localappdata}': process.env.LOCALAPPDATA,
      '{localappdata}': null,
      // '{userappdata}': process.env.APPDATA,
      '{userappdata}': null,
      // '{commonappdata}': process.env.ProgramData,
      '{commonappdata}': null,
      // '{usercf}': process.env.LOCALAPPDATA + '\\Programs\\Common',
      '{usercf}': null,
      // '{userpf}': process.env.LOCALAPPDATA + '\\Programs',
      '{userpf}': null,

      '{src}': null,
      '{tmp}': null,
      '{group}': null,
      '{userdesktop}': null,
      '{commondesktop}': null,
      '{userdocs}': null,
      '{commondocs}': null,
      '{userfavorites}': null,
      '{commonfavorites}': null,
      '{userprograms}': null,
      '{commonprograms}': null,
      '{usersendto}': null,
      '{userstartmenu}': null,
      '{commonstartmenu}': null,
      '{userstartup}': null,
      '{commonstartup}': null,
      '{usertemplates}': null,
      '{commontemplates}': null
    }, toDirUserDefined)
    let toEval = []

    for (let i of list) {
      if (i in toDir) {
        let topath = toDir[i]
        if (topath) toEval.push(i)
      } else {
        console.warn(`Warn:\tNot defined dir "${i}"`)
      }
    }

    for (let i of toEval) {
      require('./copy')(`unzip\\${name}\\${i}`, replace(toDir[i], { dir: parentPath }), excludes)
    }
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
