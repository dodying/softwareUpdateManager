'use strict'

let data = {
  url: 'http://ftp.gnome.org/pub/GNOME/binaries/win64/gedit/',
  preferPath: 'bin/gedit.exe',
  version: {
    selector: 'a[href^="gedit-x86_64"][href$=".msi"]',
    attr: 'href',
    match: /-(\d+[\d.]+\d+).msi$/
  },
  download: {
    selector: 'a[href^="gedit-x86_64"][href$=".msi"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
