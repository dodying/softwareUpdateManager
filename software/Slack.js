'use strict'

let data = {
  commercial: 2,
  url: 'https://slack.com/downloads/windows',
  version: {
    selector: '.download-meta>strong'
  },
  download: {
    plain: 'https://downloads.slack-edge.com/releases_x64/SlackSetup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install', 'full.nupkg', null, 'lib\\net45')
  }
}
module.exports = data
