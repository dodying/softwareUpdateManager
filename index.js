// ==Headers==
// @Name:               softwareUpdateManager
// @Description:        软件更新管理器
// @Version:            1.0.798
// @Author:             dodying
// @Date:               2019-2-16 14:39:34
// @Namespace:          https://github.com/dodying/Nodejs
// @SupportURL:         https://github.com/dodying/Nodejs/issues
// @Require:            cheerio,deepmerge,fs-extra,node-notifier,readline-sync,request-promise,socks5-http-client,socks5-https-client
// ==/Headers==

// 设置
var _ = require('./config')

// 导入原生模块
const path = require('path')
const cp = require('child_process')
const url = require('url')

// 导入第三方模块
const fse = require('fs-extra')
const cheerio = require('cheerio')
const readlineSync = require('readline-sync')
const request = require('request-promise')
const Agent = require('socks5-http-client/lib/Agent')
const Agent2 = require('socks5-https-client/lib/Agent')
const notifier = require('node-notifier')
const merge = require('deepmerge')

// Function
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
}
const _color = {
  log: color.FgGreen,
  warn: color.FgYellow,
  error: color.BgRed

}
let logModify = (colorMsg, args) => {
  return args.map(i => {
    return typeof i === 'string' ? i.split('\n').map(j => {
      if (j.match(/^(.*):\t(.*)$/)) {
        let result = j.match(/^(.*):\t(.*)$/)
        let space = 16 - result[1].length - 1
        if (result[2].match(/^"/)) space = space - 1
        return `${color.FgCyan}${result[1]}${color.Reset}:${' '.repeat(space)}${colorMsg}${result[2]}${color.Reset}`
      } else {
        return `${colorMsg}${j}${color.Reset}`
      }
    }).join('\n') : i
  })
}
let consoleRaw = {}
for (let i of ['log', 'warn', 'error']) {
  consoleRaw[i] = console[i]
  console[i] = (...args) => {
    args.every(i => typeof i === 'string') ? consoleRaw[i](...logModify(_color[i], args)) : consoleRaw[i](...args)
  }
}
for (let i in readlineSync) {
  if (!i.match(/^(question|keyIn)/)) continue
  if ([ 'keyInSelect', 'keyIn', 'question', 'prompt' ].includes(i)) continue
  let raw = readlineSync[i]
  readlineSync[i] = text => raw(logModify(_color.warn, [text]))
}

const walk = require('./js/walk')
const getNow = () => new Date().toLocaleString(_.locale, { hour12: false })
const getVersion = async filepath => {
  if (fse.existsSync(filepath)) {
    let info
    try {
      info = await new Promise(resolve => {
        cp.exec(`wmic DATAFILE where name="${filepath.replace(/[/\\]/g, '\\\\')}" get version`, (err, stdout, stderr) => {
          if (err) {
            resolve('0')
          } else {
            resolve(stdout)
          }
        })
      })
      if (info.match(/Version\s+([\d.]+)/)) return info.match(/Version\s+([\d.]+)/)[1]
    } catch (error) {
    }
  }
  return '0'
}
const spawnSync = (...argsForSpwan) => {
  return new Promise(resolve => {
    let child = cp.spawn(...argsForSpwan)
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    child.on('exit', function (code) {
      let end
      if (code.toString() !== '0') {
        end = 'error'
        console.error(`Command:\t${argsForSpwan[0]}\nCommand Args:${argsForSpwan[1].map(i => `{${i}}`).join(', ')}\nExit Code:\t${code.toString()}`)
      } else {
        end = true
      }
      resolve(end)
    })
  })
}
const versionMax = (v1, v2) => {
  let arr1 = v1.split(/[.\-_]+/)
  let arr2 = v2.split(/[.\-_]+/)
  let length = Math.min(arr1.length, arr2.length)
  for (let i = 0; i < length; i++) {
    let str1 = arr1[i]
    let str2 = arr2[i]
    let float1 = parseFloat(str1)
    let float2 = parseFloat(str2)
    if (isNaN(float1) || isNaN(float2)) {
      if (str1 > str2) {
        return true
      } else if (str1 < str2) {
        return false
      }
    } else {
      if (float1 > float2) {
        return true
      } else if (float1 < float2) {
        return false
      }
    }
  }
  return arr1.length > arr2.length
}

// Main
let args = process.argv.splice(2)
let databaseFile = './database.json'
if (args.length && args.filter(i => i.match(/^-profile=/)).length) {
  let arg = args.filter(i => i.match(/^-profile=/))[0]
  let profile = arg.match(/^-profile=(.*)$/)[1]
  databaseFile = `./database-${profile}.json`
  if (!(profile in _.profile) || Object.keys(_.profile[profile]).length === 0) {
    console.error(`Error:\tNo Profile ${profile}`)
    process.exit()
  }
  _ = _.profile[profile].deepmerge ? merge(_, _.profile[profile]) : Object.assign(_, _.profile[profile])
  delete _.profile
  args.splice(args.indexOf(arg), 1)
}
_.archivePath = path.resolve(__dirname, _.archivePath)
let database
try {
  database = fse.existsSync(databaseFile) ? JSON.parse(fse.readFileSync(databaseFile, 'utf-8')) : {}
} catch (error) {
  database = {}
}
let mode = -1
var software = {}
let softwareFilter
if (args.length) {
  if (args.includes('-help')) {
    console.warn('node index -help')
    console.warn('node index -makemd')
    console.warn('node index [-profile=name] -list')
    console.warn('node index [-quiet-mode] [-profile=name] [-filter filter_with_comma ] [ -test | -onlycheck | -backup | -install ]')
    console.warn('node index [-quiet-mode] [-profile=name] [ -test | -onlycheck | -backup | -install ] [software_name]')
    process.exit()
  } else if (args.includes('-list')) {
    let databaseNew = {}
    let sortable = []
    Object.keys(database).forEach(i => {
      sortable.push([i, database[i]])
    })
    sortable = sortable.sort((a, b) => {
      if ('lastupdatetime' in a[1] && 'lastupdatetime' in b[1]) {
        return new Date(b[1].lastupdatetime).getTime() - new Date(a[1].lastupdatetime).getTime()
      } else if ('lastupdatetime' in a[1]) {
        return -1
      } else if ('lastupdatetime' in b[1]) {
        return 1
      } else {
        return new Date(b[1].lasttime).getTime() - new Date(a[1].lasttime).getTime()
      }
    })
    sortable.forEach(i => {
      databaseNew[i[0]] = i[1]
    })
    console.log(databaseNew)
    fse.writeFileSync(databaseFile, JSON.stringify(databaseNew, null, 2))
    process.exit()
  } else if (args.includes('-makemd')) {
    let md = fse.readFileSync('README_RAW.md', 'utf-8')
    let example = fse.readFileSync('./software/Telegram.js', 'utf-8')
    let software = ''

    let orderForWithoutDownload = 0
    let softwareWithoutDownload = ''

    let orderForWithoutInstaller = 0
    let softwareWithoutInstaller = ''

    let orderForSpecialInstaller = 0
    let softwareSpecialInstaller = ''

    // let list = fse.readdirSync('software')
    let list = walk('software').map(i => i.split(/[\\/]/).splice(1).join('/'))
    for (let i = 0; i < list.length; i++) {
      if (path.parse(list[i]).dir === 'Invalid') continue
      if (fse.statSync(path.resolve('software', list[i])).isFile()) {
        let info = require(path.resolve('software', list[i]))
        let name = list[i].replace(/\.js$/, '')
        let src = encodeURI(list[i])

        software += `${i + 1}. `
        software += `[${name}](${info.url})`
        // if (info.url.match('/github.com/')) {
        //   let match = info.url.match(/\/github.com\/(.*?)\/(.*?)\//)
        //   software += `![](https://ghbtns.com/github-btn.html?user=${match[1]}&repo=${match[2]}&type=star&count=true&size=large)`
        // }
        if (info.commercial === true || info.commercial === 3) software += ' :money_with_wings:'
        if (info.commercial === 2) software += ' [Free Personal]'
        if (info.commercial === 1) software += ' [Freemium]'
        if (info.useProxy) software += ' :airplane:'
        if (!info.install) software += ' :hand:'
        software += '\n'

        if (!info.download) {
          softwareWithoutDownload += `${orderForWithoutDownload + 1}. `
          softwareWithoutDownload += `[${name}](software/${src})`
          softwareWithoutDownload += '\n'
          orderForWithoutDownload++
        } else if (!info.install) {
          softwareWithoutInstaller += `${orderForWithoutInstaller + 1}. `
          softwareWithoutInstaller += `[${name}](software/${src})`
          softwareWithoutInstaller += '\n'
          orderForWithoutInstaller++
        } else if (info.install && info.install.toString().split(/[\r\n]+/).length > 3) {
          softwareSpecialInstaller += `${orderForSpecialInstaller + 1}. `
          softwareSpecialInstaller += `[${name}](software/${src})`
          softwareSpecialInstaller += '\n'
          orderForSpecialInstaller++
        }
      }
    }
    md = md.replace(/{example}/, example)
    md = md.replace(/{software}/g, software)
    md = md.replace(/{software-without-download}/g, softwareWithoutDownload)
    md = md.replace(/{software-without-installer}/g, softwareWithoutInstaller)
    md = md.replace(/{software-special-installer}/g, softwareSpecialInstaller)
    fse.writeFileSync('README.md', md)
    process.exit()
  } else if (args.includes('-search')) {
    let index = args.indexOf('-search')
    let keyword = args[index + 1]
    args = keyword
    if (!keyword) {
      console.error('Error:\tPlease put in your keyword')
      process.exit()
    }

    mode = -3
    softwareFilter = () => false
  }

  if (args.includes('-quiet-mode')) {
    args.splice(args.indexOf('-quiet-mode'), 1)
    readlineSync.keyInPause = query => console.warn(`${query} ${color.Reset}(Hit any key)`)
    readlineSync.keyInSelect = (list, query) => {
      console.log()
      list.forEach((i, j) => console.warn(`[${j + 1}] ${i}`))
      console.warn(`[0] CANCEL`)
      console.log()
      console.warn(`${query} [${list.map((i, j) => j + 1).join(', ')}, 0]: ${color.Reset}1`)
      return 0
    }
    readlineSync.keyInYN = query => console.warn(`${query} ${color.Reset}[y/n]: n`) || false
    readlineSync.keyInYNStrict = query => console.warn(`${query} ${color.Reset}[y/n]: n`) || false
  }

  if (args.includes('-filter')) {
    mode = 0
    let index = args.indexOf('-filter')
    let re = args[index + 1] ? new RegExp((args[index + 1]).replace(/,/g, '|'), 'gi') : ''
    args.splice(args.indexOf('-filter'), 2)
    softwareFilter = software => software.match(re)
  }

  if (args.includes('-onlycheck')) {
    mode = 1
    args.splice(args.indexOf('-onlycheck'), 1)
  } else if (args.includes('-backup')) {
    mode = 2
    args.splice(args.indexOf('-backup'), 1)
  } else if (args.includes('-install')) {
    mode = 3
    args.splice(args.indexOf('-install'), 1)
  } else if (args.includes('-test')) {
    mode = -2
    args.splice(args.indexOf('-test'), 1)
  }
}

if (!softwareFilter) {
  if (args.length === 0) {
    softwareFilter = () => true
  } else {
    softwareFilter = software => args.includes(software)
  }
}

let softwareList = mode === -2 ? walk('software').filter(i => !i.match('Invalid') && fse.statSync(i).isFile() && path.parse(i).ext === '.js').map(i => i.split(/[\\/]/).splice(1).join('/').replace(/\.js$/, '')) : Object.keys(_.software)

softwareList.forEach(i => {
  let match = i.match(/^(.*):(.*)$/)
  let raw, version
  if (match) [, raw, version] = match

  if (softwareFilter(i)) {
    if (fse.existsSync(`./software/${match ? raw : i}.js`)) {
      if (match) {
        software[i] = require(`./software/${raw}.js`)
        if (software[i].other[version]) {
          software[i] = merge(software[i], software[i].other[version])
        } else {
          console.error(`Software:\t${i}\nError:\tNo Version named "${version}"`)
          delete software[i]
        }
      } else {
        software[i] = require(`./software/${i}.js`)
      }
    } else {
      console.error(`Software:\t${i}\nError:\tNo this js in folder "software"`)
    }
  }
})

var cookies = request.jar()

let req = (url, useProxy = false, option = {}) => {
  if (typeof useProxy === 'object') [useProxy, option] = [false, useProxy]
  let requestOption = Object.assign({
    method: 'GET',
    uri: url,
    headers: {
      'User-Agent': _.userAgent
    },
    timeout: _.request.timeout * 1000,
    jar: cookies,
    strictSSL: false,
    resolveWithFullResponse: true,
    simple: false
  }, option)
  if ((_.urlWithProxy.some(urlfilter => url.match(urlfilter)) || _.useProxy === 2 || (_.useProxy === 1 && useProxy)) && !(_.urlWithoutProxy.some(urlfilter => url.match(urlfilter)))) {
    if (_.request.proxySocks) {
      requestOption.agentClass = url.match(/^http:/) ? Agent : Agent2
      requestOption.agentOptions = {
        socksHost: _.request.proxySocksHost || 'localhost',
        socksPort: _.request.proxySocksPort
      }
      if (_.request.proxySocksUsername && _.request.proxySocksPassword) {
        requestOption.agentOptions.socksUsername = _.request.proxySocksUsername
        requestOption.agentOptions.socksPassword = _.request.proxySocksPassword
      }
    } else if (_.request.proxyHTTP) {
      requestOption.proxy = _.request.proxyHTTP
    }
  }
  return request(requestOption)
}

let doBeforeExit = () => {
  if (_.debug) {
    let cookiesRaw = fse.existsSync('cookies.json') ? fse.readJSONSync('cookies.json') : {}
    let cookiesNew = JSON.parse(JSON.stringify(cookies))._jar.cookies
    cookiesNew = cookiesNew.concat(cookiesRaw).filter((item, index, array) => array.indexOf(array.filter(item2 => item2.key === item.key && item2.domain === item.domain && item2.path === item.path)[0]) === index)
    fse.writeJSONSync('cookies.json', cookiesNew, { spaces: 2 })
  } else {
    cookies = request.jar()
  }
  if (fse.existsSync('cookies.txt')) fse.removeSync('cookies.txt')
  if ([-1, 0, 1, 3].includes(mode)) fse.writeFileSync(databaseFile, JSON.stringify(database, null, 2))
  fse.removeSync(path.resolve(_.archivePath, 'unzip'))
  fse.emptyDirSync('./unzip')
}

let getLatestVersion = async (i) => {
  let iEscaped = i.replace(/[:*?"<>|]/g, '-')

  software[i].retry = software[i].retry ? software[i].retry + 1 : 1
  let res
  try {
    res = await req(software[i].url, software[i].useProxy)
  } catch (error) { // get latest version error
    console.error(`Try ${software[i].retry}:\t${error.message}`)
  }
  let returnValue
  if (res && (res.statusMessage === 'OK' || res.statusCode === 200)) {
    returnValue = await (async function () {
      let $ = cheerio.load(res.body)
      if (_.debug) {
        let parentPath = path.parse(`html/${iEscaped}.html`).dir
        if (!fse.existsSync(parentPath)) fse.mkdirsSync(parentPath)
        fse.writeFileSync(`html/${iEscaped}.html`, res.body)
        fse.writeJsonSync(`html/${iEscaped}.json`, res, {
          spaces: 2,
          replacer: function replacer (key, value) {
            if (key === 'body') return undefined
            return value
          }
        })
      }

      let version
      if ('selector' in software[i].version) {
        version = $(software[i].version.selector)
        if (version.length === 0) {
          console.error(`Error:\tCan't get the element when get version\nSelector:\t${software[i].version.selector}`)
          return null
        }

        version = version.eq(0)
        if (!('attr' in software[i].version)) software[i].version.attr = 'text'
        version = software[i].version.attr === 'text' ? version.text() : software[i].version.attr === 'html' ? version.html() : version.attr(software[i].version.attr)
        version = version.trim()
        if (version === '') {
          console.error(`Error:\tThe attribute of the element is empty when get version`)
          return null
        }
        let regexp = software[i].version.match || /(\d+[\d.]+\d+)/
        version = version.match(regexp)
        if (!version) {
          console.error(`Error:\tCan't match the RegExp of the Text when get version\nText:\t${version}\nRegExp:\t${regexp}`)
          return null
        }

        version = version.length > 1 ? version[1] : version[0]
      } else if ('func' in software[i].version) {
        try {
          version = await software[i].version.func(res, $, req, cheerio, software[i].versionChoice)
          if (!version) {
            console.error(`Error:\t"func" return nothing when get version`)
            return null
          }
        } catch (error) {
          return null
        }
      } else {
        console.error(`Error:\tNo "selector"/"func" in "version"`)
        return null
      }
      return { version, res, $ }
    })()
  }

  if (returnValue) {
    return returnValue
  } else if (returnValue === null) {
    return null
  } else if (_.request.retry > software[i].retry) {
    if (_.request.proxyHTTP || _.request.proxySocks) software[i].useProxy = true
    return getLatestVersion(i)
  } else {
    return null
  }
}

let downloadLatestVersion = async (i, versionLatest, res, $) => {
  let iEscaped = i.replace(/[:*?"<>|]/g, '-')
  let download

  if ('plain' in software[i].download) { // download url is regular
    let variables = {
      version: versionLatest
    }
    let str = software[i].download.plain
    let re = /{(.*?)}/g
    let result = re.exec(str)
    while (result) {
      if (!(result[1] in variables)) {
        console.error(`Error:\tvariables "${result[1]}" is not defined`)
        process.exit(1)
      }
      str = str.replace(result[0], variables[result[1]])
      result = re.exec(str)
    }
    download = str
  } else if ('selector' in software[i].download) { // can get download from html
    download = $(software[i].download.selector)
    if (download.length === 0) {
      console.error(`Error:\tCan't get the element when get download url\nSelector:\t${software[i].download.selector}`)
      return null
    }

    download = download.eq(0)
    if (!('attr' in software[i].download)) software[i].download.attr = 'href'
    download = software[i].download.attr === 'text' ? download.text() : software[i].download.attr === 'html' ? download.html() : download.attr(software[i].download.attr)
    if (!download || download.trim() === '') {
      console.error(`Error:\tThe attribute of the element is empty when get download url`)
      return null
    }

    download = software[i].download.match ? download.match(software[i].download.match)[1] : download
  } else if ('func' in software[i].download) {
    try {
      download = await software[i].download.func(res, $, req, cheerio, software[i].downloadChoice)
      if (!download) {
        console.error(`Error:\t"func" return nothing when get download`)
        return null
      }
    } catch (error) {
      return null
    }
  } else {
    console.error(`Error:\tNo "plain"/"selector"/"func" in "download"`)
    return null
  }

  download = url.resolve(res.request.href, download)
  let ext = software[i].download.output
  if (!ext) {
    let temp = download.replace(/\/(download|file)$/, '')
    if (temp.match(/(\.[\d\w]+)$/)) {
      ext = temp.match(/(\.[\d\w]+)$/)[1]
      if (ext === '.gz') ext = temp.match(/(\.[\d\w]+.gz)$/)[1]
    } else if (new URL(download).pathname.match(/(\.[\d\w]+)$/)) {
      ext = new URL(download).pathname.match(/(\.[\d\w]+)$/)[1]
    } else {
      console.error(`Error:\tCan't get Extension name, please set "output" in "download"`)
      return null
    }
  }
  if (url.parse(download).host === 'sourceforge.net' && download.match(/\/download$/) && _.download.sfMirror) download = download + '?use_mirror=' + _.download.sfMirror
  let output = iEscaped + '-' + versionLatest + (ext)
  output = path.resolve(_.archivePath, output)
  console.log(`Download:\t${download}`)
  console.log(`Output:\t${output}`)
  console.log('')

  fse.writeFileSync('cookies.txt', JSON.parse(JSON.stringify(cookies))._jar.cookies.map(i => [`.${i.domain}`, i.hostOnly ? 'TRUE' : 'FALSE', i.path, i.secure ? 'TRUE' : 'FALSE', i.expires ? Math.round(new Date(i.expires).getTime() / 1000) : '0', i.key, i.value].join('\t')).join('\r\n'))

  if ([-2].includes(mode)) return null
  let args = []
  let end

  _.download.urlWithoutHeader = [].concat(_.download.urlWithoutHeader, 'sourceforge.net', 'osdn.net', 'mediafire.com')

  if (_.download.method === 'aria2c') {
    if (_.download.continue) args.push('--continue')
    if (_.download.quiet) args.push('--quiet')
    if (_.download.retry) args.push('--max-tries=' + _.download.retry, '--retry-wait=5')
    if (_.download.timeout) args.push('--timeout=' + _.download.timeout)
    if (!(_.download.urlWithoutHeader.some(urlfilter => download.match(urlfilter))) && !software[i].withoutHeader) {
      args.push('--user-agent=' + _.userAgent)
      args.push('--referer=' + software[i].url)
    }
    if (_.download.proxy && (_.urlWithProxy.some(urlfilter => download.match(urlfilter)) || _.useProxy === 2 || (_.useProxy === 1 && software[i].useProxy)) && !(_.urlWithoutProxy.some(urlfilter => download.match(urlfilter)))) {
      args.push(`--all-proxy=${_.download.proxy}`)
    }
    args.push('--remote-time') // Retrieve timestamp of the remote file from the remote HTTP/FTP server and if it is available, apply it to the local file.
    args.push('--load-cookies=cookies.txt') // Load Cookies from FILE
    args.push('--auto-file-renaming=false') // Rename file name if the same file already exists.
    args.push('--allow-overwrite=true') // Restart download from scratch if the corresponding control file doesn’t exist.
    args.push('--check-certificate=false') // Verify the peer using certificates
    args.push('--file-allocation=none') // Specify file allocation method.
    args.push('--min-split-size=1M') // aria2 does not split less than 2*SIZE byte range.
    args.push('--max-connection-per-server=16') // The maximum number of connections to one server for each download.
    args.push('--split=16') // Download a file using N connections.
    args.push('--out=' + path.relative('', output), download)
    end = await spawnSync(`plugins\\aria2c.exe`, args)
  } else if (_.download.method === 'wget') {
    if (_.download.continue) args.push('--continue')
    if (_.download.quiet) args.push('--quiet')
    if (_.download.retry) args.push('--tries=' + _.download.retry, '--waitretry=5')
    if (_.download.timeout) args.push('--timeout=' + _.download.timeout)
    if (!(_.download.urlWithoutHeader.some(urlfilter => download.match(urlfilter))) && !software[i].withoutHeader) {
      args.push('--user-agent=' + _.userAgent)
      args.push(`--referer=${software[i].url}`)
    }
    if (_.download.proxy && (_.urlWithProxy.some(urlfilter => download.match(urlfilter)) || _.useProxy === 2 || (_.useProxy === 1 && software[i].useProxy)) && !(_.urlWithoutProxy.some(urlfilter => download.match(urlfilter)))) {
      args.push('-e', 'use_proxy=yes')
      args.push('-e', `http_proxy=${_.download.proxy}`)
      args.push('-e', `https_proxy=${_.download.proxy}`)
      args.push()
    }
    args.push('--load-cookies=cookies.txt') // load cookies from FILE before session
    args.push('--no-check-certificate') // don't validate the server's certificate
    args.push('--output-document=' + output, download)
    end = await spawnSync(`plugins\\wget.exe`, args)
  } else if (_.download.method === 'curl') {
    if (_.download.continue) args.push('-C')
    if (_.download.quiet) args.push('--silent')
    if (_.download.retry) args.push('--retry', _.download.retry, '--retry-delay', '5')
    if (_.download.timeout) args.push('--max-time', _.download.timeout)
    if (!(_.download.urlWithoutHeader.some(urlfilter => download.match(urlfilter))) && !software[i].withoutHeader) {
      args.push('--user-agent', _.userAgent)
      args.push('--referer', software[i].url)
    }
    if (_.download.proxy && (_.urlWithProxy.some(urlfilter => download.match(urlfilter)) || _.useProxy === 2 || (_.useProxy === 1 && software[i].useProxy)) && !(_.urlWithoutProxy.some(urlfilter => download.match(urlfilter)))) {
      args.push('--proxy', _.download.proxy)
    }
    args.push('--remote-time') // Set the remote file's time on the local output
    args.push('--cookie', 'cookies.txt') // Send cookies from string/file
    args.push('--location') // Follow redirects
    args.push('--insecure') // Allow insecure server connections when using SSL
    args.push('-', '--output', output, download)
    end = await spawnSync(`plugins\\curl.exe`, args)
  }

  if (end === 'error') {
    console.error(`Software:\t${i}\nError: Download new version Error`)
    if (readlineSync.keyInYNStrict(`Open:\t${download}`)) cp.execSync(`start "" "${download}"`)
    return null
  } else if ([2].includes(mode)) {
    return null
  } else {
    return { output }
  }
}

let installLatestVersion = async (i, output, iPath) => {
  if (!_.ignoreWarn.preferPath && software[i].preferPath && iPath.toLowerCase().substr(-software[i].preferPath.length).replace(/\\/g, '/') !== software[i].preferPath.toLowerCase()) {
    console.warn(`Warn:\tThe path you given don't have preferred\nTarget:\t${iPath}\nPreferPath:\t${software[i].preferPath}`)
    if (!readlineSync.keyInYNStrict('Continue to install?')) return false
  }

  if ('beforeInstall' in software[i]) await software[i].beforeInstall(output, iPath)
  if (_.specialMode[i] === 3 || (!software[i].commercial && _.mode === 3) || (software[i].commercial && _.commercialMode === 3)) {
    if (software[i].install.toString().match(/install_single/)) {
      fse.removeSync(iPath)
    } else {
      fse.removeSync(path.parse(iPath).dir)
    }
  }
  let installed = await software[i].install(output, iPath, software[i].installChoice)
  if (installed) {
    if ('afterInstall' in software[i]) await software[i].afterInstall(output, iPath)
    if (!_.preserveArchive) fse.removeSync(output)
  } else {
    console.error(`Software:\t${i}\nError:\tSkipped\nLocation:\t${output}\nTarget:\t${iPath}`)
  }
  return installed
}

let init = async () => {
  if (mode === -3) {
    let result = []
    let keyword = args

    let list = [].concat(_.search).filter(i => fse.existsSync(path.join('./js/search', i + '.js')))
    if (!list.length) list = fse.readdirSync('./js/search')

    for (let i of list) {
      let tmp = await require('./js/search/' + i + '.js')(req, cheerio, keyword)
      result = result.concat(tmp)
    }

    let html = '<html><head><title>Search For ' + keyword + '</title><style>table{border-collapse:collapse}table,th,td{border:1px solid black}</style><script src="https://cdn.bootcss.com/vanilla-lazyload/10.20.0/lazyload.min.js"></script></head><body><table><thead><tr><th></th><th>Name-Version</th><th>Image</th><th>Description</th></tr></thead><tbody>'
    for (let i = 0; i < result.length; i++) {
      let item = result[i]
      html += `<tr><td>${i + 1}</td><td><a href="${item.url}" target="_blank">${item.name}</a> ${item.version}</td><td><img class="lazy" data-src="${item.image}" /></td><td>${item.description}</td></tr>`
    }
    html += '</tbody></table><script>new LazyLoad({elements_selector: ".lazy"});</script></body></html>'
    fse.writeFileSync('./search.html', html)
    cp.execSync(`start "" "./search.html"`)

    let answer = -1
    while (answer < 0 || answer > result.length) {
      answer = readlineSync.questionInt(`[0-${result.length}] (0=Cancel):`)
    }
    fse.unlinkSync('./search.html')
    if (answer !== 0) {
      let selected = result[answer - 1]
      if (!fse.existsSync('generate')) fse.mkdirSync('generate')
      let filepath = path.resolve('./generate/', selected.name + '.js')
      fse.writeFileSync(filepath, selected.text)
      console.log(`Location:\t${filepath}\nInfo:\tFile Generated, you should move it to "software" manually`)
    }
    process.exit()
  }

  if (!fse.existsSync(_.archivePath)) fse.mkdirsSync(_.archivePath)
  if ([-1, 0].includes(mode) && (_.mode === 3 || _.commercialMode === 3 || Object.values(_.specialMode).some(i => i === 3)) && !_.ignoreWarn.mode3 && !readlineSync.keyInYNStrict('There are some configuration or profile of softwares may be removed if there are new version.\nMake sure you know mode 3 at your own risk.\nDo you want to continue?')) process.exit()

  for (let i in software) {
    doBeforeExit()

    let iEscaped = i.replace(/[:*?"<>|]/g, '-')
    let iRaw = i.match(/(.*):(.*)$/) ? i.match(/(.*):(.*)$/)[1] : i

    if (software[i].url && software[i].version) {
      // go-on
    } else if (software[i].site && Object.keys(software[i].site).length) {
      // go-on
    } else {
      console.error(`File:\t${path.join(__dirname, 'software', iRaw + '.js')}\nError:\tNo Enough Info`)
      continue
    }

    if (software[i].commercial === 1) software[i].commercial = _.freePersion
    if (software[i].commercial === 2) software[i].commercial = _.freemium

    if ([-2, 1].includes(mode)) {
      // go-on
    } else if (_.specialMode[i] === -1) {
      continue
    } else if (_.specialMode[i] === undefined && (!software[i].commercial && _.mode === -1)) {
      continue
    } else if (_.specialMode[i] === undefined && (software[i].commercial && _.commercialMode === -1)) {
      continue
    }

    if (!(i in database)) database[i] = {}
    let iPath = path.resolve(_.rootPath, _.software[i] || '')

    let isModeDefault = [-1].includes(mode) && args.length === 0
    let isUpdateRecently = (new Date().getTime() - new Date(database[i].lasttime || 0).getTime() < _.checkInterval * 24 * 60 * 60 * 1000)
    let fileExists = fse.existsSync(iPath)
    if (isModeDefault && isUpdateRecently && fileExists) continue

    process.title = i

    let version
    let versionLocal = await getVersion(iPath)
    if ([-2, 1, 2].includes(mode) || !fse.existsSync(iPath)) {
      version = null
    } else if ('version' in database[i]) {
      version = versionMax(database[i].version, versionLocal) ? database[i].version : versionLocal
    } else {
      version = versionLocal
    }

    console.log('\n- - - - - - - - - - -\n')
    console.log(`Software:\t${i}`)
    if ([-2].includes(mode) || _.debug) console.log(`File:\t${path.join(__dirname, 'software', iRaw + '.js')}`)
    console.log(`Location:\t${iPath}`)
    console.log(`Version:\t${version}`)
    console.log(`Url:\t${software[i].url}`)

    if ([3].includes(mode) && 'install' in software[i]) {
      if (fse.existsSync(iPath) && !versionMax(database[i].version, versionLocal)) continue
      let name = `${iEscaped}-${database[i].version}`
      let filter = fse.readdirSync(_.archivePath).filter(j => path.parse(j).name === name)
      if (filter.length === 0) {
        console.error(`Output:\t${name}\nError:\tOutput is not found`)
        continue
      }
      let output = path.resolve(_.archivePath, filter[0])
      await installLatestVersion(i, output, iPath)
      continue
    }

    // check version
    let siteList = 'site' in software[i] ? Object.keys(software[i].site) : []
    let siteNow
    let result
    if (!software[i].url && siteList.length) {
      siteNow = Object.keys(software[i].site)[0]
      software[i].url = software[i].site[siteNow]
      console.log(`Site ${siteNow}:\t${software[i].url}`)
      software[i].version = require('./templates/' + siteNow).version
      software[i].download = require('./templates/' + siteNow).download
    }
    result = await getLatestVersion(i)
    while (!result && siteList.length) {
      if (siteList.indexOf(siteNow) + 1 === siteList.length) {
        break
      } else {
        siteNow = siteList[siteList.indexOf(siteNow) + 1]
        software[i].url = software[i].site[siteNow]
        console.log(`Site ${siteNow}:\t${software[i].url}`)
        software[i].version = require('./templates/' + siteNow).version
        software[i].download = require('./templates/' + siteNow).download
        result = await getLatestVersion(i)
      }
    }
    if (!result) continue
    let { version: versionLatest, res, $ } = result

    database[i].lasttime = getNow()
    console.log(`Latest Version:\t${versionLatest}`)

    if ([1].includes(mode)) {
      database[i].version = versionLatest
      continue
    } else if (version === null || versionMax(versionLatest, version)) { // new version
      // go-on
    } else { // no new version
      if (_.saveVersion) database[i].version = versionLatest
      continue
    }

    if ([-1, 0].includes(mode)) {
      notifier.notify({
        title: `Software:\t${i}`,
        message: `Latest Version:\t${versionLatest}`,
        open: software[i].url,
        timeout: 3
      })
    }

    if ([-1, 0].includes(mode) && !_.preserveOldArchive) {
      let name = iEscaped
      let files = fse.readdirSync(_.archivePath).filter(i => {
        let fileName = i.match(/.gz/) ? path.parse(path.parse(i).name).name : path.parse(i).name
        return i.includes(name + '-') && fileName !== name + '-' + versionLatest
      })
      if (files.length === 1 && path.parse(files[0]).name === name + '-' + database[i].version) {
        let file = path.resolve(_.archivePath, files[0])
        fse.removeSync(file)
        console.warn(`Removed:\t${file}`)
      } else {
        for (let file of files) {
          file = path.resolve(_.archivePath, file)
          if (readlineSync.keyInYNStrict(`Delete:\t${file}`)) fse.removeSync(file)
        }
      }
    }

    if (_.specialMode[i] > 0 && 'download' in software[i]) {
      // go-on
    } else if (_.specialMode[i] === undefined && (!software[i].commercial && _.mode > 0) && 'download' in software[i]) {
      // go-on
    } else if (_.specialMode[i] === undefined && (software[i].commercial && _.commercialMode > 0) && 'download' in software[i]) {
      // go-on
    } else if ([-2].includes(mode) && 'download' in software[i]) {
      // go-on
    } else if ([-2].includes(mode) && !('download' in software[i])) {
      continue
    } else if ([2].includes(mode)) {
      continue
    } else { // open url
      if (software[i].commercial) console.warn('Info:\tCommercial Software')
      if (readlineSync.keyInYNStrict(`Open:\t${software[i].url}`)) cp.execSync(`start "" "${software[i].url}"`)
      continue
    }

    // download
    result = await downloadLatestVersion(i, versionLatest, res, $)
    if (!result) continue
    let { output } = result

    if (_.specialMode[i] >= 2 && 'install' in software[i]) {
      // go-on
    } else if (_.specialMode[i] === undefined && (!software[i].commercial && _.mode >= 2) && 'install' in software[i]) {
      // go-on
    } else if (_.specialMode[i] === undefined && (software[i].commercial && _.commercialMode >= 2) && 'install' in software[i]) {
      // go-on
    } else {
      console.warn(`Warn:\tYou should install it yourself.\nTarget:\t${iPath}\nOutput:\t${output}`)
      if (readlineSync.keyInYNStrict(`Show:\t${output}`)) cp.execSync(`start "" "explorer" /select,"${output}"`)
      continue
    }

    // install
    let installed = await installLatestVersion(i, output, iPath)
    if (installed) database[i].lastupdatetime = getNow()
    if (installed && _.saveVersion) database[i].version = versionLatest
  }
}

init().then(() => {
  doBeforeExit()
  console.log('\n- - - - - - - - - - -\n')
}, (err) => {
  doBeforeExit()

  console.log('\n- - - - - - - - - - -\n')
  console.error('Error: ', err.message, '\n ', err.stack.replace(/[\r\n]/g, '{\\n}').match(/{\\n}\s+(at\s+.*)/m)[1].replace(/{\\n}\s+/g, '\n  '))
  process.exit(err)
})
