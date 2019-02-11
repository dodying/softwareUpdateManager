'use strict'

let data = {
  url: 'https://dev.deluge-torrent.org/wiki/ReleaseNotes',
  version: {
    selector: '#DelugeReleaseNotes+p+p>a'
  },
  download: {
    plain: 'http://download.deluge-torrent.org/windows/deluge-{version}-win32-py2.7.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
