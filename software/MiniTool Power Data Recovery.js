'use strict'

let data = {
  commercial: 2,
  url: 'https://www.minitool.com/data-recovery-software/upgrade-history.html',
  version: {
    selector: '.timeline-item>h3+p'
  },
  download: {
    selector: 'a[href*="download"][href$=".exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno_with_type')(output, iPath)
  }
}
module.exports = data
