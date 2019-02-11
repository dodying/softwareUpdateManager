'use strict'

let data = {
  url: 'http://www.1space.dk/executor/downloadlinks.html',
  version: {
    selector: '#download > ul > li:nth-child(1)',
    match: /(\d+[\d.]+\w+)\s/
  },
  download: {
    plain: 'http://www.1space.dk/executor/Executor64bit.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
