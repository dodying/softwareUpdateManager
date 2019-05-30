// ==Headers==
// @Name:               softwareUpdateManager
// @Description:        软件更新管理器
// @Version:            1.1.1177
// @Author:             dodying
// @Date:               2019-5-30 11:09:55
// @Namespace:          https://github.com/dodying/Nodejs
// @SupportURL:         https://github.com/dodying/Nodejs/issues
// @Require:            cheerio,deepmerge,fs-extra,node-notifier,readline-sync,request,request-promise,socks5-http-client,socks5-https-client
// ==/Headers==
/* eslint-disable no-control-regex */

// 设置
var _ = require('./config')

// 导入原生模块
const path = require('path')
const cp = require('child_process')
const url = require('url')
const readline = require('readline')

// 导入第三方模块
const fse = require('fs-extra')
const cheerio = require('cheerio')
const readlineSync = require('readline-sync')
const request = require('request')
const requestPromise = require('request-promise')
const Agent = require('socks5-http-client/lib/Agent')
const Agent2 = require('socks5-https-client/lib/Agent')
const notifier = require('node-notifier')
const merge = require('deepmerge')
const walk = require('./js/walk')
const replace = require('./js/replaceWithDict')

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
}
const _color = {
  log: color.FgGreen,
  warn: color.FgYellow,
  error: color.BgRed

}
var consoleRaw = {}
function logModify (colorMsg, msg) {
  return typeof msg === 'string' ? msg.split('\n').map(j => {
    if (j.match(/^(.*):\t(.*)$/)) {
      let result = j.match(/^(.*):\t(.*)$/)
      let space = 16 - result[1].length - 1
      if (result[2].match(/^"/)) space = space - 1
      return `${color.FgCyan}${result[1]}${color.Reset}:${' '.repeat(space)}${colorMsg}${result[2]}${color.Reset}`
    } else {
      return `${colorMsg}${j}${color.Reset}`
    }
  }).join('\n') : msg
}
for (let i of ['log', 'warn', 'error']) {
  consoleRaw[i] = console[i]
  let logFile = path.resolve(__dirname, 'index.log')
  let colorRe = new RegExp('\x1b\\[\\d+m', 'gi')
  let logPip = fse.createWriteStream(logFile, { flags: 'a' })
  console[i] = (...args) => {
    args.forEach(msg => {
      if (typeof msg === 'string') {
        msg = logModify(_color[i], msg)
        consoleRaw[i](msg)
        if (_.debug) logPip.write(msg.replace(colorRe, '') + '\n')
      } else {
        consoleRaw[i](msg)
        if (_.debug) logPip.write(JSON.stringify(msg, null, 2) + '\n')
      }
    })
  }
}
for (let i in readlineSync) {
  if (!i.match(/^(question|keyIn)/)) continue
  if ([ 'keyInSelect', 'keyIn', 'question', 'prompt' ].includes(i)) continue
  let raw = readlineSync[i]
  readlineSync[i] = text => {
    let logFile = path.resolve(__dirname, 'index.log')
    let colorRe = new RegExp('\x1b\\[\\d+m', 'gi')
    let logPip = fse.createWriteStream(logFile, { flags: 'a' })
    let msg = logModify(_color.warn, text)
    if (_.debug) logPip.write(msg.replace(colorRe, '') + '\n')
    return raw(msg)
  }
}

// 全局函数
// 处理config
_.archivePath = path.resolve(__dirname, _.archivePath)
_.download.urlWithoutHeader = [].concat(_.download.urlWithoutHeader, 'sourceforge.net', 'osdn.net', 'mediafire.com')

let exts = ['.zip', '.7z', '.exe', '.msi', '.rar', '.jar', '.tar', '.gz', '.bz2', '.xz', '.iso']
let exts2 = ['.gz', '.bz2', '.xz']

var uriLast; var cookies = request.jar(); var retryList = {}; var proxyList = {}

const releasePage = 'https://github.com/dodying/softwareUpdateManager/releases/tag/plugins'

var args = process.argv.splice(2)
var argAlias = {
  '-p': '--profile',
  '-q': '--quiet',

  '-h': '--help',
  '-md': '--makemd',
  '-l': '--list',
  '-s': '--search',

  '-c': '--check',
  '-b': '--backup',
  '-i': '--install',
  '-t': '--test',
  '-td': '--test-download',
  '-ti': '--test-install',

  '-f': '--filter'
}
args = args.map(i => argAlias[i] || i)

var mode = 'default'
if (args.length) {
  if (args.includes('--test')) {
    mode = 'test'
    args.splice(args.indexOf('--test'), 1)
  } else if (args.includes('--test-download')) {
    mode = 'test-download'
    args.splice(args.indexOf('--test-download'), 1, '--profile', 'test')
  } else if (args.includes('--test-install')) {
    mode = 'test-install'
    args.splice(args.indexOf('--test-install'), 1, '--profile', 'test')
  }
}

var database; var databaseFile = './database.json'
if (args.length && args.includes('--profile')) {
  let index = args.indexOf('--profile')
  let profile = args[index + 1]
  args.splice(index, 2)
  databaseFile = `./database-${profile}.json`
  if (!(profile in _.profile) || Object.keys(_.profile[profile]).length === 0) {
    console.error(`Error:\tNo Profile ${profile}`)
    process.exit()
  }
  _ = _.profile[profile].deepmerge ? merge(_, _.profile[profile]) : Object.assign(_, _.profile[profile])
  delete _.profile
}
try {
  database = fse.existsSync(databaseFile) ? JSON.parse(fse.readFileSync(databaseFile, 'utf-8')) : {}
} catch (error) {
  database = {}
}

var softwareFilter
if (args.length) {
  if (args.includes('--help')) {
    let notice = [
      'Usage: node index.js [general] [basic | mode filter]',
      '',
      'General Option:',
      ' -p [name], --profile [name]       use specific profile',
      ' -q, --quiet                       passive mode',
      '',
      'Basic Option:',
      ' -h, --help                        Print help',
      ' -md, --makemd                     Make README',
      ' -l, --list                        sort and list softwares',
      ' -s [keyword], --search [keyword]  search software',
      '',
      'Mode Option:',
      ' -c, --check                       check and write into database',
      ' -b, --backup                      backup all softwares',
      ' -i, --install                     install all softwares',
      ' -t, --test                        test all softwares',
      ' -td, --test-download              test all softwares (download, use profile test)',
      ' -ti, --test-install               test all softwares (download and install, use profile test)',
      '',
      'Filter Option:',
      ' -f [name], --filter [name]        filter with RegExp, multi-words separator: , (comma)',
      ' [name]                            filter when only equal',
      '',
      'More Information: https://github.com/dodying/softwareUpdateManager'
    ]
    console.warn(notice.join('\n'))
    process.exit()
  } else if (args.includes('--list')) {
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
    console.log(Object.keys(databaseNew).map(i => `${i}: ${databaseNew[i].version}`).join('\n'))
    fse.writeFileSync(databaseFile, JSON.stringify(databaseNew, null, 2))
    process.exit()
  } else if (args.includes('--makemd')) {
    (async () => {
      let database
      try {
        database = fse.existsSync('./software.json') ? fse.readJSONSync('./software.json') : {}
      } catch (error) {
        database = {}
      }

      let md = fse.readFileSync('README_RAW.md', 'utf-8')
      let mdEn = fse.readFileSync('README_en_RAW.md', 'utf-8')
      let search = fse.readdirSync('./js/search').map((item, order) => `${order + 1}. ${path.parse(item).name}`).join('\n')
      let software = ''

      let orderForWithoutDownload = 0
      let softwareWithoutDownload = ''

      let orderForWithoutInstaller = 0
      let softwareWithoutInstaller = ''

      let orderForSpecialInstaller = 0
      let softwareSpecialInstaller = ''

      // let list = fse.readdirSync('software')
      let list = walk('software', { nodir: true, ignoreDir: 'Invalid', matchFile: /\.js$/ }).map(i => i.split(/[\\/]/).splice(1).join('/'))
      let descriptionUrl = ['github.com', 'sourceforge.net', 'www.majorgeeks.com', 'www.softpedia.com', 'www.nirsoft.net', 'www.sordum.org', 'docs.microsoft.com', 'www.the-sz.com', 'www.diskinternals.com', 'www.glarysoft.com', 'www.abelssoft.de', 'www.jam-software.com', 'www.sterjosoft.com', 'www.wisecleaner.com', 'vovsoft.com']
      for (let i = 0; i < list.length; i++) {
        if (fse.statSync(path.resolve('software', list[i])).isFile()) {
          let info = require(path.resolve('software', list[i]))
          let name = list[i].replace(/\.js$/, '')
          let src = encodeURI(list[i])
          let uri = info.url || Object.values(info.site)[0]
          let host = new URL(uri).host

          software += `${i + 1}. `
          software += `[`
          // software += `<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=${host}" width="16"> `
          software += `${name}](${uri})`

          if (info.commercial === true || info.commercial === 3) software += ' :money_with_wings:'
          if (info.commercial === 2) software += ' [Free Personal]'
          if (info.commercial === 1) software += ' [Freemium]'
          if (info.useProxy) software += ' :airplane:'
          if (!info.install) software += ' :hand:'
          if (info.fixedPath) software += ' :pushpin:'

          if (!(name in database) && descriptionUrl.includes(host)) {
            console.log(`Index ${i + 1}:\t${name}`)
            let res = await req(uri, { useProxy: info.useProxy })
            if (res instanceof Error || !res || res.statusCode >= 300 || res.statusCode < 200) res = await req(uri, { useProxy: !info.useProxy })
            if (res.statusCode >= 200 || res.statusCode < 300) {
              let $ = cheerio.load(res.body)
              let description = $('[itemprop="description"]').text() || $('[name="description"]').attr('content') || $('[property="og:description"]').attr('content') || $('[name="twitter:description"]').attr('content') || ''
              if (uri.match('/github.com/(.*?)/releases')) {
                let repo = res.request.uri.href.match('/github.com/(.*?)/releases')[1]
                let watch = $('.social-count[aria-label$="watching this repository"]').eq(0).text().trim()
                let star = $('.social-count[aria-label$="starred this repository"]').eq(0).text().trim()
                let fork = $('.social-count[aria-label$="forked this repository"]').eq(0).text().trim()
                description = `[${watch}/${star}/${fork}] ` + description.replace(/\s+Contribute to .*? on GitHub\.$/, '').replace(repo, '').replace(/ - $/, '')
              } else if (uri.match(/majorgeeks.com\/mg\/getmirror/)) {
                description = $('.geekyinsidecontent').eq(0).text()
              } else if (uri.match(/nirsoft.net/)) {
                let matched = res.body.replace(/[\r\n]+/g, '').match(/<h4 class="utilsubject">Description<\/h4>(.*?)<p>/)
                description = matched ? matched[1] : ''
              } else if (uri.match(/abelssoft.de/)) {
                description = description.replace(/(✓|✔).*/, '')
              }
              database[name] = description.replace(/[\r\n]+/, ' ').trim()
            } else {
              console.log(name, res.statusCode, uri)
            }
            fse.writeJSONSync('./software.json', database, { spaces: 2 })
          }
          if (name in database) software += ' ' + database[name]

          software += '\n'

          if (!info.download && !info.site) {
            softwareWithoutDownload += `${orderForWithoutDownload + 1}. `
            softwareWithoutDownload += `[${name}](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/${src})`
            softwareWithoutDownload += '\n'
            orderForWithoutDownload++
          } else if (!info.install) {
            softwareWithoutInstaller += `${orderForWithoutInstaller + 1}. `
            softwareWithoutInstaller += `[${name}](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/${src})`
            softwareWithoutInstaller += '\n'
            orderForWithoutInstaller++
          } else if ((info.install && info.install.toString().split(/[\r\n]+/).length > 3) || info.beforeInstall || info.afterInstall) {
            softwareSpecialInstaller += `${orderForSpecialInstaller + 1}. `
            softwareSpecialInstaller += `[${name}](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/${src})`
            softwareSpecialInstaller += '\n'
            orderForSpecialInstaller++
          }
        }
      }

      md = md.replace(/{search}/, search)
      md = md.replace(/{software-without-download}/g, softwareWithoutDownload)
      md = md.replace(/{software-without-installer}/g, softwareWithoutInstaller)
      md = md.replace(/{software-special-installer}/g, softwareSpecialInstaller)
      fse.writeFileSync('README.md', md)

      mdEn = mdEn.replace(/{search}/, search)
      mdEn = mdEn.replace(/{software-without-download}/g, softwareWithoutDownload)
      mdEn = mdEn.replace(/{software-without-installer}/g, softwareWithoutInstaller)
      mdEn = mdEn.replace(/{software-special-installer}/g, softwareSpecialInstaller)
      fse.writeFileSync('README_en.md', mdEn)

      fse.writeFileSync('SupportedSoftwares.md', software)
      process.exit()
    })()
  } else if (args.includes('--search')) {
    let keyword = args[args.indexOf('--search') + 1]
    args = keyword
    if (!keyword) {
      console.error('Error:\tPlease put in your keyword')
      process.exit()
    }

    mode = 'search'
    softwareFilter = () => false
  }

  if (args.includes('--quiet')) {
    args.splice(args.indexOf('--quiet'), 1)
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

  if (args.includes('--filter')) {
    if (mode === 'default') mode = 'filter'
    let index = args.indexOf('--filter')
    let re = args[index + 1] ? new RegExp((args[index + 1]).replace(/,/g, '|'), 'gi') : ''
    args.splice(index, 2)
    softwareFilter = software => software.match(re)
  }

  if (!['default', 'filter'].includes(mode)) {
    // go-on
  } else if (args.includes('--check')) {
    mode = 'check'
    args.splice(args.indexOf('--check'), 1)
  } else if (args.includes('--backup')) {
    mode = 'backup'
    args.splice(args.indexOf('--backup'), 1)
  } else if (args.includes('--install')) {
    mode = 'install'
    args.splice(args.indexOf('--install'), 1)
  }
}

var software = {}
var softwareAll = walk('software', { nodir: true, ignoreDir: 'Invalid', matchFile: /\.js$/ }).map(i => i.split(/[\\/]/).splice(1).join('/').replace(/\.js$/, ''))
softwareAll.forEach(i => {
  let info
  try {
    info = require(`./software/${i}.js`)
    if (info.other) softwareAll.push(...Object.keys(info.other).map(j => `${i}:${j}`))
  } catch (error) {}
})
var softwareList = ['test', 'test-download', 'test-install'].includes(mode) ? softwareAll : Object.keys(_.software)

if (!softwareFilter) {
  if (args.length === 0) {
    softwareFilter = () => true
  } else {
    softwareFilter = software => args.includes(software)
  }
}

softwareList.forEach(i => {
  let match = i.match(/^(.*):(.*)$/)
  let raw, version
  if (match) [, raw, version] = match

  if (softwareFilter(i)) {
    if (fse.existsSync(`./software/${match ? raw : i}.js`)) {
      if (match) {
        software[i] = Object.assign({}, require(`./software/${raw}.js`))
        if (software[i].other[version]) {
          software[i] = Object.assign(software[i], software[i].other[version])
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

var fns = {
  cheerio,
  getNow,
  spawnSync,
  req,
  reqRaw,
  reqHEAD,
  getHash,
  dirname: __dirname
}
walk('js', { nodir: true, matchFile: /\.js$/ }).map(i => i.split(/[\\/]/).splice(1).join('/').replace(/\.js$/, '')).forEach(i => {
  let arr = i.split(/[/_]/)
  let obj = fns
  for (let j = 0; j < arr.length - 1; j++) {
    if (!(arr[j] in obj)) obj[arr[j]] = {}
    obj = obj[arr[j]]
  }
  obj[arr[arr.length - 1]] = require(`./js/${i}.js`)
})

// Function
function getNow () { return new Date().toLocaleString(_.locale, { hour12: false }) }

function spawnSync (...argsForSpwan) {
  return new Promise(resolve => {
    let child = cp.spawn(...argsForSpwan)

    let logFile = path.resolve(__dirname, 'index.log')
    let logPip = fse.createWriteStream(logFile, { flags: 'a' })
    if (_.debug) {
      child.stdout.pipe(logPip)
      child.stderr.pipe(logPip)
    }

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

function reqOption (uriOrOption, optionUser = {}) {
  let option = typeof uriOrOption === 'string' ? { uri: uriOrOption } : uriOrOption
  let uri = option.uri
  let useProxy = optionUser.useProxy

  if (uriLast) uri = new URL(uri, uriLast).href
  option = Object.assign({
    method: 'GET',
    headers: {
      'User-Agent': _.request.userAgent,
      // 'Accept-Language': '*;q=0.5',
      'Referer': uriLast && new URL(uriLast).hostname === new URL(uri).hostname ? uriLast : uri
    },
    timeout: _.request.timeout * 1000,
    jar: cookies,
    strictSSL: false,
    resolveWithFullResponse: true,
    simple: false
  }, option, { uri })

  uri = option.uri || option.url
  delete option.url

  if (uri !== uriLast || !(url.parse(uri).hostname in proxyList)) {
    if (_.urlWithoutProxy.some(urlfilter => uri.match(urlfilter))) {
      useProxy = false
    } else if (_.urlWithProxy.some(urlfilter => uri.match(urlfilter)) || _.useProxy === 2 || (_.useProxy === 1 && useProxy)) {
      useProxy = true
    }
  } else {
    useProxy = useProxy === undefined || (_.autoToggleProxy && proxyList[url.parse(uri).hostname]) ? !proxyList[url.parse(uri).hostname] : useProxy
  }
  proxyList[url.parse(uri).hostname] = useProxy

  if (useProxy && _.request.proxy && _.request.proxy.match(/(http|socks5):\/\/((.*?):(.*?)@)?(.*?):(\d+)/i)) {
    let [, protocol,, username, password, hostname, port] = _.request.proxy.match(/(http|socks5):\/\/((.*?):(.*?)@)?(.*?):(\d+)/i)
    if (protocol.toLowerCase() === 'http') {
      option.proxy = _.request.proxy
    } else if (protocol.toLowerCase() === 'socks5') {
      option.agentClass = uri.match(/^http:/) ? Agent : Agent2
      option.agentOptions = {
        socksHost: hostname,
        socksPort: port
      }
      if (username && password) {
        option.agentOptions.socksUsername = username
        option.agentOptions.socksPassword = password
      }
    }
  }
  console.warn(`${option.method}${option.proxy ? '+proxy' : ''}:\t${uri}`)

  uriLast = uri
  return option
}

async function req (uriOrOption, optionUser = {}) {
  let option = reqOption(uriOrOption, optionUser)
  let uri = option.uri || option.url

  let errorHandle = (message) => {
    retryList[uri] = uri in retryList ? retryList[uri] + 1 : 1

    console.error(`Try ${retryList[uri]}:\t${message}`)
    return _.request.retry > retryList[uri] ? req(uriOrOption, optionUser) : null
  }

  let res
  try {
    res = await requestPromise(option)
    let succeed = typeof optionUser.check === 'function' ? optionUser.check(res) : res.statusCode >= 200 || res.statusCode < 300
    if (succeed) {
      if (res.body) {
        try {
          res.json = JSON.parse(res.body)
        } catch (error) {}
      }
      delete retryList[uri]
      return res
    } else {
      return errorHandle(res.statusCode + ' ' + res.statusMessage)
    }
  } catch (error) {
    if (error.cause.errno === 'ETIMEDOUT' && error.cause.port === 443 && uri.match('http://')) {
      option.uri = uri.replace('http://', 'https://')
      return req(option, optionUser)
    } else {
      return errorHandle(error.message)
    }
  }
}

function reqRaw (uriOrOption, optionUser = {}) {
  let option = reqOption(uriOrOption, optionUser)
  return request(option)
}

async function reqHEAD (uriOrOption, optionUser = {}) {
  let option = typeof uriOrOption === 'string' ? { uri: uriOrOption } : uriOrOption
  let uri = option.uri
  let useProxy = optionUser.useProxy
  let withoutHeader = optionUser.withoutHeader

  let retry = 1
  let head = async () => {
    return new Promise((resolve, reject) => {
      let req
      let _withoutHeader = _.download.urlWithoutHeader.some(urlfilter => uri.match(urlfilter)) || withoutHeader
      if (!_withoutHeader) {
        req = reqRaw(option, optionUser)
      } else {
        option = Object.assign(option, {
          headers: {},
          jar: request.jar(),
          removeRefererHeader: true
        })
        req = reqRaw(option, optionUser)
      }
      let html = ''
      let reses = []

      req.on('redirect', function () {
        if (_.debug) console.log(`Redirect:\t${this.uri.href}`)
      }).on('response', async res => {
        reses.push(res)
        if (['application', 'binary'].some(i => res.headers['content-type'].match(i))) {
          req.abort()
          resolve(reses)
          return
        }

        res.on('end', async function () {
          let $ = cheerio.load(html)
          let match = html.match(/<meta http-equiv="?refresh"? content="?(.*)"?/i)
          let refresh = $('meta[http-equiv="refresh"],meta[http-equiv="REFRESH"]')
          if (refresh.length || match) {
            let uri1 = refresh.length ? refresh.attr('content') : match[1]
            uri1 = uri1.match(/url=(.*)/i)[1]
            option.uri = uri1
            let reses1 = await reqHEAD(option, { useProxy })
            resolve(reses.concat(reses1))
          } else {
            resolve(reses)
          }
        })
        res.on('data', chunk => {
          html += chunk
        })
      }).on('error', async error => {
        console.error(`Try ${retry}:\t${error.message}`)
        retry = retry + 1
        useProxy = !useProxy
        if (_.request.retry > retry) {
          let reses1 = await head()
          resolve(reses.concat(reses1))
        } else {
          resolve(reses)
        }
      })
    })
  }
  let reses = await head()
  return reses[reses.length - 1]
}

function getHash (file, algorithm) {
  // Hash algorithms: MD2 MD4 MD5 SHA1 SHA256 SHA384 SHA512
  return cp.spawnSync('certutil', ['-hashfile', file, algorithm]).output[1].toString().split(/[\r\n]+/)[1]
}

function ExtendSoftware (data) {
  if (data.version) {
    if (typeof data.version === 'string') {
      data.version = { selector: data.version }
    } else if (data.version instanceof Function) {
      data.version = { func: data.version }
    } else if (data.version instanceof Array) {
      data.version = {
        selector: data.version[0],
        attr: data.version[1],
        match: data.version[2]
      }
    }
  }

  if (data.download) {
    if (typeof data.download === 'string') {
      if (data.download.match(/^https?:/i)) {
        data.download = { plain: data.download }
      } else {
        data.download = { selector: data.download }
      }
    } else if (data.download instanceof Function) {
      data.download = { func: data.download }
    } else if (data.download instanceof Array) {
      if (typeof data.download[0] === 'string') {
        if (data.download[0].match(/^https?:/i)) {
          data.download = {
            plain: data.download[0],
            output: data.download[1]
          }
        } else {
          data.download = {
            selector: data.download[0],
            attr: data.download[1],
            match: data.download[2],
            output: data.download[3]
          }
        }
      } else {
        data.download = {
          func: data.download[0],
          output: data.download[1]
        }
      }
    }
  }

  return data
}

// Main-version

async function getLatestVersion (i) {
  let iEscaped = i.replace(/[:*?"<>|]/g, '-')

  let res = await req(software[i].url, { useProxy: software[i].useProxy })
  let returnValue

  if (res && (res.statusMessage === 'OK' || res.statusCode >= 200 || res.statusCode < 300)) {
    returnValue = await (async function () {
      let $ = cheerio.load(res.body)
      if (_.debug) {
        let parentPath = path.dirname(`debug/${iEscaped}.html`)
        if (!fse.existsSync(parentPath)) fse.mkdirsSync(parentPath)
        fse.writeFileSync(`debug/${iEscaped}.html`, res.body)
        fse.writeJsonSync(`debug/${iEscaped}.json`, res, {
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
        let matched = version.match(regexp)
        if (!matched) {
          console.error(`Error:\tCan't match the RegExp of the Text when get version\nText:\t${version}\nRegExp:\t${regexp}`)
          return null
        }

        version = matched.length > 1 ? matched[1] : matched[0]
      } else if ('func' in software[i].version) {
        try {
          version = await software[i].version.func(res, $, fns, software[i].versionChoice)
          if (!version) {
            console.error(`Error:\t"func" return nothing when get version`)
            return null
          }
          if (version instanceof Array) version = version.length ? version[1] : version[0]
        } catch (error) {
          console.error(error)
          return null
        }
      } else {
        console.error(`Error:\tNo "selector"/"func" in "version"`)
        return null
      }
      version = version.replace(/[\\/:*?"<>|]/g, '-').trim()
      return { version, res, $ }
    })()
  }

  return returnValue
}

async function getVersion (filepath) {
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

function versionMax (v1, v2) {
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
  let outputRaw = value
  if (typeof steps === 'number') steps = new Array(formats.length).join(',').split(',').map(i => steps)
  let index = 0
  let arr = []
  let obj = {}
  while (outputRaw >= steps[index] && index + 1 < formats.length) {
    arr.push(parseInt(outputRaw) % steps[index])

    outputRaw = outputRaw / steps[index]
    obj[(index + 1).toString() + '.2'] = (outputRaw).toFixed(2) * 1

    index = index + 1
  }
  arr.push(parseInt(outputRaw) % steps[index])
  for (let i = 0; i < formats.length; i++) {
    obj[i] = arr[i] || 0
    obj[i.toString() + 'f'] = formats[i]
    if (i < arr.length) {
      obj[i - arr.length] = arr[i] || 0
      obj[(i - arr.length).toString() + '.2'] = obj[i.toString() + '.2']
      obj[(i - arr.length).toString() + 'f'] = formats[i]
    }
  }
  return replace(output, obj)
}

async function downloadFile (uri, i, target) {
  fse.mkdirsSync(path.dirname(target))
  software[i].retry = software[i].retry + 1
  let requestProxy = _.request.proxy
  _.request.proxy = _.download.proxy
  let option = {
    uri: uri
  }

  if (_.download.timeout) option.timeout = _.download.timeout * 1000
  let _withoutHeader = _.download.urlWithoutHeader.some(urlfilter => uri.match(urlfilter) || software[i].url.match(urlfilter)) || software[i].withoutHeader
  if (_withoutHeader) {
    option.jar = request.jar()
    option.headers = {}
  }

  let isContinue = _.download.continue && fse.existsSync(target) && fse.existsSync(target + '.json')
  if (isContinue) {
    option.headers = Object.assign(option.headers, {
      'Range': 'bytes=' + fse.statSync(target).size + '-'
    })
  }

  if (option.headers) {
    if (_.download.userAgent) {
      option.headers['User-Agent'] = _.download.userAgent
    } else {
      delete option.headers['User-Agent']
    }
  }

  let headers = isContinue ? fse.readJSONSync(target + '.json') : null
  let checkFile = () => {
    if (!fse.existsSync(target)) return false
    let md5 = headers['etag']
    if (md5) {
      let arr = headers['etag'].split(/[^0-9a-f]/i).filter(i => i)
      if (arr[0].length === 32 && arr[0].toLowerCase() === getHash(target, 'md5')) {
        if (arr[0].toLowerCase() !== getHash(target, 'md5')) return false
      }
    }

    let size = headers['content-length']
    if (size) {
      if (+size !== fse.statSync(target).size) return false
    } else {
      return false
    }
    return true
  }

  let result = await new Promise((resolve, reject) => {
    let req = reqRaw(option, { useProxy: software[i].useProxy })
    let intervalId, printProgress
    let interval = 0.8 // 单位:s
    let errorHandle = async error => {
      if (fse.existsSync(target)) fse.unlinkSync(target)
      // if (fse.existsSync(target + '.json')) fse.unlinkSync(target + '.json')
      if (printProgress instanceof Function) printProgress()
      req.abort()
      clearInterval(intervalId)
      _.request.proxy = requestProxy
      console.error(`Try ${software[i].retry}:\t${error.message}`)
      if (_.download.retry > software[i].retry) {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve()
          }, _.download.retryDelay * 1000)
        })
        software[i].useProxy = !software[i].useProxy
        return downloadFile(uri, i, target)
      } else {
        return resolve('error')
      }
    }

    let successHanle = (res) => {
      if (printProgress instanceof Function) printProgress()
      req.abort()
      clearInterval(intervalId)
      _.request.proxy = requestProxy
      if (res.headers['last-modified']) {
        let lastModified = res.headers['last-modified']
        lastModified = new Date(lastModified)
        fse.utimesSync(target, lastModified, lastModified)
        if (!_.download.continue) {
          fse.unlinkSync(target + '.json')
        } else {
          fse.utimesSync(target + '.json', lastModified, lastModified)
        }
      }
      resolve(true)
    }

    req.on('response', async res => {
      if (!isContinue) {
        headers = res.headers
        fse.writeJSONSync(target + '.json', res.headers, { spaces: 2 })
      }
      if (fse.existsSync(target) && (res.headers['content-length'] === '0' || (headers['content-length'] && +headers['content-length'] === fse.statSync(target).size))) {
        if (checkFile()) {
          successHanle(res)
        } else {
          await errorHandle(new Error('File no Match'))
        }
        return
      }

      if (fse.existsSync(target) && !res.headers['content-range'] && res.headers['content-length'] !== '0') fse.unlinkSync(target)
      let dl = fse.existsSync(target) ? fse.statSync(target).size : 0
      let len = parseInt(res.headers['content-length'], 10) + dl
      let dlLast = dl
      let time = new Date().getTime() / 1000
      let timeLast = time
      let filename = path.basename(target)
      let sizeFormats = ['bytes', 'KB', 'MB', 'GB']

      console.log(`[${valueHumanReadable(len, sizeFormats, 1024, '{-1.2} {-1f}')}] ${res.request.uri.href} ==> ${filename}`)
      printProgress = () => {
        if (_.download.quiet) return
        let speed = (dl - dlLast) / (time - timeLast || interval)
        let remain = valueHumanReadable((len - dl) / speed, ['s', 'min', 'h', 'd'], [60, 60, 24], '{3}{3f} {2}{2f} {1}{1f} {0}{0f}')
        let speedRead = valueHumanReadable(speed, sizeFormats, 1024, '{-1.2} {-1f}/s')

        let percent = (100.0 * dl / len).toFixed(0) * 1

        let dRead = valueHumanReadable(dl, sizeFormats, 1024, '{-1.2} {-1f}')
        readline.clearLine(process.stdout, 0)
        readline.cursorTo(process.stdout, 0)
        process.stdout.write(`${percent}% [${'='.repeat(percent)}${percent <= 99 ? '>' : ''}${' '.repeat(100 - percent)}] ${dRead} ${speedRead} ${remain}\r`)
      }
      intervalId = setInterval(printProgress, interval * 1000)

      res.pipe(fse.createWriteStream(target, { flags: 'a' })).on('finish', async () => {
        if (!headers['content-length'] || checkFile()) {
          successHanle(res)
        } else {
          await errorHandle(new Error('File no Match'))
        }
      }).on('error', async error => {
        await errorHandle(error)
      })

      res.on('data', chunk => {
        timeLast = time
        time = new Date().getTime() / 1000
        dlLast = dl
        dl += chunk.length
      })
    }).on('error', async error => {
      await errorHandle(error)
    })
  })
  return result
}

function getExt (uri) {
  let uri1 = uri.replace('/download', '')
  let matched = path.extname(uri1).toLocaleLowerCase()
  if (exts.includes(matched)) {
    return exts2.includes(matched) ? path.extname(path.parse(uri1).name) + matched : matched
  }
}

async function downloadLatestVersion (i, versionLatest, res, $) {
  let iEscaped = i.replace(/[:*?"<>|]/g, '-')
  let download

  if ('plain' in software[i].download) { // download url is regular
    replace.init({
      version: versionLatest
    })
    download = replace(software[i].download.plain)
  } else if ('selector' in software[i].download) { // can get download from html
    try {
      download = $(software[i].download.selector)
    } catch (error) {
      console.error(`Error:\tSelector Invalid when get download url\nSelector:\t${software[i].download.selector}`)
      return false
    }

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
      download = await software[i].download.func(res, $, fns, software[i].downloadChoice)
      if (!download) {
        console.error(`Error:\t"func" return nothing when get download`)
        return null
      }
    } catch (error) {
      console.error(error)
      return null
    }
  } else {
    console.error(`Error:\tNo "plain"/"selector"/"func" in "download"`)
    return null
  }

  download = url.resolve(res.request.uri.href, download)

  let ext, matched
  if (software[i].download.output) {
    ext = software[i].download.output
  } else if ((matched = getExt(download))) {
    ext = matched
  } else {
    software[i].retry = 0
    let res1 = await reqHEAD(download, { useProxy: software[i].useProxy, withoutHeader: software[i].withoutHeader })

    if (!res1) {
      console.error(`Error:\tCan't Access ${download}`)
      console.error(`Error:\tCan't get Extension name, please set "output" in "download"`)
      return null
    } else if ((matched = getExt(res1.request.uri.pathname))) {
      ext = matched
    } else if (res1.headers['content-disposition'] && (matched = res1.headers['content-disposition'].match(/filename="?(.*?)"?(;|$)/)) && matched[1] && (matched = getExt(matched[1]))) {
      ext = matched
    } else {
      console.error(`Error:\tCan't get Extension name, please set "output" in "download"`)
      return null
    }
  }

  if (!ext) return null

  if (url.parse(download).host === 'sourceforge.net' && download.match(/\/download$/) && _.download.sfMirror) download = download + '?use_mirror=' + _.download.sfMirror
  let output = iEscaped + '-' + versionLatest + ext.toLowerCase()
  output = path.resolve(_.archivePath, output)
  console.log(`Download:\t${download}`)
  console.log(`Output:\t${output}`)

  if (JSON.parse(JSON.stringify(cookies))._jar.cookies.length) {
    fse.writeFileSync('cookies.txt', JSON.parse(JSON.stringify(cookies))._jar.cookies.map(i => [`.${i.domain}`, i.hostOnly ? 'TRUE' : 'FALSE', i.path, i.secure ? 'TRUE' : 'FALSE', i.expires ? Math.round(new Date(i.expires).getTime() / 1000) : '0', i.key, i.value].join('\t')).join('\r\n'))
  }

  if (['test'].includes(mode)) return null
  let args = []
  let end

  let _withoutHeader = _.download.urlWithoutHeader.some(urlfilter => download.match(urlfilter) || software[i].url.match(urlfilter)) || software[i].withoutHeader
  let _prxoy = _.download.proxy
  let _withProxyRule = _.urlWithProxy.some(urlfilter => download.match(urlfilter) || software[i].url.match(urlfilter))
  let _withProxyMode = _.useProxy === 2 || (_.useProxy === 1 && software[i].useProxy)
  let _withProxyAuto = proxyList[url.parse(download).hostname] || proxyList[url.parse(software[i].url).hostname]
  let _withProxy = _withProxyRule || _withProxyMode || _withProxyAuto
  let _withoutProxy = _.urlWithoutProxy.some(urlfilter => download.match(urlfilter))
  let _useProxy = _prxoy && _withProxy && !_withoutProxy

  console.log()
  if (_.download.method === 'request') {
    software[i].retry = 0
    end = await downloadFile(download, i, output)
  } else if (_.download.method === 'aria2c') {
    if (_.download.continue && fse.existsSync(output)) args.push('--continue')
    if (_.download.quiet) args.push('--quiet')
    if (_.download.retry) args.push('--max-tries=' + _.download.retry, '--retry-wait=' + _.download.retryDelay)
    if (_.download.timeout) args.push('--timeout=' + _.download.timeout)
    if (!_withoutHeader) {
      if (fse.existsSync('cookies.txt')) args.push('--load-cookies=cookies.txt') // Load Cookies from FILE
      if (_.download.userAgent) args.push(`--user-agent="${_.download.userAgent}"`)
      args.push(`--referer="${software[i].url}"`)
    }
    if (_useProxy) {
      args.push(`--all-proxy=${_.download.proxy}`)
      args.push('--check-certificate=false') // Verify the peer using certificates
    }
    args.push('--remote-time') // Retrieve timestamp of the remote file from the remote HTTP/FTP server and if it is available, apply it to the local file.
    args.push('--auto-file-renaming=false') // Rename file name if the same file already exists.
    args.push('--allow-overwrite=true') // Restart download from scratch if the corresponding control file doesn’t exist.
    args.push('--file-allocation=none') // Specify file allocation method.
    args.push('--min-split-size=1M') // aria2 does not split less than 2*SIZE byte range.
    args.push('--max-connection-per-server=16') // The maximum number of connections to one server for each download.
    args.push('--split=16') // Download a file using N connections.
    args.push('--console-log-level=error') // Set log level to output to console.
    if (_.debug) args.push(`--log=debug\\${iEscaped}-aria2c.log`) // The file name of the log file.
    args.push(`--out=${path.relative('', output)}`, download)
    end = await spawnSync(`plugins\\aria2c.exe`, args)
  } else if (_.download.method === 'wget') {
    if (_.download.continue && fse.existsSync(output)) args.push('--continue')
    if (_.download.quiet) args.push('--quiet')
    if (_.download.retry) args.push('--tries=' + _.download.retry, '--waitretry=' + _.download.retryDelay)
    if (_.download.timeout) args.push('--timeout=' + _.download.timeout)
    if (!_withoutHeader) {
      if (fse.existsSync('cookies.txt')) args.push('--load-cookies=cookies.txt') // load cookies from FILE before session
      if (_.download.userAgent) args.push(`--user-agent="${_.download.userAgent}"`)
      args.push(`--referer="${software[i].url}"`)
    }
    if (_useProxy) {
      args.push('-e', 'use_proxy=yes')
      args.push('-e', `http_proxy=${_.download.proxy}`)
      args.push('-e', `https_proxy=${_.download.proxy}`)
      args.push('--no-check-certificate') // don't validate the server's certificate
    }
    args.push('--no-verbose') // turn off verboseness, without being quiet
    args.push('--show-progress') // display the progress bar in any verbosity mode
    if (_.debug) args.push('--debug', '--verbose', `--append-output=debug\\${iEscaped}-wget.log`) // append messages to FILE
    args.push(`--output-document=${output}`, download)
    end = await spawnSync(`plugins\\wget.exe`, args)
  } else if (_.download.method === 'curl') {
    if (_.download.continue && fse.existsSync(output)) args.push('--continue-at', '-')
    if (_.download.quiet) args.push('--silent')
    if (_.download.retry) args.push('--retry', _.download.retry, '--retry-delay', _.download.retryDelay)
    if (_.download.timeout) args.push('--max-time', _.download.timeout)
    if (!_withoutHeader) {
      if (fse.existsSync('cookies.txt')) args.push('--cookie', 'cookies.txt') // Send cookies from string/file
      if (_.download.userAgent) args.push('--user-agent', _.download.userAgent)
      args.push('--referer', software[i].url)
    }
    if (_useProxy) {
      args.push('--proxy', _.download.proxy)
      args.push('--insecure') // Allow insecure server connections when using SSL
    }
    args.push('--remote-time') // Set the remote file's time on the local output
    args.push('--location') // Follow redirects
    if (_.debug) args.push('--verbose') // append messages to FILE
    args.push('--output', output, download)
    end = await spawnSync(`plugins\\curl.exe`, args)
  }
  console.log()

  if (end === 'error') {
    console.error(`Software:\t${i}`)
    console.error('Error: Download new version Error')
    if (['test-download', 'test-install'].includes(mode)) {
      // go-on
    } else if (readlineSync.keyInYNStrict(`Open:\t${download}`)) cp.execSync(`start "" "${download}"`)
    return null
  } else if (['backup'].includes(mode)) {
    return null
  } else {
    return { output }
  }
}

// Main-virus

async function virusCheckFile (file) {
  let sha256 = getHash(file, 'sha256')

  let res = await req({
    uri: 'https://www.virustotal.com/vtapi/v2/file/report',
    method: 'POST',
    form: {
      apikey: _.virus.apiKey,
      resource: sha256
    },
    json: true
  })
  if (!res.statusCode || !res.body) return virusCheckFile(file)
  if (res.body.response_code === -2) return 'Scaning'
  if (res.body.response_code === 0 && _.virus.upload) {
    console.log('Note:\tYour file is uploading to scan')
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
      },
      json: true
    })
    return virusCheckFile(file)
  }
  if (res.body.response_code === 0 && !_.virus.upload) return 'No Data'

  let result = Object.keys(res.body.scans).map(i => {
    return Object.assign({ name: i }, res.body.scans[i])
  })
  console.warn(result.filter(i => i.detected).map(i => `Warn:\t${i.name}: ${i.result}`).join('\n'))
  result = result.filter(i => {
    let ignoreSoftware = _.virus.ignoreSoftware.some(keyword => {
      if (typeof keyword === 'string') {
        return i.name === keyword
      } else if (keyword instanceof RegExp) {
        return i.name.match(keyword)
      }
    })
    let ignoreResult = _.virus.ignoreSoftware.some(keyword => {
      if (typeof keyword === 'string') {
        return i.result === keyword
      } else if (keyword instanceof RegExp) {
        return i.result.match(keyword)
      }
    })
    return !ignoreSoftware && !ignoreResult
  })
  let ratio = result.filter(i => i.detected).length / result.length
  return ratio <= _.virus.safeDetectionRatio
}

// Main-install

async function installLatestVersion (i, output, iPath) {
  if (software[i].fixedPath) {
    if (!_.ignoreWarn.fixedPath && !readlineSync.keyInYNStrict(`Continue to install?`)) return false
    let dirname = path.dirname(iPath)
    if (!fse.existsSync(dirname)) {
      try {
        fse.mkdirsSync(dirname)
      } catch (error) {
        console.error(`Error:\tCan't Create Directory\nMessage:\t${error.message}`)
        return false
      }
    }
  }

  if (!_.ignoreWarn.preferPath && software[i].preferPath && iPath.toLowerCase().substr(-software[i].preferPath.length).replace(/\\/g, '/') !== software[i].preferPath.toLowerCase()) {
    console.warn(`Warn:\tThe path you given don't have preferred\nTarget:\t${iPath}\nPreferPath:\t${software[i].preferPath}`)
    if (!readlineSync.keyInYNStrict('Continue to install?')) return false
  }

  if ('beforeInstall' in software[i]) await software[i].beforeInstall(output, iPath, fns, software[i].installChoice)
  if (_.specialMode[i] === 3 || (!software[i].commercial && _.mode === 3) || (software[i].commercial && _.commercialMode === 3)) {
    if (software[i].install.toString().match(/install_single/)) {
      fse.removeSync(iPath)
    } else {
      fse.removeSync(path.parse(iPath).dir)
    }
  }
  let installed = await software[i].install(output, iPath, fns, software[i].installChoice)
  if (installed) {
    if ('afterInstall' in software[i]) await software[i].afterInstall(output, iPath, fns, software[i].installChoice)
    if (!_.preserveArchive) fse.removeSync(output)
  } else {
    console.error(`Software:\t${i}\nError:\tSkipped\nLocation:\t${output}\nTarget:\t${iPath}`)
  }
  return installed
}

// Main-clean

function doBeforeExit () {
  if (_.debug) {
    let cookiesRaw = fse.existsSync('cookies.json') ? fse.readJSONSync('cookies.json') : {}
    let cookiesNew = JSON.parse(JSON.stringify(cookies))._jar.cookies
    cookiesNew = cookiesNew.concat(cookiesRaw).filter((item, index, array) => array.indexOf(array.filter(item2 => item2.key === item.key && item2.domain === item.domain && item2.path === item.path)[0]) === index)
    fse.writeJSONSync('cookies.json', cookiesNew, { spaces: 2 })
  } else {
    cookies = request.jar()
  }
  if (fse.existsSync('cookies.txt')) fse.removeSync('cookies.txt')
  if (['default', 'filter', 'check', 'install'].includes(mode)) fse.writeFileSync(databaseFile, JSON.stringify(database, null, 2))
  try {
    fse.removeSync(path.resolve(_.archivePath, 'unzip'))
    fse.emptyDirSync('./unzip')
  } catch (error) {}
}

// Main
async function init () {
  if (['--makemd'].some(i => args.includes(i))) return

  if (!fse.existsSync('./plugins')) {
    console.log('Error:\tNo Plugins, Please Download And Extract to "plugins"')
    if (readlineSync.keyInYNStrict(`Open ${releasePage}`)) cp.execSync(`start "" "${releasePage}"`)
  } else {
    let list = fse.readdirSync('./plugins')
    let notExists = [
      '7z.dll', '7z.exe',
      'dark.exe', 'winterop.dll', 'wix.dll',
      'innounp.exe'
    ].filter(i => !list.includes(i))
    // let downloadTool = ['aria2c.exe', 'wget.exe', 'curl.exe'].filter(i => list.includes(i))
    if (notExists.length) { //  || !downloadTool
      console.log('Error:\t"plugins" exists, but some file needed not')
      if (readlineSync.keyInYNStrict(`Open ${releasePage}`)) cp.execSync(`start "" "${releasePage}"`)
      return
    }
  }

  if (mode === 'search') { // Search
    let result = []
    let keyword = args

    let list = [].concat(_.search).filter(i => fse.existsSync(path.join('./js/search', i + '.js')))
    if (!list.length) list = fse.readdirSync('./js/search')

    for (let i of list) {
      console.log(`Searching:\t${i}`)
      let tmp = await require('./js/search/' + i)(fns, keyword)
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
    while (true) {
      answer = readlineSync.questionInt(`[0-${result.length}] (0=Exit):`)
      if (answer < 0 || answer > result.length) {
      } else if (answer === 0) {
        fse.unlinkSync('./search.html')
        break
      } else {
        let selected = result[answer - 1]
        if (!fse.existsSync('generate')) fse.mkdirSync('generate')
        let filepath = path.resolve('./generate/', selected.name + '.js')
        fse.writeFileSync(filepath, selected.text)
        console.log(`Location:\t${filepath}\nInfo:\tFile Generated, you should move it to "software" manually`)
      }
    }
  }

  if (!fse.existsSync(_.archivePath)) fse.mkdirsSync(_.archivePath)
  if (['default', 'filter'].includes(mode) && (_.mode === 3 || _.commercialMode === 3 || Object.values(_.specialMode).some(i => i === 3)) && !_.ignoreWarn.mode3 && !readlineSync.keyInYNStrict('There are some configuration or profile of softwares may be removed if there are new version.\nMake sure you know mode 3 at your own risk.\nDo you want to continue?')) return

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

    if (['test', 'test-download', 'test-install', 'check'].includes(mode)) {
      // go-on
    } else if (_.specialMode[i] === -1) {
      continue
    } else if (_.specialMode[i] === undefined && (!software[i].commercial && _.mode === -1)) {
      continue
    } else if (_.specialMode[i] === undefined && (software[i].commercial && _.commercialMode === -1)) {
      continue
    }

    // 扩展为标准格式
    software[i] = ExtendSoftware(software[i])

    if (!(i in database)) database[i] = {}
    if (['test-install'].includes(mode) && !_.software[i]) _.software[i] = path.resolve(_.rootPath, iEscaped, software[i].preferPath || path.basename(iEscaped) + '.exe')
    let iPath = path.resolve(_.rootPath, _.software[i] || '')
    if (software[i].fixedPath) {
      iPath = software[i].fixedPath = cp.spawnSync('cmd', ['/c', `echo ${software[i].fixedPath}`], {
        env: Object.assign({}, process.env, {
          'ProgramFiles(x86)': process.env['ProgramFiles(x86)'] || process.env['ProgramFiles']
        })
      }).output[1].toString().trim()
    }

    let isModeDefault = mode === 'default' && args.length === 0
    let isUpdateRecently = (new Date().getTime() - new Date(database[i].lasttime || 0).getTime() < _.checkInterval * 24 * 60 * 60 * 1000)
    let fileExists = fse.existsSync(iPath)
    if (isModeDefault && isUpdateRecently && fileExists) continue

    process.title = i

    let version
    let versionLocal = await getVersion(iPath)
    if (['test', 'test-download', 'test-install', 'check', 'backup'].includes(mode) || !fse.existsSync(iPath)) {
      version = null
    } else if ('version' in database[i]) {
      if (software[i].noMd5 || database[i].md5 === getHash(iPath, 'md5')) {
        version = database[i].version
      } else {
        version = versionLocal
      }
      // version = versionMax(database[i].version, versionLocal) ? database[i].version : versionLocal
    } else {
      version = versionLocal
    }

    console.log('\n- - - - - - - - - - -\n')
    console.log(`Software:\t${i}`)
    if (['test', 'test-download', 'test-install'].includes(mode) || _.debug) console.log(`File:\t${path.join(__dirname, 'software', iRaw + '.js')}`)
    console.log(`Location:\t${iPath}`)
    console.log(`Version:\t${version}`)
    // if (software[i].url) console.log(`Url:\t${software[i].url}`)

    if (['install'].includes(mode) && 'install' in software[i]) {
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
    software[i].retry = 0
    let siteList = 'site' in software[i] ? Object.keys(software[i].site) : []
    let siteNow
    let result
    if (!software[i].url && siteList.length) {
      siteNow = Object.keys(software[i].site)[0]
      software[i].url = software[i].site[siteNow]

      let info = require('./templates/' + siteNow)
      let preserve = ['useProxy', 'withoutHeader', 'version', 'download']
      for (let key of preserve) {
        software[i][key] = info[key] || software[i][key]
      }
      // console.log(`Site ${siteNow}:\t${software[i].url}`)
    }
    result = await getLatestVersion(i)
    while (!result && siteList.length) {
      if (siteList.indexOf(siteNow) + 1 === siteList.length) {
        break
      } else {
        siteNow = siteList[siteList.indexOf(siteNow) + 1]
        software[i].url = software[i].site[siteNow]

        let info = require('./templates/' + siteNow)
        let preserve = ['useProxy', 'withoutHeader', 'version', 'download']
        for (let key of preserve) {
          software[i][key] = info[key] || software[i][key]
        }
        // console.log(`Site ${siteNow}:\t${software[i].url}`)
        result = await getLatestVersion(i)
      }
    }
    if (!result) continue
    let { version: versionLatest, res, $ } = result

    database[i].lasttime = getNow()
    console.log(`Latest Version:\t${versionLatest}`)

    if (['check'].includes(mode)) {
      database[i].md5 = getHash(iPath, 'md5')
      database[i].version = versionLatest
      continue
    } else if (version === null || versionMax(versionLatest, version)) { // new version
      // go-on
    } else { // no new version
      if (_.saveVersion) {
        database[i].md5 = getHash(iPath, 'md5')
        database[i].version = versionLatest
      }
      continue
    }

    if (['default', 'filter'].includes(mode)) {
      notifier.notify({
        title: `Software:\t${i}`,
        message: `Latest Version:\t${versionLatest}`,
        open: software[i].url,
        timeout: 3
      })
    }

    if (['default', 'filter'].includes(mode) && !_.preserveOldArchive) {
      let name = iEscaped
      let files = walk(_.archivePath, { fullpath: false }).filter(raw => {
        let fileName = raw.replace(/\\/g, '/')
        while (exts.concat(exts2, '.json').includes(path.extname(fileName))) {
          fileName = path.parse(fileName).dir ? path.parse(fileName).dir + '/' + path.parse(fileName).name : path.parse(fileName).name
        }
        if (database[i] && versionLatest !== database[i].version && fileName === name + '-' + database[i].version) { // 之前记录的版本
          let file = path.resolve(_.archivePath, raw)
          fse.removeSync(file)
          console.warn(`Removed:\t${file}`)
          return false
        }
        return fileName.indexOf(name) === 0 && fileName.includes(name + '-') && fileName !== name + '-' + versionLatest
      })
      for (let file of files) {
        file = path.resolve(_.archivePath, file)
        if (readlineSync.keyInYNStrict(`Delete:\t${file}`)) fse.removeSync(file)
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
      continue
    } else if (['backup'].includes(mode)) {
      continue
    } else { // open url
      if (software[i].commercial) console.warn('Info:\tCommercial Software')
      if (readlineSync.keyInYNStrict(`Open:\t${software[i].url}`)) cp.execSync(`start "" "${software[i].url}"`)
      continue
    }

    // download
    result = await downloadLatestVersion(i, versionLatest, res, $)
    if (!result || ['test-download'].includes(mode)) continue
    let { output } = result

    if (_.specialMode[i] >= 2 && 'install' in software[i]) {
      // go-on
    } else if (_.specialMode[i] === undefined && (!software[i].commercial && _.mode >= 2) && 'install' in software[i]) {
      // go-on
    } else if (_.specialMode[i] === undefined && (software[i].commercial && _.commercialMode >= 2) && 'install' in software[i]) {
      // go-on
    } else if (['test-install'].includes(mode) && 'install' in software[i]) {
      // go-on
    } else if (['test-install'].includes(mode) && !('install' in software[i])) {
      continue
    } else {
      console.warn(`Warn:\tYou should install it yourself.\nTarget:\t${iPath}\nOutput:\t${output}`)
      if (!_.ignoreWarn.mode1 && readlineSync.keyInYNStrict(`Show:\t${output}`)) cp.execSync(`start "" "explorer" /select,"${output}"`)
      continue
    }

    // virus check
    let safe
    if (_.virus.apiKey) {
      safe = await virusCheckFile(output)
    } else if (_.ignoreWarn.withoutVirusScan || readlineSync.keyInYNStrict(`File:\t${output}\nWarn:\tFile is not scaned to check virus\nContinue to install anymore?`)) {
      safe = true
    }
    if (!safe || typeof safe === 'string') {
      console.error(`Software:\t${i}\nError:\tSkipped\nReason:\t${'Not Safe' || safe}\nLocation:\t${output}\nTarget:\t${iPath}`)
      continue
    }

    // install
    let installed = await installLatestVersion(i, output, iPath)
    if (installed) database[i].lastupdatetime = getNow()
    if (installed && _.saveVersion) {
      database[i].md5 = getHash(iPath, 'md5')
      database[i].version = versionLatest
    }
  }

  return true
}

init().then(result => {
  doBeforeExit()

  if (result) console.log('\n- - - - - - - - - - -\n')
}, (err) => {
  doBeforeExit()

  console.log('\n- - - - - - - - - - -\n')
  console.error('Error: ', err.message, '\n ', err.stack.replace(/[\r\n]/g, '{\\n}').match(/{\\n}\s+(at\s+.*)/m)[1].replace(/{\\n}\s+/g, '\n  '))
  process.exit(err)
})
