'use strict'

let data = {
  commercial: 3,
  url: 'https://www.conceptworld.com/RecentX/RevisionHistory',
  version: {
    selector: 'p>strong'
  },
  download: {
    plain: 'https://www.conceptworld.com/Downloads/RecentX/RecentXProgramFiles.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
