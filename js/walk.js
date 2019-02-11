'use strict'

/**
 * @description get file under {dir}
 * @returns {Array} files list
 * @param {string} dir A path
 */

let walk = function (dir) {
  var fs = require('fs')

  let separator = dir.match('/') ? '/' : '\\'
  let output = []
  let list = fs.readdirSync(dir)
  list.forEach(function (file) {
    let path = dir + separator + file
    if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
      output = output.concat(walk(path))
    } else {
      output.push(path)
    }
  })
  return output
}

module.exports = walk
