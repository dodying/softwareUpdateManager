'use strict'

const fs = require('fs')
const path = require('path')

let getValue = (value, dafaultValue) => {
  if (value instanceof Array) {
  } else if (value instanceof RegExp || typeof value === 'string') {
    value = [].concat(value)
  } else if (typeof value === 'number') {
    value = [].concat(value.toString())
  } else {
    value = dafaultValue
  }
  return value
}

class Option {
  constructor (dir, other = {}) {
    this.dir = dir
    Object.assign(this, {
      fullpath: true,
      nodir: false,
      recursive: true
    }, other)
    this.ignore = getValue(this.ignore, [])
    this.ignoreDir = getValue(this.ignoreDir, [])
    this.ignoreFile = getValue(this.ignoreFile, [])

    this.match = getValue(this.match, null)
    this.matchDir = getValue(this.matchDir, null)
    this.matchFile = getValue(this.matchFile, null)
  }
}

/**
 * @description get file under {dir}
 * @returns {Array} files list
 * @param {string} dir A path
 * @param {object} option
 */

let walk = function (dir, option = {}) {
  option = new Option(dir, option)

  // dir = path.resolve(process.cwd(), dir)

  let output = []
  let list = fs.readdirSync(dir)
  list.forEach(function (file) {
    if (option.ignore.some(i => file.match(i))) return
    if (option.match && !option.match.some(i => file.match(i))) return

    let fullpath = path.join(dir, file)
    let name = option.fullpath ? fullpath : path.relative(option.dir, fullpath)
    let isDirectory
    try {
      isDirectory = fs.existsSync(fullpath) && fs.statSync(fullpath).isDirectory()
    } catch (error) { // ignore
      return
    }
    if (isDirectory) {
      let dirname = file // path.dirname(file)
      if (option.ignoreDir.some(i => dirname.match(i))) return
      if (option.matchDir && !option.matchDir.some(i => dirname.match(i))) return

      if (!option.nodir) output.push(name)
      if (option.recursive) output = output.concat(walk(fullpath, option) || [])
    } else {
      let basename = path.basename(file)
      if (option.ignoreFile.some(i => basename.match(i))) return
      if (option.matchFile && !option.matchFile.some(i => basename.match(i))) return

      if (option.match && !option.match.some(i => file.match(i))) return
      output.push(name)
    }
  })
  return output
}

module.exports = walk
