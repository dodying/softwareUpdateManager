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
  let { dir: parentPath } = path.parse(to)
  while (parentPath.toLowerCase().split(/[/\\]+/).includes('bin')) {
    parentPath = path.parse(parentPath).dir
  }
  if (!require('fs').existsSync(parentPath)) return true

  try {
    running = cp.spawnSync('wmic', ['process', 'where', 'ExecutablePath like \'' + parentPath.replace(/[/\\]/g, '\\\\') + '%\'', 'get', 'ExecutablePath,', 'Caption']).output[1].toString()
    if (running.match(/^\s+$/)) running = false
  } catch (error) {
    running = false
  }
  if (running) {
    console.log(running)
    let choose = [
      'Not Kill (skip install this software)',
      'Not Kill (install force, may throw error)',
      'Kill manually (wait until you kill process)',
      'Kill immediately (may with data losed)'
    ]
    choose = readlineSync.keyInSelect(choose, 'Do you want to kill process?')
    if (choose === 0) {
      return false
    } else if (choose === 1) {
      return true
    } else if (choose === 2) {
      readlineSync.keyInPause('Press any key to continue')
    } else if (choose === 3) {
      cp.execSync(`wmic process where "ExecutablePath like '${parentPath.replace(/[/\\]/g, '\\\\')}%'" Call Terminate`).toString()
    }
    return require('./kill')(from, to)
  }
  return true
}

module.exports = kill
