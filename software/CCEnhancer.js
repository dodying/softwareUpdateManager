'use strict'

let data = {
  url: 'https://singularlabs.com/software/ccenhancer/download-ccenhancer/',
  version: {
    selector: '#post-970 > div > table > tbody > tr:nth-child(3) > td:nth-child(2)'
  },
  download: {
    selector: '#post-970 > div > table > tbody > tr:nth-child(3) > td:nth-child(3) > p > a',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
