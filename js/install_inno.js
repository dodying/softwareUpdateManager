'use strict'

/**
 * @description regard the install pack as Inno Setup
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {(string | array)} excludes what files you don't want to install
 * @param {object} toDirUserDefined
 */

let install = async (info, excludes = undefined, toDirUserDefined = {}) => {
  const fse = require('fs-extra')
  const cp = require('child_process')
  const replace = require('./replaceWithDict')

  try {
    cp.execSync(`plugins\\innounp.exe -t "${info.output}"`)
  } catch (error) {
    fse.unlinkSync(info.output)
    console.error(`Output:\t${info.output}\nError:\tFile Error`)
    return false
  }

  let install = () => {
    // http://innounp.sourceforge.net/#Usage
    cp.execSync(`plugins\\innounp.exe -x -d"unzip\\${info.name}\\" -b -a -y "${info.output}"`)
    let list = fse.readdirSync(`unzip\\${info.name}`).filter(i => fse.statSync(`unzip\\${info.name}\\` + i).isDirectory())

    // let is64bit = require('os').arch() === 'x64'

    let toDir = Object.assign({
      // http://www.jrsoftware.org/ishelp/index.php?topic=consts

      '{app}': info.parentPath,

      '{win}': null,
      '{sys}': null,
      '{syswow64}': null,
      '{sd}': null,
      '{pf}': null,
      '{pf32}': null,
      '{pf64}': null,
      '{cf}': null,
      '{cf32}': null,
      '{cf64}': null,
      '{fonts}': null,
      '{dao}': null,
      // '{win}': process.env.SystemRoot,
      // '{sys}': process.env.SystemRoot + '\\system32',
      // '{syswow64}': process.env.SystemRoot + '\\SysWOW64',
      // '{sd}': process.env.SystemDrive,
      // '{pf}': process.env.ProgramFiles,
      // '{pf32}': is64bit ? process.env['ProgramFiles(x86)'] : process.env.ProgramFiles,
      // '{pf64}': process.env.ProgramFiles,
      // '{cf}': process.env.CommonProgramFiles,
      // '{cf32}': is64bit ? process.env['CommonProgramFiles(x86)'] : process.env.CommonProgramFiles,
      // '{cf64}': process.env.CommonProgramFiles,
      // '{fonts}': process.env.SystemRoot + '\\Fonts',
      // '{dao}': process.env.ProgramFiles + '\\Microsoft Shared\\DAO',

      // '{localappdata}': null,
      // '{userappdata}': null,
      // '{commonappdata}': null,
      // '{usercf}': null,
      // '{userpf}': null,
      '{localappdata}': process.env.LOCALAPPDATA,
      '{userappdata}': process.env.APPDATA,
      '{commonappdata}': process.env.ProgramData,
      '{usercf}': process.env.LOCALAPPDATA + '\\Programs\\Common',
      '{userpf}': process.env.LOCALAPPDATA + '\\Programs',

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
      require('./copy')(`unzip\\${info.name}\\${i}`, replace(toDir[i], { dir: info.parentPath }), excludes)
    }
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
