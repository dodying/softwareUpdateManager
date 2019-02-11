'use strict'

let data = {
  url: 'https://www.sordum.org/7952/',
  version: {
    selector: '.entry-title'
  },
  download: {
    plain: 'https://www.sordum.org/files/dns-jumper/DnsJumper.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
