'use strict'

const readlineSync = require('readline-sync')

var dictG = {}
let getValue = (key, dict) => {
  dict = dict || dictG
  if (!(key in dict)) {
    dict[key] = readlineSync.question(`${key}=`, {
      defaultInput: '{' + key + '}'
    })
  }
  return String(dict[key])
}

let replace = (str, dict) => {
  let re = /((?!\\)[{}])/g
  let arr = str.split(re).filter(i => i)
  while (arr.length >= 3 && arr.includes('{') && arr.includes('}')) {
    for (let i = 0; i < arr.length - 2; i++) {
      if (arr[i] === '{' && arr[i + 2] === '}') {
        if ((i > 0 && arr[i - 1].match(/\\$/)) || arr[i + 1].match(/\\$/)) {
          if (arr[i + 1].match(/\\$/)) arr.splice(i + 1, 2, arr[i + 1].substr(0, arr[i + 1].length - 1) + '}')
          if ((i > 0 && arr[i - 1].match(/\\$/))) arr.splice(i - 1, 2, arr[i - 1].substr(0, arr[i - 1].length - 1) + '{')
        } else {
          arr.splice(i, 3, getValue(arr[i + 1], dict))
        }
      } else if (!['{', '}'].includes(arr[i]) && !['{', '}'].includes(arr[i + 1])) {
        arr.splice(i, 2, arr[i] + arr[i + 1])
      }
    }
  }
  return arr.join('')
}
replace.init = dict => {
  dictG = dict
}
replace.assign = dict => {
  dictG = Object.assign(dictG, dict || {})
}

module.exports = replace
