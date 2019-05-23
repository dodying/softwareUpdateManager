'use strict'

/**
 * @description
 * @returns {boolean} if install completed
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 * @param {string} command
 * @param {string[]} args
 * @param {object} options
 * @param {function} callback
 */

let install = async (from, to, command, args = [], options = {}, callback) => {
  console.warn(`Installing:\t${from}\nNotice:\tThis is just same as install manually`)
  if (!require('./../config').ignoreWarn.install && !require('readline-sync').keyInYNStrict('Continue to install?')) return false

  command = command || from

  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  if (options.shell || options.windowsVerbatimArguments) {
    if (command.match(/\s/)) command = `"${command}"`
  }
  if (options.wait) {
    args.splice(0, 0, '/c', 'start', '""', '/wait', command)
    command = 'cmd.exe'
    delete options.wait
  }

  let install = async () => {
    const path = require('path')
    const cp = require('child_process')
    const replace = require('./replaceWithDict')

    let parentPath = path.dirname(to)
    while (parentPath.toLowerCase().split(/[/\\]+/).includes('bin')) {
      parentPath = path.dirname(parentPath)
    }
    args = args.map(i => replace(i, { 'dir': parentPath }))

    let info
    try {
      console.log({ command, args, options })
      info = cp.spawnSync(command, args, options)
    } catch (error) {
      console.error(error)
      return false
    }
    let installed = true
    if (typeof callback === 'function') installed = await callback(info)
    return installed
  }

  let killed = require('./kill')(from, to)
  if (!killed) return false

  try {
    let installed = await install()
    return installed
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = install
