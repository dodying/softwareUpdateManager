'use strict'

let data = {
  url: 'https://github.com/Microsoft/vscode/releases',
  version: {
    selector: '.commit-title a'
  },
  download: {
    plain: 'https://go.microsoft.com/fwlink/?Linkid=850641',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
