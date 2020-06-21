'use strict';

/**
 * @description
 * @returns {boolean} if install completed
 * @param {string} info
 * @param {string} command
 * @param {string[]} args
 * @param {object} options
 */

const install = async (info, command, args, options = {}) => {
  args = args || [];
  console.warn(`Installing:\t${info.output}\nNotice:\tThis is just same as install manually`);
  if (!info.config.ignoreWarn.install && !require('readline-sync').keyInYNStrict('Continue to install?')) return false;

  command = command || info.output;

  if (options.shell || options.windowsVerbatimArguments) {
    if (command.match(/\s/)) command = `"${command}"`;
  }
  if (options.wait) {
    args.splice(0, 0, '/c', 'start', '""', '/wait', command);
    command = 'cmd.exe';
    delete options.wait;
  }

  const install = async () => {
    const replace = require('./replaceWithDict');

    args = args.map(i => replace(i, {
      dir: info.parentPath,
      output: info.output
    }));

    try {
      console.debug({ command, args, options });
      await info.fns.spawnSync(command, args, options);
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  const killed = require('./kill')(info.parentPath);
  if (!killed) return false;

  try {
    const installed = await install();
    return installed;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = install;
