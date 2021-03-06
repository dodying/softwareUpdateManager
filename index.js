// ==Headers==
// @Name:               软件更新管理器
// @Name-en:            softwareUpdateManager
// @Description:        下载并安装可更新的软件
// @Description-en:     download and install softwares when updates available
// @Version:            1.2.0
// @Author:             dodying
// @Created:            2021-02-15 09:58:50
// @Modified:           2021/2/15 17:59:50
// @Namespace:          https://github.com/dodying/Nodejs
// @SupportURL:         https://github.com/dodying/Nodejs/issues
// @Require:            cheerio,commander,deepmerge,fs-extra,html-to-text,iconv-lite,node-notifier,readline-sync,request,request-promise,socks5-http-client,socks5-https-client
// ==/Headers==
/* eslint-disable no-control-regex */

// 设置
let _ = require('./config');

// 导入原生模块
const path = require('path');
const cp = require('child_process');
const readline = require('readline');
const util = require('util');

// 导入第三方模块
const commander = require('commander');
const program = new commander.Command();
const fse = require('fs-extra');
const cheerio = require('cheerio');
const readlineSync = require('readline-sync');
const request = require('request');
// const requestPromise = require('request-promise')
// const Agent = require('socks5-http-client/lib/Agent')
// const Agent2 = require('socks5-https-client/lib/Agent')
const notifier = require('node-notifier');
const merge = require('deepmerge');
// const iconv = require('iconv-lite')
const html2Text = require('html-to-text');

const walk = require('./js/walk');
const replace = require('./js/replaceWithDict');
const req = require('./js/req');
req.config.set('_', _);
const reqRaw = req.raw;
const reqHEAD = req.head;

