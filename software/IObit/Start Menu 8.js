'use strict'

let data = {
  url: 'https://www.majorgeeks.com/mg/getmirror/start_menu_8,1.html',
  version: {
    selector: '.geekywraplight>h1'
  },
  download: {
    plain: 'https://www.majorgeeks.com/index.php?ct=files&action=download&',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../../js/install_inno')(output, iPath, null, { '{code_CustomDefaultDir}': require('path').parse(iPath).dir })
  }
}
module.exports = data
