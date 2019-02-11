'use strict'

let data = {
  url: 'https://raw.githubusercontent.com/meganz/MEGAcmd/master/build/megacmd/megacmd.changes',
  version: {
    selector: 'body',
    match: /- Update to version (\d+[\d.]+\d+):/
  },
  download: {
    plain: 'https://mega.nz/MEGAcmdSetup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
