'use strict'

let data = {
  url: 'https://www.sordum.org/8501/',
  version: {
    selector: '.entry-title'
  },
  download: {
    plain: 'https://www.sordum.org/files/drive-letter-changer/dChanger.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
