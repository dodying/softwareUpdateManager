'use strict'

let data = {
  commercial: 1,
  url: 'https://www.stremio.com/downloads',
  version: {
    selector: '#dl-win-four'
  },
  download: {
    plain: 'https://www.strem.io/download?platform=windows&four=true',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
