'use strict'

let data = {
  commercial: 2,
  url: 'https://www.filehorse.com/download-hotspot-shield/download/',
  version: {
    selector: '.pageing>li:nth-child(3)'
  },
  download: {
    selector: '#download_url_dlm',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_wix')(output, iPath, null, /HSS/)
  }
}
module.exports = data
