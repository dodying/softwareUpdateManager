'use strict'

let data = {
  url: 'https://www.majorgeeks.com/mg/getmirror/iobit_driver_booster,1.html',
  version: {
    selector: '.geekywraplight>h1'
  },
  download: {
    plain: 'https://www.majorgeeks.com/index.php?ct=files&action=download&',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../../js/install_inno')(output, iPath)
  },
  afterInstall: function (output, iPath) {
    let path = require('path')
    let fse = require('fs-extra')

    let parentPath = path.parse(iPath).dir
    let parentPath2 = path.parse(parentPath).dir

    fse.moveSync(path.join(parentPath, '{cm_AppVer}'), path.join(parentPath2, 'Driver Booster-Main'))
    fse.removeSync(parentPath)
    fse.moveSync(path.join(parentPath2, 'Driver Booster-Main'), parentPath)
  }
}
module.exports = data
