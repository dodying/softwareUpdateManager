'use strict'

let data = {
  url: 'https://filezilla-project.org/download.php?type=client',
  version: {
    selector: '.downloadscreenshot+p'
  },
  download: {
    selector: '#quickdownloadbuttonlink'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
