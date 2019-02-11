'use strict'

/**
 * @description regard the install pack as Inno Setup and contains 64 and 32 bit file
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {(string | array)} excludes what files you don't want to install
 */

let install = (from, to, excludes = undefined) => {
  let installed = require('./../js/install_inno')(from, to, excludes)
  if (installed) {
    const path = require('path')
    const fs = require('fs')
    let parentPath = path.parse(to).dir
    let list = require('./walk')(parentPath)
    let is64Bit = require('os').arch() === 'x64'
    let keepFile = is64Bit ? ',2' : ',1'
    let removeFile = is64Bit ? ',1' : ',2'
    list.forEach(i => {
      if (i.match(keepFile)) {
        fs.renameSync(i, i.replace(keepFile, ''))
      } else if (i.match(removeFile)) {
        fs.unlinkSync(i)
      }
    })
  }
  return installed
}

module.exports = install
