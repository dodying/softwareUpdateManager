'use strict'

let data = {
  url: 'https://www.majorgeeks.com/mg/getmirror/iobit_unlocker,1.html',
  version: {
    selector: '.geekywraplight>h1'
  },
  download: {
    plain: 'https://www.majorgeeks.com/index.php?ct=files&action=download&',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../../js/install_inno_with_type')(output, iPath, null, {
      'IObitUnlockerExtension': '2',
      'IObitUnlocker': '9'
    })
  }
}
module.exports = data
