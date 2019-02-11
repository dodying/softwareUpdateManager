'use strict'

let data = {
  url: 'https://www.nirsoft.net/utils/run_from_process.html',
  version: {
    selector: '.utilcaption'
  },
  download: {
    plain: 'https://www.nirsoft.net/utils/runfromprocess.zip'
  },
  install: function (output, iPath) {
    return require('./../../js/install_zipped')(output, iPath, 'install_single', 'x64.exe')
  }
}
module.exports = data
