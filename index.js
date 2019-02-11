// ==Headers==
// @Name:               softwareUpdateManager
// @Description:        软件更新管理器
// @Version:            1.0.0
// @Author:             dodying
// @Date:               2018-07-09 20:07:11
// @Namespace:          https://github.com/dodying/Nodejs
// @SupportURL:         https://github.com/dodying/Nodejs/issues
// ==/Headers==

// 设置
const _ = require('./config')

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

// Function
const getVersion = filepath => {
  if (fse.existsSync(filepath)) {
    let info = cp.execSync(`wmic DATAFILE where name="${filepath.replace(/[/\\]/g, '\\\\')}" get version`).toString()
    if (info.match(/Version\s+([\d.]+)/)) {
      return info.match(/Version\s+([\d.]+)/)[1]
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
  let arr1 = v1.split('.')
  let arr2 = v2.split('.')
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
var database = fse.existsSync('./database.json') ? JSON.parse(fse.readFileSync('./database.json', 'utf-8')) : {}
let args = process.argv.splice(2)
let mode = 'default'
if (args.length) {
  if (args[0] === '-filter') {
    mode = 'filter'
  } else if (args[0] === '-onlycheck') {
    mode = 'onlycheck'
  } else if (args[0] === '-list') {
    console.log(database)
    process.exit()
  } else if (args[0] === '-makemd') {
    let md = fse.readFileSync('README_RAW.md', 'utf-8')
    let example = fse.readFileSync('software/Telegram.js', 'utf-8')
    let software = ''
    let list = fse.readdirSync('software')
    for (let i = 0; i < list.length; i++) {
      if (fse.statSync(path.resolve('software', list[i])).isFile()) {
        let info = require('./software/' + list[i])
        software += `${i + 1}. `
        software += `[${path.parse(list[i]).name}](${info.url})`
        if (info.commercial) software += ' :moneybag:'
        if (info.useProxy) software += ' :airplane:'
        if (!info.install) software += ' :hand:'
        software += '\n'
      }
    }
    md = md.replace(/{example}/, example)
    md = md.replace(/{software}/g, software)
    fse.writeFileSync('README.md', md)
    process.exit()
  } else {
    mode = 'software'
  }
}

var software = {}
Object.keys(_.software).forEach(i => {
  if (mode !== 'software' || (mode === 'software' && args.includes(i))) {
    if (fse.existsSync('./software/' + i + '.js')) {
      software[i] = require('./software/' + i)
    } else {
      console.error(`Software:\t${i}\nError:\tNo this js in folder "software"`)
    }
  }
})

let req = (url, useProxy) => {
  let requestOption = {
    url: url,
    headers: {
      'User-Agent': _.userAgent
    },
    timeout: _.request.timeout * 1000,
    resolveWithFullResponse: true
  }
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
  fse.writeFileSync('./database.json', JSON.stringify(database, null, 2))
  fse.removeSync('archive\\unzip')
  fse.emptyDirSync('unzip')
}

let init = async () => {
  for (let i in software) {
    process.title = i
    if (!(i in database)) database[i] = {}
    if (mode === 'default' && 'lasttime' in database[i] && (new Date().getTime() - database[i].lasttime < _.checkInterval * 24 * 60 * 60 * 1000)) continue
    let iPath = path.resolve(_.rootPath, _.software[i])
    if (mode === 'filter') {
      let re = new RegExp(args[1].split(',').join('|'))
      if (!iPath.match(re)) continue
    }
    let version
    let versionLocal = getVersion(iPath)
    if (mode === 'onlycheck') {
      version = null
    } else if ('version' in database[i]) {
      version = versionMax(database[i].version, versionLocal) ? database[i].version : versionLocal
    } else {
      version = versionLocal
    }
    console.log(`Software:\t${i}\nLocation:\t${iPath}\nVersion:\t${version}\nUrl:\t${software[i].url}`)
    let res
    try {
      res = await req(software[i].url, software[i].useProxy)
    } catch (error) { // get latest version error
      console.log(error.message)
    }
    if (res && res.statusMessage === 'OK') {
      let $ = cheerio.load(res.body)

      let versionLatest
      if ('selector' in software[i].version) {
        versionLatest = $(software[i].version.selector)
        versionLatest = software[i].version.attr === 'text' || !('attr' in software[i].version) ? versionLatest.eq(0).text() : software[i].version.attr === 'html' ? versionLatest.eq(0).html() : versionLatest.attr(software[i].version.attr)
        versionLatest = versionLatest.match(software[i].version.match || /(\d+[\d.]+\d+)/)[1]
      } else if ('func' in software[i].version) {
        versionLatest = await software[i].version.func(res, $)
      } else {
        console.error(`Software:\t${i}\nError:\tNo "selector" or "func" in "version"`)
        continue
      }

      console.log(`Latest Version:\t${versionLatest}`)
      if (mode === 'onlycheck') {
        database[i].version = versionLatest
      } else if (version === null || versionMax(versionLatest, version)) { // new version
        notifier.notify({
          title: `Software:\t${i}`,
          message: `Latest Version:\t${versionLatest}`,
          open: software[i].url
        })
        if ((_.specialMode[i] > 0 || (!software[i].commercial && _.mode > 0) || (software[i].commercial && _.commercialMode > 0)) && 'download' in software[i]) { // download
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
                console.error(`Software:\t${i}\nError:\tvariables "${result[1]}" is not defined`)
                process.exit(1)
              }
              str = str.replace(result[0], variables[result[1]])
              result = re.exec(str)
            }
            download = str
          } else if ('selector' in software[i].download) { // can get download from html
            download = $(software[i].download.selector)
            download = software[i].download.attr === 'text' || !('attr' in software[i].download) ? download.eq(0).text() : software[i].download.attr === 'html' ? download.html() : download.attr(software[i].download.attr)
            download = software[i].download.match ? download.match(software[i].download.match)[1] : download
          } else if ('func' in software[i].download) {
            download = await software[i].download.func(res, $)
          } else {
            if (cp.execSync(`Software:\t${i}\nStatus:\tNo Download Url`)) cp.execSync(`start "" "${software[i].url}"`)
            continue
          }

          download = url.resolve(res.request.href, download)
          let output
          if (!('output' in software[i].download) || software[i].download.output.match(/^\./)) {
            output = i + (software[i].download.output || download.match(/\.[\d\w]+$/)[0])
          } else {
            output = software[i].download.output
          }
          output = path.resolve(process.cwd(), 'archive', output)
          console.log(`Software:\t${i}\nDownload:\t${download}\nOutput:\t${output}`)
          let args = []
          if (_.download.quiet) args.push('-q')
          if (_.download.retry) args.push('-t', _.download.retry)
          if (_.download.timeout) args.push('-T', _.download.timeout)
          if (!(_.download.urlWithoutHeader.some(urlfilter => download.match(urlfilter)))) {
            args.push('-U', _.userAgent)
            args.push(`--referer=${software[i].url}`)
          }
          if (_.download.proxy && (_.urlWithProxy.some(urlfilter => download.match(urlfilter)) || _.useProxy === 2 || (_.useProxy === 1 && software[i].useProxy)) && !(_.urlWithoutProxy.some(urlfilter => download.match(urlfilter)))) {
            args.push('-e', 'use_proxy=yes')
            args.push('-e', `http_proxy=${_.download.proxy}`)
            args.push('-e', `https_proxy=${_.download.proxy}`)
            args.push('--no-check-certificate')
          }
          args.push('-c', '-O', output, download)
          let end = await spawnSync(`plugins\\wget.exe`, args)
          if (end === 'error') {
            console.error(`Software:\t${i}\nError: Download new version Error`)
            if (readlineSync.keyInYNStrict('do you want to open download url?')) cp.execSync(`start "" "${download}"`)
            continue
          }
          if ((_.specialMode[i] === 2 || (!software[i].commercial && _.mode === 2) || (software[i].commercial && _.commercialMode === 2)) && 'install' in software[i]) { // install
            if ('beforeInstall' in software[i]) await software[i].beforeInstall(output, iPath)
            let installed = await software[i].install(output, iPath)
            if (installed) {
              if ('afterInstall' in software[i]) await software[i].afterInstall(output, iPath)
              if (!_.preserveArchive) fse.unlinkSync(output)
              if (_.saveVersion) database[i].version = versionLatest
            }
          } else {
            console.error(`Software:\t${i}\nTarget\t${iPath}\nOutput:\t${output}`)
            if (readlineSync.keyInYNStrict('Show in Windows Explorer?')) cp.execSync(`start "" "explorer" /select,"${output}"`)
          }
        } else { // open url
          console.error(`New Version: ${versionLatest}\n${software[i].commercial ? i + ' is a commercial Software.\n' : ''}`)
          if (readlineSync.keyInYNStrict('Continue to open url?')) cp.execSync(`start "" "${software[i].url}"`)
        }
      } else {
        if (_.saveVersion) {
          database[i].version = versionLatest
        }
      }
      database[i].lasttime = new Date().getTime()
    }
    console.log('\n- - - - - - - - - - -\n')
    doBeforeExit()
  }
}

console.log('\n- - - - - - - - - - -\n')
init().then(() => {
  doBeforeExit()
}, (err) => {
  doBeforeExit()

  console.log('\n- - - - - - - - - - -\n')
  console.error('Error: ', err.message, '\n ', err.stack.replace(/[\r\n]/g, '{\\n}').match(/{\\n}\s+(at\s+.*)/m)[1].replace(/{\\n}\s+/g, '\n  '))
  process.exit(err)
})
