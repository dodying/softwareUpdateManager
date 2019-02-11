'use strict'

let data = {
  url: 'https://enigmaprotector.com/en/downloads/changelogenigmavb.html',
  version: {
    selector: 'a[onclick="return openclose(\'content0\');"]',
    match: /(.*)/
  },
  download: {
    plain: 'https://enigmaprotector.com/assets/files/enigmavb.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath, 'languages')
  }
}
module.exports = data
