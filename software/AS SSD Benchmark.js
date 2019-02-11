'use strict'

let data = {
  url: 'https://www.alex-is.de/PHP/fusion/downloads.php?download_id=9',
  version: {
    selector: 'h2'
  },
  download: {
    plain: 'https://www.alex-is.de/PHP/fusion/downloads.php?cat_id=4&file_id=9',
    output: 'zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
