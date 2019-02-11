'use strict'

let data = {
  commercial: 2,
  url: 'https://www.minitool.com/backup/upgrade-history.html',
  version: {
    selector: '.sm-upgrade-history>h3'
  },
  download: {
    selector: 'a[href*="download"][href$=".exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno_with_type')(output, iPath)
  }
}
module.exports = data
