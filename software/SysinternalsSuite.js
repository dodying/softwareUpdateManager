'use strict'

let data = {
  url: 'https://docs.microsoft.com/en-us/sysinternals/downloads/sysinternals-suite',
  version: {
    selector: '#main > p:nth-child(4)',
    match: /Updated: (.*)/
  },
  download: {
    plain: 'https://download.sysinternals.com/files/SysinternalsSuite.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
