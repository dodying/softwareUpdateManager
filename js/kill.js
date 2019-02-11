'use strict'

/**
 * @description try to kill the process(es) which under folder of {to}
 * @returns {boolean} if process(es) kill
 * @param {string} from A path to the install pack file.
 * @param {string} to A path to the bin file.
 */

let kill = (from, to) => {
  const cp = require('child_process')
  const readlineSync = require('readline-sync')
  const path = require('path')

  let running
  let { dir: parentPath, name } = path.parse(to)

  while (parentPath.split(/[/\\]+/).includes('bin')) {
    parentPath = path.parse(parentPath).dir
  }

  try {
    running = cp.execSync(`wmic process where "ExecutablePath like '${parentPath.replace(/[/\\]/g, '\\\\')}%'" get ExecutablePath, Caption`).toString()
    if (running.match(/^\s+$/)) running = false
  } catch (error) {
    running = false
  }
  if (running) {
    console.log(running)
    let choose = [
      'Not Kill (skip install this software)',
      'Kill manually (wait until you kill process)',
      'Kill immediately (may with data losed)'
    ]
    choose = readlineSync.keyInSelect(choose, 'Do you want to kill process?')
    if (choose === 0) {
      console.error(`Software:\t${name}\nError:\tSkipped\nLocation:\t${from}\nTarget:\t${to}`)
      return false
    } else if (choose === 1) {
      readlineSync.keyInPause('Press any key to continue')
    } else if (choose === 2) {
      cp.execSync(`wmic process where "ExecutablePath like '${parentPath.replace(/[/\\]/g, '\\\\')}%'" delete`).toString()
    }
    return require('./kill')(from, to)
  }
  return true
}

module.exports = kill
