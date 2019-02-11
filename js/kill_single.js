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
  let name = path.parse(to).name
  try {
    running = cp.execSync(`wmic process where ExecutablePath="'${from.replace(/[/\\]/g, '\\\\')}" get ExecutablePath, Caption`).toString()
    if (running.match(/^\s+$/)) running = false
  } catch (error) {
    running = false
  }
  if (running) {
    console.log(running)
    let choose = [
      'Kill immediately (may with data losed)',
      'Kill manually (wait until you kill process)',
      'Not Kill (skip install this software)'
    ]
    choose = readlineSync.keyInSelect(choose, 'Do you want to kill process?')
    if (choose === 0) {
      cp.execSync(`wmic process where ExecutablePath="'${from.replace(/[/\\]/g, '\\\\')}" delete`).toString()
    } else if (choose === 1) {
      readlineSync.keyInPause('Press any key to continue')
    } else if (choose === 2) {
      console.error(`Software:\t${name}\nError:\tSkipped\nLocation:\t${from}\nTarget:\t${to}`)
      return false
    }
    return require('./kill_single')(from, to)
  }
  return true
}

module.exports = kill
