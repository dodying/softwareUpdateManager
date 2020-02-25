// ==Headers==
// @Name:               log
// @Description:        log
// @Version:            1.0.147
// @Author:             dodying
// @Created:            2019-11-04 13:28:10
// @Modified:           2019-11-7 12:23:31
// @Namespace:          https://github.com/dodying/Nodejs
// @SupportURL:         https://github.com/dodying/Nodejs/issues
// @Require:
// ==/Headers==
/* eslint-disable no-eval */

// 设置
// const _ = require('./config')

// 导入原生模块
const fs = require('fs')
// const path = require('path')

// 导入第三方模块

// Function

// Main
const main = async () => {
  let objRe = /\n\{\n?[\S\s]+?\n\}\n/m
  let arrRe = /\n\[\n?[\S\s]+?\n\]\n/m

  let ignoreError = [
    'Request return nothing',
    'Client network socket disconnected before secure TLS connection was established',
    'tunneling socket could not be established, cause=socket hang up',
    'socket hang up',
    'when "changelog"'
  ]

  let log = 'index.log'
  if (!fs.existsSync(log)) return
  log = fs.readFileSync(log, 'utf-8')
  let logArr1 = log.split('\n- - - - - - - - - - -\n')

  let logNew = []
  let logErrorNew = []
  for (let i of logArr1) {
    if (!i) continue
    let obj = { other: [], json: [] }

    for (let re of [objRe, arrRe]) {
      let jsonStr = i.match(re)
      while (jsonStr) {
        try {
          let json
          eval(`json=${jsonStr[0]}`)
          obj.json.push(json)
        } catch (error) {
          obj.other.push(jsonStr)
        }
        i = i.split(jsonStr).join('\n')
        jsonStr = i.match(re)
      }
    }

    let logArr2 = i.split('\n')
    for (let j of logArr2) {
      if (!j) continue
      if (j.match(/^(\S+):\s*(.*)$/)) {
        let matched = j.match(/^(\S+):\s*(.*)$/)
        if (matched[1] === 'Software') console.log(j)
        obj[matched[1]] = matched[1] in obj ? [].concat(obj[matched[1]], matched[2]) : matched[2]
      } else {
        obj['other'].push(j)
      }
    }
    if (obj.other.length === 0) delete obj.other
    if (obj.json.length === 0) delete obj.json
    if (Object.keys(obj).length > 0) {
      if (obj['Error']) {
        let error = [].concat(obj['Error'])
        let errorNew = []
        for (let i of error) {
          if (!(ignoreError.some(re => i.match(re)))) errorNew.push(i)
        }
        if (errorNew.length) {
          obj['Error'] = errorNew
          logErrorNew.push(obj)
          continue
        } else {
          // delete obj['Error']
        }
      }
      logNew.push(obj)
    }
  }
  fs.writeFileSync('log.json', JSON.stringify(logNew, null, 2))
  fs.writeFileSync('log-error.json', JSON.stringify(logErrorNew, null, 2))
}

main().then(async () => {
  //
}, async err => {
  console.error(err)
  process.exit()
})
