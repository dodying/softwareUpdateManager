'use strict'

let data = {
  commercial: 2,
  url: 'https://www.partitionwizard.com/upgrade-history.html',
  version: {
    selector: '.upgrade-v>h2'
  },
  download: {
    selector: 'a[href*="download"][href$=".exe"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno_with_type')(output, iPath)
  }
}
module.exports = data
