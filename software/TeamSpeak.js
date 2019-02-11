'use strict'

let data = {
  commercial: 2,
  url: 'https://www.teamspeak.com/en/downloads/',
  version: {
    selector: '#client > div.platform.mb-5.windows > div:nth-child(3) > div.file.col-md-7 > h3 > span'
  },
  download: {
    selector: 'a[href*="win64"][href$=".exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
