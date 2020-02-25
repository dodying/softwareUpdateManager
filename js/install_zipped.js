'use strict'

/**
 * @description regard the install pack as a zipped file which contains a real install pack
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {(string | function)} js A js or function to call next
 * @param {(string | RegExp)} filter The filter to real install pack
 * @param {string} args other args for js
 */

let install = async (info, js, filter = undefined, ...args) => {
  const path = require('path')
  const fse = require('fs-extra')
  const cp = require('child_process')

  try {
    cp.execSync(`plugins\\7z.exe t -sccUTF-8 "${info.output}"`)
  } catch (error) {
    fse.unlinkSync(info.output)
    console.error(`Error:\tFile "${info.output}" Error`)
    return false
  }

  cp.execSync(`plugins\\7z.exe x -sccUTF-8 -y -o"unzip" "${info.output}"`)
  let list = require('./walk')('unzip').map(i => i.replace(/^unzip(\\|\/)/, ''))

  list = list.filter(i => fse.statSync(path.resolve('./unzip', i)).isFile())
  let fromNew = filter ? list.filter(i => i.match(filter))[0] : list[0]
  if (!fromNew) {
    console.error(`Error:\tFile "${info.output}" Cant Find "${filter}"`)
    return false
  }

  info.output = path.resolve('./unzip', fromNew)
  // console.debug({ output: info.output })
  let installed
  if (typeof js === 'string' && require('./' + js)) {
    installed = await require('./' + js)(info, ...args)
  } else if (typeof js === 'function') {
    installed = await js(info)
  }

  return installed
}

module.exports = install
