'use strict'

let data = {
  url: 'http://truehumandesign.se/s_diffinity.php',
  version: {
    selector: '.downloadtable .menutd'
  },
  download: {
    plain: 'http://truehumandesign.se/dl.php?file=diffinityInstaller.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
