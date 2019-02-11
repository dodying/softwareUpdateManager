'use strict'

let data = {
  commercial: 2,
  url: 'https://www.filehorse.com/download-logmein-hamachi/download/',
  preferPath: 'hamachi-2-ui.exe',
  version: {
    selector: '.pageing>li:nth-child(3)'
  },
  download: {
    selector: '#download_url'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
