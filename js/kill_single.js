'use strict';

/**
 * @description try to kill the process(es) which under folder of {to}
 * @returns {boolean} if process(es) kill
 * @param {string} toPath A path to the bin file.
 */

const kill = toPath => {
  const cp = require('child_process');
  const readlineSync = require('readline-sync');

  if (!require('fs').existsSync(toPath)) return true;

  let running;
  try {
    running = cp.spawnSync('wmic', ['process', 'where', 'ExecutablePath="' + toPath.replace(/[/\\]/g, '\\\\') + '"', 'get', 'ExecutablePath,', 'Caption']).output[1].toString();
    if (running.match(/^\s+$/)) running = false;
  } catch (error) {
    running = false;
  }
  if (running) {
    console.log(running);
    let choose = [
      'Not Kill (skip install this software)',
      'Kill manually (wait until you kill process)',
      'Kill immediately (may with data losed)'
    ];
    choose = readlineSync.keyInSelect(choose, 'Do you want to kill process?');
    if (choose === 0) {
      return false;
    } else if (choose === 1) {
      readlineSync.keyInPause('Press any key to continue');
    } else if (choose === 2) {
      cp.execSync(`wmic process where ExecutablePath="'${toPath.replace(/[/\\]/g, '\\\\')}" Call Terminate`).toString();
    }
    return require('./kill_single')(toPath);
  }
  return true;
};

module.exports = kill;
