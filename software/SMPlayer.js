'use strict'

let data = {
  url: 'https://sourceforge.net/projects/smplayer/files/SMPlayer/',
  version: {
    selector: '#files_list > tbody > tr:nth-child(1) > th > a > span'
  },
  download: {
    plain: 'https://sourceforge.net/projects/smplayer/files/SMPlayer/{version}/smplayer-portable-{version}.0-x64.7z/download'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
