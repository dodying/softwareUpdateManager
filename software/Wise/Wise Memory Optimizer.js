'use strict'

let data = {
  url: 'https://www.wisecleaner.com/wise-memory-optimizer.html',
  version: {
    selector: '#free-download+p'
  },
  download: {
    plain: 'http://downloads.wisecleaner.com/soft/WMOSetup.exe'
  },
  install: function (output, iPath) {
    return require('./../../js/install_inno_with_type')(output, iPath)
  }
}
module.exports = data
