'use strict'

let data = {
  useProxy: true,
  // url: 'http://innounp.sourceforge.net/',
  url: 'https://sourceforge.net/projects/innounp/files/innounp/',
  version: {
    // selector: 'h2:contains("History")+p>b'
    selector: '.name'
  },
  download: {
    plain: 'https://sourceforge.net/projects/innounp/files/latest/download',
    output: '.rar'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
