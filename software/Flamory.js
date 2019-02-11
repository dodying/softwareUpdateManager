'use strict'

let data = {
  commercial: 1,
  url: 'https://filehippo.com/zh/download_flamory/',
  version: {
    selector: '.title-text>span:nth-child(2)',
    match: /(.*)/
  },
  download: {
    plain: 'http://flamory.com/get',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_ai')(output, iPath, null, 'App')
  }
}
module.exports = data
