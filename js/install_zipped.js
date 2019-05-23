'use strict'

/**
 * @description regard the install pack as a zipped file which contains a real install pack
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | function)} js A js or function to call next
 * @param {string} filter The filter to real install pack
 * @param {string} args other args for js
 */

let install = async (from, to, js, filter = undefined, ...args) => {
  const path = require('path')
  const fse = require('fs-extra')
  const cp = require('child_process')

  try {
    cp.execSync(`plugins\\7z.exe t "${from}"`)
  } catch (error) {
    fse.writeFileSync('error', error.output)
    fse.unlinkSync(from)
    console.error(`Output:\t${from}\nError:\tFile Error`)
    return false
  }

  cp.execSync(`plugins\\7z.exe x -y -o"unzip" "${from}"`)
  let list = require('./walk')('unzip').map(i => i.replace(/^unzip(\\|\/)/, ''))

  list = list.filter(i => fse.statSync(path.resolve('./unzip', i)).isFile())
  let fromNew = filter ? list.filter(i => i.match(filter))[0] : list[0]
  if (!fromNew) {
    console.error(`Output:\t${from}\nError:\tCan't Find ${filter}`)
    return false
  }
  fromNew = path.resolve('./unzip', fromNew)

  let installed
  if (typeof js === 'string' && require('./' + js)) {
    installed = await require('./' + js)(fromNew, to, ...args)
  } else if (typeof js === 'function') {
    installed = await js(fromNew, to)
  }

  return installed
}

module.exports = install
