'use strict'

let data = {
  commercial: 2,
  url: 'https://www.wisecleaner.com/wise-care-365.html',
  version: {
    selector: '#free-download+p'
  },
  download: {
    plain: 'http://downloads.wisecleaner.com/soft/WiseCare365.exe'
  },
  install: function (output, iPath) {
    return require('./../../js/install_inno')(output, iPath)
  }
}
module.exports = data