// Console
const color = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m'
};
const _color = {
  log: color.FgGreen,
  warn: color.FgYellow,
  error: color.BgRed,
  debug: color.FgBlue
};
var consoleRaw = {};
function logModify (colorMsg, msg) {
  let lastKey;
  return typeof msg === 'string' ? msg.split('\n').map(j => {
    if (j.match(/^(.*):\t(.*)$/) || lastKey) {
      let result = j.match(/^(.*):\t(.*)$/);
      if (result) {
        lastKey = result[1];
      } else {
        result = [null, lastKey, j];
      }
      lastKey = result[1];
      let space = 16 - result[1].length - 1;
      if (result[2].match(/^"/)) space = space - 1;
      return `${color.FgCyan}${result[1]}${color.Reset}:${' '.repeat(space)}${colorMsg}${result[2]}${color.Reset}`;
    } else {
      return `${colorMsg}${j}${color.Reset}`;
    }
  }).join('\n') : msg;
}
for (const i of ['log', 'warn', 'error', 'debug']) {
  consoleRaw[i] = console[i];
  const logFile = path.resolve(__dirname, 'index.log');
  const colorRe = new RegExp('\x1b\\[\\d+m', 'gi');
  console[i] = (...args) => {
    for (let msg of args) {
      let msgString;
      if (msg instanceof Error) msg = `Error:\t${util.format(msg).trim()}`;
      if (typeof msg === 'string') {
        msg = logModify(_color[i], msg);
        if (_.debug) msgString = msg.replace(colorRe, '');
      } else {
        if (_.debug) msgString = util.formatWithOptions(_.formatOptions, msg);
      }

      if (_.debug) fse.appendFileSync(logFile, msgString + '\n');
      if (i !== 'debug' || (_.debug && typeof msg === 'string')) consoleRaw[i](msg);
    }
  };
}
for (const i in readlineSync) {
  if (!i.match(/^(question|keyIn|prompt)/)) continue;
  const raw = readlineSync[i];
  if (i.match(/^(keyIn|question)./)) {
    readlineSync[i] = (text, ...args) => {
      const msg = logModify(_color.warn, text);
      if (msg && _.debug) {
        let msgString = msg;
        if (msg instanceof Array) msgString = msgString.join('\n');
        const logFile = path.resolve(__dirname, 'index.log');
        const colorRe = new RegExp('\x1b\\[\\d+m', 'gi');
        fse.appendFileSync(logFile, msgString.replace(colorRe, '') + '\n');
      }
      const title = process.title;
      process.title = `[Wait] ${title}`;
      const result = raw(msg, ...args);
      process.title = title;
      return result;
    };
  }
}
for (const i in _.defaultOptions) util.inspect.defaultOptions[i] = _.defaultOptions[i];

_.archivePath = path.resolve(__dirname, _.archivePath);
_.download.urlWithoutHeader = [].concat(_.download.urlWithoutHeader, 'sourceforge.net', 'osdn.net', 'mediafire.com');

const exts = ['.zip', '.7z', '.exe', '.msi', '.rar', '.jar', '.tar', '.gz', '.bz2', '.xz', '.nupkg', '.dll', '.appx', '.appxbundle', '.msix', '.msixbundle', '.iso'];
const exts2 = ['.gz', '.bz2', '.xz'];

const releasePage = 'https://github.com/dodying/softwareUpdateManager/releases/tag/plugins';

const software = {};

const fns = { cheerio, getNow, spawnSync, req, reqRaw, reqHEAD, getHash, dirname: __dirname };
walk('js', { nodir: true, matchFile: /\.js$/ }).map(i => i.split(/[\\/]/).splice(1).join('/').replace(/\.js$/, '')).forEach(i => {
  const arr = i.split(/[/_]/);
  let obj = fns;
  for (let j = 0; j < arr.length - 1; j++) {
    if (!(arr[j] in obj)) obj[arr[j]] = {};
    obj = obj[arr[j]];
  }
  obj[arr[arr.length - 1]] = require(`./js/${i}.js`);
});
let databaseFile = `${__dirname}/database.json`;
let database = fse.existsSync(databaseFile) ? JSON.parse(fse.readFileSync(databaseFile, 'utf-8')) : {};

let mode;

// Function
function getNow () { return new Date().toLocaleString(_.locale, { hour12: false }); }

function spawnSync (...argsForSpwan) {
  return new Promise(resolve => {
    const child = cp.spawn(...argsForSpwan);

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('exit', function (code) {
      let end;
      if (code.toString() !== '0') {
        end = 'error';
        console.error(`Command:\t${argsForSpwan[0]}`);
        console.error(`Command-Args:${argsForSpwan[1].map(i => `{${i}}`).join(', ')}\n`);
        console.error(`Exit-Code:\t${code.toString()}`);
      } else {
        end = true;
      }
      resolve(end);
    });
  });
}

function getHash (file, algorithm) {
  // Hash algorithms: MD2 MD4 MD5 SHA1 SHA256 SHA384 SHA512
  return cp.spawnSync(path.resolve(process.env.SystemRoot, 'System32', 'certutil.exe'), ['-hashfile', file, algorithm]).output[1].toString().split(/[\r\n]+/)[1];
}

function ExtendSoftware (data) {
  const valid = any => typeof any === 'string' || any instanceof Array || any instanceof Function;
  if (data.version && valid(data.version)) {
    if (typeof data.version === 'string') {
      data.version = { selector: data.version };
    } else if (data.version instanceof Function) {
      data.version = { func: data.version };
    } else if (data.version instanceof Array) {
      data.version = {
        selector: data.version[0],
        attr: data.version[1],
        match: data.version[2],
        replace: data.version[3]
      };
    }
  }

  if (data.changelog && valid(data.changelog)) {
    data.changelog = [].concat(data.changelog);
    if (typeof data.changelog[0] === 'string') {
      if (!data.changelog[0].match(/^https?:/i)) data.changelog.unshift(null);

      data.changelog = {
        url: data.changelog[0],
        selector: data.changelog[1],
        attr: data.changelog[2],
        match: data.changelog[3],
        split: data.changelog[4]
      };
    } else if (typeof data.changelog[0] === 'function') {
      data.changelog = {
        func: data.changelog[0]
      };
    }
  }

  if (data.download && valid(data.download)) {
    data.download = [].concat(data.download);
    if (typeof data.download[0] === 'string') {
      if (data.download[0].match(/^https?:/i)) {
        data.download = {
          plain: data.download[0],
          output: data.download[1]
        };
      } else {
        data.download = {
          selector: data.download[0],
          attr: data.download[1],
          match: data.download[2],
          output: data.download[3]
        };
      }
    } else if (typeof data.download[0] === 'function') {
      data.download = {
        func: data.download[0],
        output: data.download[1]
      };
    }
  }

  if (data.install && (typeof data.install === 'string' || data.install instanceof Array)) {
    data.install = [].concat(data.install);
    if (require(`./js/${data.install[0]}`)) {
      const func = require(`./js/${data.install[0]}`);
      const args = data.install.slice(1);
      data.install = info => func(info, ...args);
    } else {
      delete data.install;
    }
  }

  return data;
}

function getPath (cmd) {
  return cp.spawnSync(process.env.comspec, ['/c', `echo "${cmd}"`], {
    env: Object.assign({}, process.env, {
      'ProgramFiles(x86)': process.env['ProgramFiles(x86)'] || process.env.ProgramFiles
    })
  }).output[1].toString().trim().match(/^\\"(.*)\\"$/)[1];
}

// Main-version

async function getLatestVersion (i) {
  const iEscaped = i.replace(/[:*?"<>|]/g, '-');

  const reqOption = { uri: software[i].url };

  if (software[i].url.match(/:\/\/api.github.com\//) && _.request.github) {
    if (!reqOption.headers) reqOption.headers = {};
    reqOption.headers.Authorization = `token ${_.request.github}`;
    reqOption.headers['User-Agent'] = _.request.userAgent;
  }

  const res = await req(reqOption, { useProxy: software[i].useProxy });
  let returnValue;

  if (res && (res.statusMessage === 'OK' || (res.statusCode >= 200 && res.statusCode < 300))) {
    returnValue = await (async function () {
      const $ = cheerio.load(res.body);
      if (_.debug) {
        const parentPath = path.dirname(`debug/${iEscaped}.html`);
        if (!fse.existsSync(parentPath)) fse.mkdirsSync(parentPath);
        fse.writeFileSync(`debug/${iEscaped}.html`, res.body);
        fse.writeJsonSync(`debug/${iEscaped}.json`, res, {
          spaces: 2,
          replacer: (key, value) => key === 'body' ? undefined : value
        });
      }

      // if ($('title').text().trim()) console.debug(`Title:\t${$('title').text().trim()}`);

      let version;
      if ('selector' in software[i].version) {
        try {
          version = $(software[i].version.selector);
        } catch (error) {
          console.error(`Error:\tSelector "${software[i].version.selector}" Invalid when "version"`);
          return false;
        }

        if (version.length === 0) {
          console.error(`Error:\tSelector "${software[i].version.selector}" Nothing when "version"`);
          return null;
        }

        version = version.eq(0);
        version = (software[i].version.attr === 'text' || !software[i].version.attr) ? version.text() : software[i].version.attr === 'html' ? $.html(version) : version.attr(software[i].version.attr);
        version = version.trim();
        if (version === '') {
          console.error(`Error:\tAttribute "${software[i].version.attr}" Empty when "version"`);
          return null;
        }
        // console.debug({ version });
        const regexp = software[i].version.match || /(\d+[\d.]+\d+)/;
        const matched = version.match(regexp);
        if (!matched) {
          console.error(`Error:\tRegExp "${regexp}" Dont Match Text "${version}" when "version"`);
          return null;
        }

        if (software[i].version.replace) {
          version = matched[0].replace(regexp, software[i].version.replace);
        } else {
          version = matched.length > 1 ? matched[1] : matched[0];
        }
      } else if ('func' in software[i].version) {
        try {
          version = await software[i].version.func(res, $, fns, software[i].versionChoice);
          if (!version) {
            console.error('Error:\t"func" return nothing when "version"');
            return null;
          }
          if (version instanceof Array) version = version.length ? version[1] : version[0];
        } catch (error) {
          console.error(`Error:\t${util.format(error)}`);
          return null;
        }
      } else {
        console.error('Error:\tNo "selector"/"func" in "version"');
        return null;
      }
      if (!version) {
        console.error('Error:\tGet nullish value in "version"');
        return null;
      }
      if (typeof version !== 'string') version = String(version);
      // if (version.match(/^(\d+[\d.]+\d+)( |-)Build( |-)(\d+)$/i)) console.debug(`Version-Raw:\t${version}`);
      version = version.replace(/^(\d+[\d.]+\d+)( |-)Build( |-)(\d+)$/i, '$1.$4').replace(/[\\/:*?"<>|]/g, '-').trim();
      return { version, res, $ };
    })();
  } else {
    if (res) {
      console.error(`Error:\t${res.statusCode} ${res.statusMessage}`);
    } else {
      console.error('Error:\tRequest return nothing');
    }
  }

  return returnValue;
}

async function getVersion (filepath) {
  if (fse.existsSync(filepath)) {
    let info;
    try {
      info = await new Promise(resolve => {
        cp.exec(`wmic DATAFILE where name="${filepath.replace(/[/\\]/g, '\\\\')}" get version`, (err, stdout, stderr) => {
          if (err) {
            resolve('0');
          } else {
            resolve(stdout);
          }
        });
      });
      if (info.match(/Version\s+([\d.]+)/)) return info.match(/Version\s+([\d.]+)/)[1];
    } catch (error) {
    }
  }
  return '0';
}

function versionMax (v1, v2) {
  const arr1 = v1.split(/[.\-_]+/);
  const arr2 = v2.split(/[.\-_]+/);
  const length = Math.min(arr1.length, arr2.length);
  for (let i = 0; i < length; i++) {
    const str1 = arr1[i];
    const str2 = arr2[i];
    const float1 = parseFloat(str1);
    const float2 = parseFloat(str2);
    if (isNaN(float1) || isNaN(float2)) {
      if (str1 > str2) {
        return true;
      } else if (str1 < str2) {
        return false;
      }
    } else {
      if (float1 > float2) {
        return true;
      } else if (float1 < float2) {
        return false;
      }
    }
  }
  return arr1.length > arr2.length;
}

// Main-changelog
async function getLatestVersionChangelog (i, versionLatest, res, $) {
  if (software[i].changelog.url) {
    let url;
    if (!software[i].changelog.url.match(/^https?:/i)) {
      url = $(software[i].changelog.url).eq(0).attr('href');
      if (!url) return;
    } else {
      url = software[i].changelog.url;
    }

    url = replace(url);
    res = await req(url, { useProxy: software[i].useProxy });

    if (res && (res.statusMessage === 'OK' || (res.statusCode >= 200 && res.statusCode < 300))) {
      $ = cheerio.load(res.body);
      // if ($('title').text().trim()) console.debug(`Title:\t${$('title').text().trim()}`);
    } else {
      if (res) {
        console.error(`Error:\t${res.statusCode} ${res.statusMessage}`);
      } else {
        console.error('Error:\tRequest return nothing');
      }
      return;
    }
  }

  const html2TextConfig = {
    tables: true,
    wordwrap: false,
    // linkHrefBaseUrl: res.request.uri.href,
    ignoreImage: true,
    // preserveNewlines: true,
    uppercaseHeadings: false,
    format: {
      heading: function (elem, fn, options) {
        var h = fn(elem.children, options);
        return `\n\n${color.Bright + color.Reverse}${h}${color.Reset}\n`;
      },
      horizontalLine: () => '\n' + '-'.repeat(80) + '\n\n'
    },
    unorderedListItemPrefix: '├─ ' // https://en.wikipedia.org/wiki/Box-drawing_character
  };
  if (software[i].changelog.split) html2TextConfig.format = null;

  let changelog;
  if ('func' in software[i].changelog) {
    try {
      let convert;
      changelog = await software[i].changelog.func(res, $, fns);
      changelog = [].concat(changelog)
      ;[changelog, convert] = changelog;
      if (convert) changelog = html2Text.fromString(changelog, html2TextConfig);
      return changelog;
    } catch (error) {
      console.error(`Error:\t${util.format(error)}`);
      return null;
    }
  } else {
    if (software[i].changelog.split) {
      software[i].changelog.selector = software[i].changelog.selector || 'body';
      software[i].changelog.attr = software[i].changelog.attr || 'html';
      software[i].changelog.match = software[i].changelog.match || /^\s*[\d.]+/;
    }

    if (res.headers['content-type'].match(/^(text\/plain|text\/markdown|application\/octet-stream)/) && software[i].changelog.selector === 'body' && software[i].changelog.attr === 'html') {
      changelog = res.body;
    } else {
      if (software[i].changelog.selector === 'body' && software[i].changelog.attr === 'html') console.debug(res.headers['content-type']);

      try {
        changelog = $(software[i].changelog.selector);
      } catch (error) {
        console.debug(`Error:\tSelector "${software[i].changelog.selector}" Invalid when "changelog"`);
        return false;
      }

      if (changelog.length === 0) {
        console.debug(`Error:\tSelector "${software[i].changelog.selector}" Nothing when "changelog"`);
        return null;
      }

      changelog = changelog.eq(0);
      changelog = (software[i].changelog.attr === 'text' || !software[i].changelog.attr) ? html2Text.fromString($.html(changelog), html2TextConfig) : software[i].changelog.attr === 'html' ? $.html(changelog) : changelog.attr(software[i].changelog.attr);
      if (!changelog || changelog.trim() === '') {
        console.debug(`Error:\tAttribute "${software[i].changelog.attr}" Empty when "changelog"`);
        return null;
      }
      changelog = changelog.replace(new RegExp(`\n${html2TextConfig.unorderedListItemPrefix}\n`, 'g'), '\n');
    }

    if (software[i].changelog.split) {
      const lineArr = changelog.replace(/[\u0000\r]/g, '').trim().split(/\n/);
      const split = lineArr.filter(line => line.match(software[i].changelog.match));
      // console.debug({ lineArr, split });
      const start = lineArr.indexOf(split[0]);
      if (start === -1) return null;
      let end = lineArr.indexOf(split[1]);
      end = end === -1 ? lineArr.length : end;
      changelog = lineArr.slice(start, end).join('\n');
    } else {
      if (software[i].changelog.match) changelog = changelog.match(software[i].download.match)[1];
    }
  }
  // if (changelog) fse.moveSync(`software/${i}.js`, `software-ok/${i}.js`)
  return changelog;
}

// Main-download

/**
 * @param {number} value
 * @param {array} formats
 * @param {(array | number)} steps
 * @param {string} output
 * @example valueHumanReadable(322350904, ['bytes', 'KB', 'MB', 'GB'], 1024, '{-1}{-1f}') => 307MB
 * @example valueHumanReadable(135400, ['s', 'min', 'h', 'day'], [60, 60, 24], '{2}:{1}:{0}') => 13:36:40
 */
function valueHumanReadable (value, formats, steps, output) {
  let outputRaw = value;
  if (typeof steps === 'number') steps = new Array(formats.length).join(',').split(',').map(i => steps);
  let index = 0;
  const arr = [];
  const obj = {};
  while (outputRaw >= steps[index] && index + 1 < formats.length) {
    arr.push(parseInt(outputRaw) % steps[index]);

    outputRaw = outputRaw / steps[index];
    obj[(index + 1).toString() + '.2'] = (outputRaw).toFixed(2) * 1;

    index = index + 1;
  }
  arr.push(steps[index] ? parseInt(outputRaw) % steps[index] : parseInt(outputRaw));
  for (let i = 0; i < formats.length; i++) {
    obj[i] = arr[i] || 0;
    obj[i.toString() + 'f'] = formats[i];
    if (i < arr.length) {
      obj[i - arr.length] = arr[i] || 0;
      obj[(i - arr.length).toString() + '.2'] = obj[i.toString() + '.2'];
      obj[(i - arr.length).toString() + 'f'] = formats[i];
    }
  }
  return replace(output, obj);
}

async function downloadFile (uri, i, target) {
  fse.mkdirsSync(path.dirname(target));
  software[i].retry = software[i].retry + 1;
  const requestProxy = _.request.proxy;
  _.request.proxy = _.download.proxy;
  const option = {
    uri: uri
  };

  if (_.download.timeout) option.timeout = _.download.timeout * 1000;
  const _withoutHeader = _.download.urlWithoutHeader.some(urlfilter => uri.match(urlfilter) || software[i].url.match(urlfilter)) || software[i].withoutHeader;
  if (_withoutHeader) {
    option.jar = request.jar();
    option.headers = {};
  }

  const isContinue = _.download.continue && fse.existsSync(target) && fse.existsSync(target + '.json');
  if (isContinue) {
    option.headers = Object.assign(option.headers, {
      Range: 'bytes=' + fse.statSync(target).size + '-'
    });
  }

  if (option.headers) {
    if (_.download.userAgent) {
      option.headers['User-Agent'] = _.download.userAgent;
    } else {
      delete option.headers['User-Agent'];
    }
  }

  let headers = isContinue ? fse.readJSONSync(target + '.json') : null;
  const checkFile = () => {
    if (!fse.existsSync(target)) return false;
    const md5 = headers.etag;
    if (md5) {
      const arr = headers.etag.split(/[^0-9a-f]/i).filter(i => i);
      if (arr[0].length === 32 && arr[0].toLowerCase() === getHash(target, 'md5')) {
        if (arr[0].toLowerCase() !== getHash(target, 'md5')) return false;
      }
    }

    const size = headers['content-length'];
    if (size) {
      if (+size !== fse.statSync(target).size) return false;
    } else {
      return false;
    }
    return true;
  };

  const result = await new Promise((resolve, reject) => {
    const req = reqRaw(option, { useProxy: software[i].useProxy });
    let intervalId, printProgress;
    const interval = 0.8; // 单位:s
    const errorHandle = async error => {
      if (fse.existsSync(target)) fse.unlinkSync(target);
      // if (fse.existsSync(target + '.json')) fse.unlinkSync(target + '.json')
      if (printProgress instanceof Function) printProgress();
      req.abort();
      clearInterval(intervalId);
      _.request.proxy = requestProxy;
      console.error(`Try-${software[i].retry}:\t${error.message}`);
      if (_.download.retry > software[i].retry) {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, _.download.retryDelay * 1000);
        });
        software[i].useProxy = !software[i].useProxy;
        return downloadFile(uri, i, target);
      } else {
        return resolve('error');
      }
    };

    const successHanle = (res) => {
      if (printProgress instanceof Function) printProgress();
      req.abort();
      clearInterval(intervalId);
      _.request.proxy = requestProxy;
      if (res.headers['last-modified']) {
        let lastModified = res.headers['last-modified'];
        lastModified = new Date(lastModified);
        fse.utimesSync(target, lastModified, lastModified);
        if (!_.download.continue) {
          fse.unlinkSync(target + '.json');
        } else {
          fse.utimesSync(target + '.json', lastModified, lastModified);
        }
      }
      resolve(true);
    };

    req.on('response', async res => {
      if (!isContinue) {
        headers = res.headers;
        fse.writeJSONSync(target + '.json', res.headers, { spaces: 2 });
      }
      if (fse.existsSync(target) && (res.headers['content-length'] === '0' || (headers['content-length'] && +headers['content-length'] === fse.statSync(target).size))) {
        if (checkFile()) {
          successHanle(res);
        } else {
          await errorHandle(new Error('File no Match'));
        }
        return;
      }

      if (fse.existsSync(target) && !res.headers['content-range'] && res.headers['content-length'] !== '0') fse.unlinkSync(target);
      let dl = fse.existsSync(target) ? fse.statSync(target).size : 0;
      const len = parseInt(res.headers['content-length'], 10) + dl;
      let dlLast = dl;
      let time = new Date().getTime() / 1000;
      let timeLast = time;
      const filename = path.basename(target);
      const sizeFormats = ['bytes', 'KB', 'MB', 'GB'];

      console.log(`[${valueHumanReadable(len, sizeFormats, 1024, '{-1.2} {-1f}')}] ${res.request.uri.href} ==> ${filename}`);
      printProgress = () => {
        if (_.download.quiet) return;
        const speed = (dl - dlLast) / (time - timeLast || interval);
        const remain = valueHumanReadable((len - dl) / speed, ['s', 'min', 'h', 'd'], [60, 60, 24], '{3}{3f} {2}{2f} {1}{1f} {0}{0f}');
        const speedRead = valueHumanReadable(speed, sizeFormats, 1024, '{-1.2} {-1f}/s');

        const percent = (100.0 * dl / len).toFixed(0) * 1;

        const dRead = valueHumanReadable(dl, sizeFormats, 1024, '{-1.2} {-1f}');
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${percent}% [${'='.repeat(percent)}${percent <= 99 ? '>' : ''}${' '.repeat(100 - percent)}] ${dRead} ${speedRead} ${remain}\r`);
      };
      intervalId = setInterval(printProgress, interval * 1000);

      res.pipe(fse.createWriteStream(target, { flags: 'a' })).on('finish', async () => {
        if (!headers['content-length'] || checkFile()) {
          successHanle(res);
        } else {
          await errorHandle(new Error('File no Match'));
        }
      }).on('error', async error => {
        await errorHandle(error);
      });

      res.on('data', chunk => {
        timeLast = time;
        time = new Date().getTime() / 1000;
        dlLast = dl;
        dl += chunk.length;
      });
    }).on('error', async error => {
      await errorHandle(error);
    });
  });
  return result;
}

function getExt (uri) {
  const uri1 = uri.replace('/download', '');
  const matched = path.extname(uri1).toLocaleLowerCase();
  if (exts.includes(matched)) {
    return exts2.includes(matched) ? path.extname(path.parse(uri1).name) + matched : matched;
  }
}

async function downloadLatestVersion (i, versionLatest, res, $) {
  const iEscaped = i.replace(/[:*?"<>|]/g, '-');
  let download, ext, matched;

  if ('plain' in software[i].download) { // download url is regular
    download = replace(software[i].download.plain);
  } else if ('selector' in software[i].download) { // can get download from html
    try {
      download = $(software[i].download.selector);
    } catch (error) {
      console.error(`Error:\tSelector "${software[i].download.selector}" Invalid when "download"`);
      return false;
    }

    if (download.length === 0) {
      console.error(`Error:\tSelector "${software[i].download.selector}" Nothing when "download"`);
      return null;
    }

    download = download.eq(0);
    download = software[i].download.attr === 'text' ? download.text() : software[i].download.attr === 'html' ? $.html(download) : download.attr(software[i].download.attr || 'href');
    if (!download || download.trim() === '') {
      console.error(`Error:\tAttribute "${software[i].download.attr}" Empty when "download"`);
      return null;
    }

    download = software[i].download.match && download.match(software[i].download.match) ? download.match(software[i].download.match)[1] : download;
  } else if ('func' in software[i].download) {
    try {
      download = await software[i].download.func(res, $, fns, software[i].downloadChoice);
      download = [].concat(download)
      ;[download, ext] = download;
      if (!download) {
        console.error('Error:\t"func" return nothing when "download"');
        return null;
      }
    } catch (error) {
      console.error(`Error:\t${util.format(error)}`);
      return null;
    }
  } else {
    console.error('Error:\tNo "plain"/"selector"/"func" in "download"');
    return null;
  }

  download = new URL(download, res.request.uri.href).href;

  if (ext) {
  } else if (software[i].download.output) {
    ext = software[i].download.output;
  } else if ((matched = getExt(download))) {
    ext = matched;
  } else {
    software[i].retry = 0;
    const res1 = await reqHEAD(download, { useProxy: software[i].useProxy, withoutHeader: software[i].withoutHeader });

    if (!res1) {
      console.error(`Error:\tCan't Access "${download}"`);
      console.error('Error:\tCan\'t get Extension name, please set "output" in "download"');
      return null;
    } else if ((matched = getExt(res1.request.uri.pathname))) {
      ext = matched;
    } else if (res1.headers['content-disposition'] && (matched = res1.headers['content-disposition'].match(/filename="?(.*?)"?(;|$)/)) && matched[1] && (matched = getExt(matched[1]))) {
      ext = matched;
    } else {
      console.error('Error:\tCan\'t get Extension name, please set "output" in "download"');
      return null;
    }
  }

  if (!ext) return null;

  let output = iEscaped + '-' + versionLatest + ext.toLowerCase();
  output = path.resolve(_.archivePath, output);

  if (JSON.parse(JSON.stringify(req.config.get('cookies')))._jar.cookies.length) {
    fse.writeFileSync('cookies.txt', JSON.parse(JSON.stringify(req.config.get('cookies')))._jar.cookies.map(i => [`.${i.domain}`, i.hostOnly ? 'TRUE' : 'FALSE', i.path, i.secure ? 'TRUE' : 'FALSE', i.expires ? Math.round(new Date(i.expires).getTime() / 1000) : '0', i.key, i.value].join('\t')).join('\r\n'));
  }

  const args = [];
  let end;

  const _withoutHeader = _.download.urlWithoutHeader.some(urlfilter => download.match(urlfilter) || software[i].url.match(urlfilter)) || software[i].withoutHeader;
  const _prxoy = _.download.proxy;
  const _withProxyRule = _.urlWithProxy.some(urlfilter => download.match(urlfilter) || software[i].url.match(urlfilter));
  const _withProxyMode = _.useProxy === 2 || (_.useProxy === 1 && software[i].useProxy);
  const _withProxyAuto = req.config.get('proxyList')[new URL(download).hostname] || req.config.get('proxyList')[new URL(software[i].url).hostname];
  const _withProxy = _withProxyRule || _withProxyMode || _withProxyAuto;
  const _withoutProxy = _.urlWithoutProxy.some(urlfilter => download.match(urlfilter));
  const _withProxyForce = _.urlWithProxyForce.some(urlfilter => download.match(urlfilter) || software[i].url.match(urlfilter));
  const _withoutProxyForce = _.urlWithoutProxyForce.some(urlfilter => download.match(urlfilter) || software[i].url.match(urlfilter));
  const _useProxy = _prxoy && (_withProxyForce || (_withProxy && !_withoutProxy)) && !_withoutProxyForce;

  if (['test'].includes(mode)) {
    const res = await reqHEAD(download, { useProxy: _useProxy, withoutHeader: _withoutHeader });
    if (res && (res.statusMessage === 'OK' || (res.statusCode >= 200 && res.statusCode < 300))) {
      if (res.headers['content-length']) {
        const len = parseInt(res.headers['content-length'], 10);
        const sizeFormats = ['bytes', 'KB', 'MB', 'GB'];
        console.log(`File Size:\t${valueHumanReadable(len, sizeFormats, 1024, '{-1.2} {-1f}')}`);
      } else {
        console.log('File Size:\tUnknown');
      }

      // TODO SOFTWARE TEST
      // software[i]._test_ok = true;
      // TODO SOFTWARE TEST
    } else if (res) {
      console.error(`Error:\t${res.statusCode} ${res.statusMessage}`);
    }

    // TODO SOFTWARE TEST
    // const name = i.split(':')[0];
    // const similarSoftwares = Object.entries(software).filter(arr => arr[0].split(':')[0] === name);

    // if (fse.existsSync(`software/${name}.js`) && similarSoftwares.indexOf(similarSoftwares.find(arr => arr[0] === i)) + 1 === similarSoftwares.length && similarSoftwares.every(arr => arr[1]._test_ok)) {
    //   const pathnew = `software-${similarSoftwares.every(arr => arr[1]._test_ok) ? 'ok' : 'test'}/${name}.js`;
    //   if (!fse.existsSync(path.dirname(pathnew))) fse.mkdirsSync(path.dirname(pathnew));
    //   fse.renameSync(`software/${name}.js`, pathnew);
    // }
    // TODO SOFTWARE TEST

    return null;
  }

  console.log(`Download${_useProxy ? '+proxy' : ''}:\t${download}`);
  console.log(`Output:\t${output}`);
  console.log();
  if (_.download.method === 'request') {
    software[i].retry = 0;
    end = await downloadFile(download, i, output);
  } else if (_.download.method === 'aria2c') {
    if (_.download.continue && fse.existsSync(output)) args.push('--continue');
    if (_.download.quiet) args.push('--quiet');
    if (_.download.retry) args.push('--max-tries=' + _.download.retry, '--retry-wait=' + _.download.retryDelay);
    if (_.download.timeout) args.push('--timeout=' + _.download.timeout);
    if (!_withoutHeader) {
      if (fse.existsSync('cookies.txt')) args.push('--load-cookies=cookies.txt'); // Load Cookies from FILE
      if (_.download.userAgent) args.push(`--user-agent="${_.download.userAgent}"`);
      args.push(`--referer="${software[i].url}"`);
    }
    if (_useProxy) {
      args.push(`--all-proxy=${_.download.proxy}`);
    }
    args.push('--check-certificate=false'); // Verify the peer using certificates
    args.push('--remote-time'); // Retrieve timestamp of the remote file from the remote HTTP/FTP server and if it is available, apply it to the local file.
    args.push('--auto-file-renaming=false'); // Rename file name if the same file already exists.
    args.push('--allow-overwrite=true'); // Restart download from scratch if the corresponding control file doesn’t exist.
    args.push('--file-allocation=none'); // Specify file allocation method.
    args.push('--min-split-size=1M'); // aria2 does not split less than 2*SIZE byte range.
    args.push('--max-connection-per-server=64'); // The maximum number of connections to one server for each download.
    args.push('--split=64'); // Download a file using N connections.
    args.push('--console-log-level=error'); // Set log level to output to console.
    if (_.debug) args.push(`--log=debug\\${iEscaped}-aria2c.log`); // The file name of the log file.
    args.push(`--out=${path.relative('', output)}`, download);
    end = await spawnSync('plugins\\aria2c.exe', args);
  } else if (_.download.method === 'wget') {
    if (_.download.continue && fse.existsSync(output)) args.push('--continue');
    if (_.download.quiet) args.push('--quiet');
    if (_.download.retry) args.push('--tries=' + _.download.retry, '--waitretry=' + _.download.retryDelay);
    if (_.download.timeout) args.push('--timeout=' + _.download.timeout);
    if (!_withoutHeader) {
      if (fse.existsSync('cookies.txt')) args.push('--load-cookies=cookies.txt'); // load cookies from FILE before session
      if (_.download.userAgent) args.push(`--user-agent="${_.download.userAgent}"`);
      args.push(`--referer="${software[i].url}"`);
    }
    if (_useProxy) {
      args.push('-e', 'use_proxy=yes');
      args.push('-e', `http_proxy=${_.download.proxy}`);
      args.push('-e', `https_proxy=${_.download.proxy}`);
      args.push('--no-check-certificate'); // don't validate the server's certificate
    }
    args.push('--no-verbose'); // turn off verboseness, without being quiet
    args.push('--show-progress'); // display the progress bar in any verbosity mode
    if (_.debug) args.push('--debug', `--append-output=debug\\${iEscaped}-wget.log`); // append messages to FILE
    args.push(`--output-document=${output}`, download);
    end = await spawnSync('plugins\\wget.exe', args);
  } else if (_.download.method === 'curl') {
    if (_.download.continue && fse.existsSync(output)) args.push('--continue-at', '-');
    if (_.download.quiet) args.push('--silent');
    if (_.download.retry) args.push('--retry', _.download.retry, '--retry-delay', _.download.retryDelay);
    if (_.download.timeout) args.push('--max-time', _.download.timeout);
    if (!_withoutHeader) {
      if (fse.existsSync('cookies.txt')) args.push('--cookie', 'cookies.txt'); // Send cookies from string/file
      if (_.download.userAgent) args.push('--user-agent', _.download.userAgent);
      args.push('--referer', software[i].url);
    }
    if (_useProxy) {
      args.push('--proxy', _.download.proxy);
      args.push('--insecure'); // Allow insecure server connections when using SSL
    }
    args.push('--remote-time'); // Set the remote file's time on the local output
    args.push('--location'); // Follow redirects
    if (_.debug) args.push('--verbose'); // append messages to FILE
    args.push('--output', output, download);
    end = await spawnSync('plugins\\curl.exe', args);
  }
  console.log();

  if (end === 'error') {
    console.error('Error:\tDownload new version Error');
    if (['test-download', 'test-install'].includes(mode)) {
      // go-on
    } else if (readlineSync.keyInYNStrict(`Open:\t${download}`)) cp.execSync(`start "" "${download}"`);
    return null;
  } else if (['backup'].includes(mode)) {
    return null;
  } else {
    return { output };
  }
}

// Main-virus

async function virusCheckFile (file) {
  const sha256 = getHash(file, 'sha256');

  let res = await req({
    uri: 'https://www.virustotal.com/vtapi/v2/file/report',
    method: 'POST',
    form: {
      apikey: _.virus.apiKey,
      resource: sha256
    }
  });
  if (!res.statusCode || !res.body) return virusCheckFile(file);
  if (res.json.response_code === -2) return 'Scaning';
  if (res.json.response_code === 0 && _.virus.upload) {
    console.log('Notice:\tYour file is uploading to scan');
    res = await req({
      uri: 'https://www.virustotal.com/vtapi/v2/file/scan',
      method: 'POST',
      formData: {
        apikey: _.virus.apiKey,
        file: {
          value: fse.createReadStream(file),
          options: {
            filename: path.basename(file),
            contentType: 'application/octet-stream'
          }
        }
      }
    });
    return virusCheckFile(file);
  }
  if (res.json.response_code === 0 && !_.virus.upload) return 'No Data';

  let result = Object.keys(res.json.scans).map(i => {
    return Object.assign({ name: i }, res.json.scans[i]);
  });
  console.warn(result.filter(i => i.detected).map(i => `Warn:\t${i.name}: ${i.result}`).join('\n'));
  result = result.filter(i => {
    const ignoreSoftware = _.virus.ignoreSoftware.some(keyword => {
      if (typeof keyword === 'string') {
        return i.name === keyword;
      } else if (keyword instanceof RegExp) {
        return i.name.match(keyword);
      }
    });
    const ignoreResult = _.virus.ignoreSoftware.some(keyword => {
      if (typeof keyword === 'string') {
        return i.result === keyword;
      } else if (keyword instanceof RegExp) {
        return i.result.match(keyword);
      }
    });
    return !ignoreSoftware && !ignoreResult;
  });
  const ratio = result.filter(i => i.detected).length / result.length;
  return ratio <= _.virus.safeDetectionRatio;
}

// Main-install

async function installLatestVersion (i, output) {
  const info = {
    i: i,
    name: i.replace(/[:*?"<>|]/g, '-').replace(/\//g, '\\'),
    path: software[i].path,
    parentPath: software[i].parentPath,
    output: output,

    fns: fns,
    config: _,
    choice: software[i].installChoice,
    other: software[i]
  };

  if (software[i].fixedPath) {
    if (!_.ignoreWarn.fixedPath && !readlineSync.keyInYNStrict('Continue to install?')) return false;
    // if (!fse.existsSync(software[i].parentPath)) {
    //   try {
    //     fse.mkdirsSync(software[i].parentPath);
    //   } catch (error) {
    //     console.error(`Error:\tCan't Create Directory "${software[i].parentPath}"`);
    //     return false;
    //   }
    // }
  }

  if (!_.ignoreWarn.preferPath && software[i].preferPath && software[i].path.toLowerCase().substr(-software[i].preferPath.length).replace(/\\/g, '/') !== software[i].preferPath.toLowerCase()) {
    console.warn(`Warn:\tTarget "${software[i].path}" Not Match preferPath "${software[i].preferPath}"`);
    if (!readlineSync.keyInYNStrict('Continue to install?')) return false;
  }

  let result;

  if (software[i].beforeInstall && software[i].beforeInstall instanceof Function) result = await software[i].beforeInstall(info);
  if (result === false) return false;

  if (_.backupOldVersion && fse.existsSync(software[i].parentPath)) {
    const from = software[i].parentPath;
    const version = database[i].version || await getVersion(software[i].path);
    let to = `${from}.old\\${version}`;
    if (!fse.existsSync(`${from}.old`)) {
      try {
        fse.mkdirsSync(`${from}.old`);
      } catch (error) {
        console.error(`Error:\tCan't Create Directory "${from}.old"`);
      }
    }
    if (fse.statSync(`${from}.old`).isDirectory()) {
      console.log(`Backup:\t${to}`);
      if (_.backupOldVersion === 1) { // move
        fse.copySync(from, to);
      } else if (_.backupOldVersion === 2) { // archive
        to = `${to}.7z`;
        cp.execSync(`plugins\\7z.exe a -mx9 -sccUTF-8 "${to}" "${from}"`);
      }
    } else {
      console.error(`Error:\tCan't Backup to "${to}"`);
    }
  }

  if (_.specialMode[i] === 3 || (!software[i].commercial && _.mode === 3) || (software[i].commercial && _.commercialMode === 3)) {
    if (software[i].install.toString().match(/install_(|\w+_)single/)) {
      const killed = require('./js/kill_single')(info.parentPath);
      if (!killed) return false;
      fse.removeSync(software[i].path);
    } else {
      const killed = require('./js/kill')(info.parentPath);
      if (!killed) return false;
      fse.removeSync(software[i].parentPath);
    }
  }
  const installed = await software[i].install(info);
  if (installed) {
    if (software[i].afterInstall && software[i].afterInstall instanceof Function) await software[i].afterInstall(info);
    if (!_.preserveArchive) fse.removeSync(output);
  } else {
    console.error('Error:\tSkipped');
  }
  return installed;
}

// Main-clean

function doBeforeExit () {
  if (_.debug) {
    const cookiesRaw = fse.existsSync('cookies.json') ? fse.readJSONSync('cookies.json') : {};
    let cookiesNew = JSON.parse(JSON.stringify(req.config.get('cookies')))._jar.cookies;
    cookiesNew = cookiesNew.concat(cookiesRaw).filter((item, index, array) => array.indexOf(array.filter(item2 => item2.key === item.key && item2.domain === item.domain && item2.path === item.path)[0]) === index);
    fse.writeJSONSync('cookies.json', cookiesNew, { spaces: 2 });
  } else {
    req.config.set('cookies', request.jar());
  }
  if (fse.existsSync('cookies.txt')) fse.removeSync('cookies.txt');
  if (['default', 'filter', 'check', 'install'].includes(mode)) fse.writeFileSync(databaseFile, JSON.stringify(database, null, 2));
  try {
    fse.removeSync(path.resolve(_.archivePath, 'unzip'));
    fse.emptyDirSync('./unzip');
  } catch (error) { }
}

// Main
const main = async () => {
  if (!fse.existsSync('./plugins')) {
    console.error('Error:\tNo Plugins, Please Download And Extract to "plugins"');
    if (readlineSync.keyInYNStrict(`Open ${releasePage}`)) cp.execSync(`start "" "${releasePage}"`);
  } else {
    const list = fse.readdirSync('./plugins');
    const notExists = [
      '7z.dll', '7z.exe',
      'dark.exe', 'winterop.dll', 'wix.dll',
      'innounp.exe'
    ].filter(i => !list.includes(i));
    // let downloadTool = ['aria2c.exe', 'wget.exe', 'curl.exe'].filter(i => list.includes(i))
    if (notExists.length) { //  || !downloadTool
      console.error('Error:\t"plugins" exists, but some file needed not');
      if (readlineSync.keyInYNStrict(`Open ${releasePage}`)) cp.execSync(`start "" "${releasePage}"`);
    }
  }

  const softwareAll = Object.fromEntries(walk(`${__dirname}/software`, { nodir: true, fullpath: false, ignoreDir: 'Invalid', matchFile: /\.js$/ }).map(file => {
    let info;
    try {
      info = require(`${__dirname}/software/${file}`);
      const pathArr = file.replace(/\.js$/, '').split(/[\\/]+/);
      let entries, directory;
      if (info.type === 'software-list') {
        entries = Object.entries(info.list);
        directory = info.noDirectory ? '' : (info.directory || pathArr.join('/'));
      } else {
        entries = [[pathArr.slice(-1)[0], info]];
        directory = pathArr.slice(0, -1).join('/');
      }
      directory = [].concat(directory);

      const length = entries.length;
      const entriesNew = [];
      for (let i = 0; i < length; i++) {
        const [key, value] = entries[i];
        value.file = file;
        const aliases = [].concat(value.alias, key).filter(i => i); delete value.alias;
        entriesNew.push(...directory.map(dir => aliases.map(alias => [`${dir ? `${dir}/` : ''}${alias}`, value])).flat());
        if (value.other) {
          entriesNew.push(...directory.map(dir =>
            aliases.map(alias =>
              Object.keys(value.other).map(key => {
                const aliases1 = [].concat(value.other[key].alias, key).filter(i => i);
                if (!value.other[key].url && value.other[key].site) value.other[key].url = null;
                return aliases1.map(alias1 => [`${dir ? `${dir}/` : ''}${alias}:${alias1}`, Object.assign({}, value, value.other[key])]);
              })
            )
          ).flat(3));

          Object.values(value.other).map(i => delete i.alias);
          delete value.other;
        }
      }

      return entriesNew;
    } catch (error) {
      console.error(error);
    }
  }).filter(i => i && i instanceof Array).flat().filter(i => i.length));

  const __content = fse.readFileSync(__filename, 'utf-8');
  program.version(__content.match(/^\/\/\s*@Version:\s*(\S+)$/im)[1]).description(__content.match(/^\/\/\s*@Description:\s*(\S+)$/im)[1]);
  program.option('-p, --profile <profile>', 'use specific profile defined in config.profile', (profile) => {
    if (!(profile in _.profile) || Object.keys(_.profile[profile]).length === 0) {
      console.error(`Error:\tNo Profile "${profile}"`);
      process.exit();
    }
    databaseFile = `${__dirname}/database-${profile}.json`;
    database = fse.existsSync(databaseFile) ? JSON.parse(fse.readFileSync(databaseFile, 'utf-8')) : {};
    _ = _.profile[profile].deepmerge ? merge(_, _.profile[profile]) : Object.assign(_, _.profile[profile]);
    delete _.profile;
  });
  program.option('-q, --quiet', 'passive mode', () => {
    readlineSync.keyInPause = query => console.warn(`${query} ${color.Reset}(Hit any key)`);
    readlineSync.keyInSelect = (list, query) => {
      console.log();
      list.forEach((i, j) => console.warn(`[${j + 1}] ${i}`));
      console.warn('[0] CANCEL');
      console.log();
      console.warn(`${query} [${list.map((i, j) => j + 1).join(', ')}, 0]: ${color.Reset}1`);
      return 0;
    };
    readlineSync.keyInYN = query => console.warn(`${query} ${color.Reset}[y/n]: n`) || false;
    readlineSync.keyInYNStrict = query => console.warn(`${query} ${color.Reset}[y/n]: n`) || false;
  });

  program.command('makemd').description('make README').action(async () => {
    let database;
    try {
      database = fse.existsSync('./software.json') ? fse.readJSONSync('./software.json') : {};
    } catch (error) {
      database = {};
    }

    let md = fse.readFileSync('README_RAW.md', 'utf-8');
    let mdEn = fse.readFileSync('README_en_RAW.md', 'utf-8');
    const search = fse.readdirSync('./js/search').map((item, order) => `${order + 1}. ${path.parse(item).name}`).join('\n');

    // let filePre = 'https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software'
    const filePre = 'software';

    const software = [];
    const softwareTagged = {};

    let orderForWithoutDownload = 0;
    let softwareWithoutDownload = '';

    let orderForWithoutInstaller = 0;
    let softwareWithoutInstaller = '';

    let orderForSpecialInstaller = 0;
    let softwareSpecialInstaller = '';

    // let list = fse.readdirSync('software')
    const descriptionUrl = ['github.com', 'api.github.com', 'sourceforge.net', 'www.majorgeeks.com', 'www.softpedia.com', 'www.nirsoft.net', 'www.sordum.org', 'docs.microsoft.com', 'www.the-sz.com', 'www.glarysoft.com', 'www.abelssoft.de', 'www.jam-software.com', 'www.sterjosoft.com', 'www.wisecleaner.com', 'vovsoft.com', 'www.fosshub.com', 'chocolatey.org'];
    const softwareEntries = Object.entries(softwareAll);
    for (let i = 0; i < softwareEntries.length; i++) {
      const [name, info] = softwareEntries[i];
      if (name.includes(':')) continue;

      const src = info.file.split(/[\\/]+/).map(i => encodeURIComponent(i)).join('/');
      let uri = info.url || Object.values(info.site)[0];
      const host = new URL(uri).host;

      let softwareThis = '';
      // softwareThis += `${i + 1}. `;
      softwareThis += '[';
      // softwareThis += `<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=${host}" width="16"> `
      softwareThis += `${name}](${uri})`;

      if (info.commercial === true || info.commercial === 3) softwareThis += ' :money_with_wings:';
      if (info.commercial === 2) softwareThis += ' [Free Personal]';
      if (info.commercial === 1) softwareThis += ' [Freemium]';
      if (info.useProxy) softwareThis += ' :airplane:';
      if (!info.install) softwareThis += ' :hand:';
      if (info.fixedPath) softwareThis += ' :pushpin:';
      if (info.tags) softwareThis += ` <tags: ${[].concat(info.tags).map(i => `[${i}](#${i})`).join(', ')}>`;

      if (!(name in database) && descriptionUrl.includes(host)) {
        console.log(`Index-${i + 1}:\t${name}`);
        if (uri.match(/api\.github\.com\/repos\/(.*)\/releases/)) {
          const matched = uri.match(/api\.github\.com\/repos\/(.*)\/releases/)[1];
          uri = `https://github.com/${matched}/releases/latest`;
        }
        // TODO RECORD GITHUB
        if (uri.match(/\/github.com\/(.*?)\/releases/)) {
          fse.appendFileSync('github.txt', uri.match(/\/github.com\/(.*?)\/releases/)[1] + '\n');
        }
        // TODO RECORD GITHUB

        let res = await req(uri, { useProxy: info.useProxy });
        if (res instanceof Error || !res || res.statusCode >= 300 || res.statusCode < 200) res = await req(uri, { useProxy: !info.useProxy });
        if (res && (res.statusMessage === 'OK' || (res.statusCode >= 200 && res.statusCode < 300))) {
          // TODO RECORD GITHUB
          if (uri.match(/\/github.com\/(.*?)\/releases/)) {
            const repo = uri.match(/\/github.com\/(.*?)\/releases/)[0];
            const repoNew = res.request.uri.href.match(/\/github.com\/(.*?)\/releases/)[0];
            if (repo !== repoNew) fse.appendFileSync('github-change.txt', uri.match(/\/github.com\/(.*?)\/releases/)[1] + '\n');
          }
          // TODO RECORD GITHUB
          const $ = cheerio.load(res.body);
          let description = $('[itemprop="description"]').text() || $('[name="description"]').attr('content') || $('[property="og:description"]').attr('content') || $('[name="twitter:description"]').attr('content') || '';
          if (uri.match(/\/github.com\/(.*?)\/releases/)) {
            const repo = res.request.uri.href.match(/\/github.com\/(.*?)\/releases/)[1];
            const watch = $('.social-count[aria-label$="watching this repository"]').eq(0).text().trim();
            const star = $('.social-count[aria-label$="starred this repository"]').eq(0).text().trim();
            const fork = $('.social-count[aria-label$="forked this repository"]').eq(0).text().trim();
            description = `[${watch}/${star}/${fork}] ` + description.replace(/\s+Contribute to .*? on GitHub\.$/, '').replace(repo, '').replace(/ - $/, '');
          } else if (uri.match(/majorgeeks.com\/mg\/getmirror/)) {
            description = $('.geekyinsidecontent').eq(0).text();
          } else if (uri.match(/nirsoft.net/)) {
            const matched = res.body.replace(/[\r\n]+/g, ' ').match(/<h4 class="utilsubject">Description<\/h4>(.*?)<.*?>/);
            description = matched ? matched[1] : '';
          } else if (uri.match(/abelssoft.de/)) {
            description = description.replace(/(✓|✔).*/, '');
          } else if (uri.match(/chocolatey.org/)) {
            description = $('#description').eq(0).text();
          }
          if (description) {
            description = description.trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
            const maxLength = 200;
            if (description.length > maxLength) {
              description = description.split('').reverse().join('');
              while (description.match(/^.*?[A-Z]\s([.?!])|^..*?([。？！])/) && description.length > maxLength) {
                description = description.replace(/^.*?[A-Z]\s([.?!])|^..*?([。？！])/, '$1$2');
              }
              description = description.split('').reverse().join('');
              if (description.length > maxLength) description = description.substr(0, maxLength);
            }
            database[name] = description;
          }
        } else {
          console.error(`Error:\t${res.statusCode} ${res.statusMessage}`);
        }
        fse.writeJSONSync('./software.json', database, { spaces: 2 });
      }
      if (name in database) softwareThis += ' ' + database[name];

      if (!info.download && !info.site) {
        softwareWithoutDownload += `${orderForWithoutDownload + 1}. `;
        softwareWithoutDownload += `[${name}](${filePre}/${src})`;
        softwareWithoutDownload += '\n';
        orderForWithoutDownload++;
      } else if (!info.install) {
        softwareWithoutInstaller += `${orderForWithoutInstaller + 1}. `;
        softwareWithoutInstaller += `[${name}](${filePre}/${src})`;
        if (info.installType) softwareWithoutInstaller += ` ${info.installType}`;
        softwareWithoutInstaller += '\n';
        orderForWithoutInstaller++;
      } else if ((info.install && info.install.toString().split(/[\r\n]+/).length > 3) || info.beforeInstall || info.afterInstall) {
        softwareSpecialInstaller += `${orderForSpecialInstaller + 1}. `;
        softwareSpecialInstaller += `[${name}](${filePre}/${src})`;
        softwareSpecialInstaller += '\n';
        orderForSpecialInstaller++;
      }

      if (info.tags) {
        for (const i of [].concat(info.tags)) {
          if (!(i in softwareTagged)) softwareTagged[i] = [];
          softwareTagged[i].push(softwareThis);
        }
      } else {
        software.push(softwareThis);
      }
    }

    md = md.replace(/{search}/, search);
    md = md.replace(/{software-without-download}/g, softwareWithoutDownload);
    md = md.replace(/{software-without-installer}/g, softwareWithoutInstaller);
    md = md.replace(/{software-special-installer}/g, softwareSpecialInstaller);
    fse.writeFileSync('README.md', md);

    mdEn = mdEn.replace(/{search}/, search);
    mdEn = mdEn.replace(/{software-without-download}/g, softwareWithoutDownload);
    mdEn = mdEn.replace(/{software-without-installer}/g, softwareWithoutInstaller);
    mdEn = mdEn.replace(/{software-special-installer}/g, softwareSpecialInstaller);
    fse.writeFileSync('README_en.md', mdEn);

    const mdSoftware = [
      '<details>',
      '<summary>TOC</summary>',
      '',
      Object.keys(softwareTagged).concat('UnTagged').map(i => `- [${i}](#${i})`).join('\n'),
      '</details>',
      '',
      '---',
      '',
      Object.keys(softwareTagged).map(i => `### ${i}\n<details>\n\n${softwareTagged[i].map((j, index) => `${index + 1}. ${j}`).join('\n')}\n</details>`).join('\n\n'),
      '\n',
      '### UnTagged',
      '<details>',
      '',
      software.map((i, index) => `${index + 1}. ${i}`).join('\n'),
      '</details>'
    ].join('\n');
    fse.writeFileSync('SupportedSoftwares.md', mdSoftware);
  });
  program.command('list').description('sort and list softwares').action(async () => {
    const databaseNew = {};
    let sortable = [];
    Object.keys(database).forEach(i => {
      sortable.push([i, database[i]]);
    });
    sortable = sortable.sort((a, b) => {
      if ('lastupdatetime' in a[1] && 'lastupdatetime' in b[1]) {
        return new Date(b[1].lastupdatetime).getTime() - new Date(a[1].lastupdatetime).getTime();
      } else if ('lastupdatetime' in a[1]) {
        return -1;
      } else if ('lastupdatetime' in b[1]) {
        return 1;
      } else {
        return new Date(b[1].lasttime).getTime() - new Date(a[1].lasttime).getTime();
      }
    });
    sortable.forEach(i => {
      databaseNew[i[0]] = i[1];
    });
    console.log(Object.keys(databaseNew).map(i => `${i}: ${databaseNew[i].version}`).join('\n'));
    fse.writeFileSync(databaseFile, JSON.stringify(databaseNew, null, 2));
  });
  program.command('search <keyword>').description('search software').action(async (keyword) => {
    let result = [];

    let list = [].concat(_.search).filter(i => fse.existsSync(path.join('./js/search', i + '.js')));
    if (!list.length) list = fse.readdirSync('./js/search');

    for (const i of list) {
      console.log(`Searching:\t${i}`);
      const tmp = await require('./js/search/' + i)(fns, keyword);
      result = result.concat(tmp);
    }

    let html = '<html><head><title>Search For ' + keyword + '</title><style>table{border-collapse:collapse}table,th,td{border:1px solid black}</style><script src="https://cdn.bootcss.com/vanilla-lazyload/10.20.0/lazyload.min.js"></script></head><body><table><thead><tr><th></th><th>Name-Version</th><th>Image</th><th>Description</th></tr></thead><tbody>';
    for (let i = 0; i < result.length; i++) {
      const item = result[i];
      html += `<tr><td>${i + 1}</td><td><a href="${item.url}" target="_blank">${item.name}</a> ${item.version}</td><td><img class="lazy" data-src="${item.image}" /></td><td>${item.description}</td></tr>`;
    }
    html += '</tbody></table><script>new LazyLoad({elements_selector: ".lazy"});</script></body></html>';
    fse.writeFileSync('./search.html', html);
    cp.execSync('start "" "./search.html"');

    let answer = -1;
    while (true) {
      answer = readlineSync.questionInt(`[0-${result.length}] (0=Exit):`);
      if (answer < 0 || answer > result.length) {
      } else if (answer === 0) {
        fse.unlinkSync('./search.html');
        break;
      } else {
        const selected = result[answer - 1];
        if (!fse.existsSync('generate')) fse.mkdirSync('generate');
        const filepath = path.resolve('./generate/', selected.name + '.js');
        fse.writeFileSync(filepath, selected.text);
        console.log(`Notice:\tFile Generated "${filepath}", move it to "software" manually`);
      }
    }
  });
  program.command('run [softwares...]', { isDefault: true })
    .addOption(new commander.Option('-m, --mode [mode]', 'mode').default('default').choices(['default', 'check', 'backup', 'install', 'test', 'test-download', 'test-install']))
    .option('-f, --filter [keyword]', 'filter with RegExp')
    .action(async (softwares, cmdObj) => {
      mode = cmdObj.mode;
      if (mode === 'default' && (softwares.length || cmdObj.filter)) mode = 'filter';

      // 过滤软件
      const softwareAllList = ['test', 'test-download', 'test-install'].includes(mode) ? Object.keys(softwareAll) : Object.keys(_.software);
      let softwareList = [];
      if (softwares.length) softwareList.push(...softwares.filter(i => softwareAllList.includes(i)));
      if (cmdObj.filter) softwareList.push(...softwareAllList.filter(i => i.match(new RegExp(cmdObj.filter, 'i'))));
      if (!(softwares.length || cmdObj.filter) && softwareList.length === 0) softwareList = softwareAllList;
      for (const i of softwareList) software[i] = softwareAll[i];

      if (!fse.existsSync(_.archivePath)) fse.mkdirsSync(_.archivePath);
      if (['default', 'filter'].includes(mode) && (_.mode === 3 || _.commercialMode === 3 || Object.values(_.specialMode).some(i => i === 3)) && !_.ignoreWarn.mode3 && !readlineSync.keyInYNStrict('There are some configuration or profile of softwares may be removed if there are new version.\nMake sure you know mode 3 at your own risk.\nDo you want to continue?')) return;

      for (const i in software) {
        doBeforeExit();

        fns.info = software[i];

        const iEscaped = i.replace(/[:*?"<>|]/g, '-');

        if (software[i].url && software[i].version) {
          // go-on
        } else if (software[i].site && Object.keys(software[i].site).length) {
          // go-on
        } else {
          console.error(`Error:\tNo Enough Info "${path.join(__dirname, 'software', software[i].file)}"`);
          continue;
        }

        if (software[i].commercial === 1) software[i].commercial = _.freePersion;
        if (software[i].commercial === 2) software[i].commercial = _.freemium;

        if (['test', 'test-download', 'test-install', 'check'].includes(mode)) {
          // go-on
        } else if (_.specialMode[i] === -1) {
          continue;
        } else if (_.specialMode[i] === undefined && (!software[i].commercial && _.mode === -1)) {
          continue;
        } else if (_.specialMode[i] === undefined && (software[i].commercial && _.commercialMode === -1)) {
          continue;
        }

        // 扩展为标准格式
        software[i] = ExtendSoftware(software[i]);

        if (software[i].fixedPath instanceof Array) {
          const pathes = software[i].fixedPath;
          let folder = getPath(pathes[0]);
          for (let o = 1; o < pathes.length; o++) {
            if (!fse.existsSync(folder) || !fse.statSync(folder).isDirectory()) break;

            if (typeof pathes[o] === 'string') {
              folder = path.resolve(folder, pathes[o]);
              continue;
            }

            let files = fse.readdirSync(folder);
            if (pathes[o] instanceof RegExp) {
              files = files.filter(i => i.match(pathes[o]));
            } else {
              break;
            }

            if (o === pathes.length - 1) {
              files = files.filter(i => fse.statSync(path.resolve(folder, i)).isFile());
            } else {
              files = files.filter(i => fse.statSync(path.resolve(folder, i)).isDirectory());
            }
            if (files.length === 0) break;
            folder = path.resolve(folder, files[0]);
          }
          software[i].fixedPath = folder;
        }

        if (!(i in database)) database[i] = {};
        if (['test-install'].includes(mode) && !_.software[i]) {
          _.software[i] = path.resolve(_.rootPath, iEscaped, software[i].preferPath || path.basename(iEscaped) + '.exe');
        }
        _.software[i] = (software[i].fixedPath || _.software[i]) ? getPath(software[i].fixedPath || _.software[i]) : '';
        let iPath = path.resolve(_.rootPath, _.software[i]);
        if (iPath.match(/\|/)) {
          software[i].parentPath = iPath.split(/\|/)[0];
          iPath = iPath.replace(/\|/g, '\\');
        } else {
          let parentPath = path.dirname(iPath);
          while (parentPath.toLowerCase().split(/[/\\]+/).includes('bin')) {
            parentPath = path.parse(parentPath).dir;
          }
          software[i].parentPath = parentPath;
        }
        software[i].path = iPath;

        if (_.openInstaller && !software[i].install) {
          software[i].install = info => {
            console.log(`Install-Path:\t${info.parentPath}`);
            return info.fns.install.cli(info, null, [], { wait: true });
          };
        }

        const isModeDefault = mode === 'default';
        const isUpdateRecently = (new Date().getTime() - new Date(database[i].lasttime || 0).getTime() < _.checkInterval * 24 * 60 * 60 * 1000);
        const fileExists = fse.existsSync(iPath);
        if (isModeDefault && isUpdateRecently && fileExists) continue;

        process.title = i;

        let version;
        const versionLocal = await getVersion(iPath);
        if (['test', 'test-download', 'test-install', 'check', 'backup'].includes(mode) || !fse.existsSync(iPath)) {
          version = null;
        } else if ('version' in database[i]) {
          if (database[i].md5 === getHash(iPath, 'md5')) {
            version = database[i].version;
          } else {
            version = versionLocal;
          }
          // version = versionMax(database[i].version, versionLocal) ? database[i].version : versionLocal
        } else {
          version = versionLocal;
        }

        console.log('\n- - - - - - - - - - -\n');
        console.log(`Software:\t${i}`);
        if (['test', 'test-download', 'test-install'].includes(mode) || _.debug) console.log(`File:\t${path.join(__dirname, 'software', software[i].file)}`);
        console.log(`Location:\t${iPath}`);
        console.log(`Version:\t${version}`);

        // install mode
        if (['install'].includes(mode) && 'install' in software[i]) {
          if (fse.existsSync(iPath) && !versionMax(database[i].version, versionLocal)) continue;
          const name = `${iEscaped}-${database[i].version}`;
          const filter = fse.readdirSync(_.archivePath).filter(j => path.parse(j).name === name);
          if (filter.length === 0) {
            console.error(`Error:\tOutput "${name}" is not found`);
            continue;
          }
          const output = path.resolve(_.archivePath, filter[0]);
          await installLatestVersion(i, output);
          continue;
        }

        // check version
        software[i].retry = 0;
        const siteList = 'site' in software[i] ? Object.keys(software[i].site) : [];
        let siteNow;
        let result;
        result = software[i].url ? await getLatestVersion(i) : null;
        while (!result && siteList.length) {
          if (siteList.indexOf(siteNow) + 1 === siteList.length) {
            break;
          } else {
            siteNow = siteList[siteList.indexOf(siteNow) + 1];
            software[i].url = software[i].site[siteNow];

            let info = require('./templates/' + siteNow);
            if (info.url && typeof info.url === 'function') software[i].url = await info.url(software[i].url);
            info = ExtendSoftware(info);
            const preserve = ['useProxy', 'withoutHeader', 'version', 'changelog'];
            for (const key of preserve) {
              software[i][key] = info[key] || software[i][key];
            }
            if (info.download && (!software[i].download || !software[i].download.plain)) software[i].download = info.download;
            console.log(`Site:\t${siteNow}`);
            result = await getLatestVersion(i);
          }
        }
        if (!result) continue;
        const { version: versionLatest, res, $ } = result;

        database[i].lasttime = getNow();
        console.log(`Latest-Version:\t${versionLatest}`);
        process.title = `${i}-v${versionLatest}`;

        if (['check'].includes(mode)) {
          database[i].md5 = getHash(iPath, 'md5');
          database[i].version = versionLatest;
          continue;
        } else if (version === null || versionMax(versionLatest, version)) { // new version
          replace.init({
            version: versionLatest
          });
        } else { // no new version
          if (_.saveVersion) {
            database[i].md5 = getHash(iPath, 'md5');
            database[i].version = versionLatest;
          }
          continue;
        }

        if (software[i].changelog) {
          const changelog = await getLatestVersionChangelog(i, versionLatest, res, $);
          if (changelog && typeof changelog === 'string') console.log(`Changelog:\t${changelog.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim()}`);
        }

        if (['default', 'filter'].includes(mode)) {
          notifier.notify({
            title: `Software:\t${i}`,
            message: `Latest Version:\t${versionLatest}`,
            open: software[i].url,
            timeout: 3
          });
        }

        if (['default', 'filter'].includes(mode) && !_.preserveOldArchive) {
          const name = iEscaped;
          const files = walk(_.archivePath, { fullpath: false }).filter(raw => {
            let fileName = raw.replace(/\\/g, '/');
            while (exts.concat(exts2, '.json').includes(path.extname(fileName))) {
              fileName = path.parse(fileName).dir ? path.parse(fileName).dir + '/' + path.parse(fileName).name : path.parse(fileName).name;
            }
            if (database[i] && versionLatest !== database[i].version && fileName === name + '-' + database[i].version) { // 之前记录的版本
              const file = path.resolve(_.archivePath, raw);
              fse.removeSync(file);
              console.warn(`Removed:\t${file}`);
              return false;
            }
            return fileName.indexOf(name) === 0 && fileName.includes(name + '-') && fileName !== name + '-' + versionLatest;
          });
          for (let file of files) {
            file = path.resolve(_.archivePath, file);
            if (readlineSync.keyInYNStrict(`Delete:\t${file}`)) fse.removeSync(file);
          }
        }

        if (_.specialMode[i] > 0 && 'download' in software[i]) {
          // go-on
        } else if (_.specialMode[i] === undefined && (!software[i].commercial && _.mode > 0) && 'download' in software[i]) {
          // go-on
        } else if (_.specialMode[i] === undefined && (software[i].commercial && _.commercialMode > 0) && 'download' in software[i]) {
          // go-on
        } else if (['test', 'test-download', 'test-install'].includes(mode) && 'download' in software[i]) {
          // go-on
        } else if (['test', 'test-download', 'test-install'].includes(mode) && !('download' in software[i])) {
          continue;
        } else if (['backup'].includes(mode)) {
          continue;
        } else { // open url
          if (software[i].commercial) console.warn('Notice:\tCommercial Software');
          if (readlineSync.keyInYNStrict(`Open:\t${software[i].url}`)) cp.execSync(`start "" "${software[i].url}"`);
          continue;
        }

        // download
        result = await downloadLatestVersion(i, versionLatest, res, $);
        if (!result || ['test-download'].includes(mode)) continue;
        const { output } = result;

        if (_.specialMode[i] >= 2 && 'install' in software[i]) {
          // go-on
        } else if (_.specialMode[i] === undefined && (!software[i].commercial && _.mode >= 2) && 'install' in software[i]) {
          // go-on
        } else if (_.specialMode[i] === undefined && (software[i].commercial && _.commercialMode >= 2) && 'install' in software[i]) {
          // go-on
        } else if (['test-install'].includes(mode) && 'install' in software[i]) {
          // go-on
        } else if (['test-install'].includes(mode) && !('install' in software[i])) {
          continue;
        } else {
          console.warn('Warn:\tYou should install it yourself.');
          if (!_.ignoreWarn.mode1 && readlineSync.keyInYNStrict(`Show:\t${output}`)) cp.execSync(`start "" "explorer" /select,"${output}"`);
          continue;
        }

        // virus check
        let safe;
        if (_.virus.apiKey) {
          safe = await virusCheckFile(output);
        } else if (_.ignoreWarn.withoutVirusScan || readlineSync.keyInYNStrict(`File:\t${output}\nWarn:\tFile is not scaned to check virus\nContinue to install anymore?`)) {
          safe = true;
        }
        if (!safe || typeof safe === 'string') {
          console.error(`Error:\tSkipped "${safe || 'Not Safe'}"`);
          continue;
        }

        // install
        const installed = await installLatestVersion(i, output);
        if (installed) database[i].lastupdatetime = getNow();
        if (installed && _.saveVersion) {
          database[i].md5 = getHash(iPath, 'md5');
          database[i].version = versionLatest;
        }
      }
    });

  await program.parseAsync(process.argv);
};

main().then(result => {
  doBeforeExit();

  if (result) console.log('\n- - - - - - - - - - -\n');
}, (error) => {
  doBeforeExit();

  console.error(error);
  console.log('\n- - - - - - - - - - -\n');
  process.exit();
});
