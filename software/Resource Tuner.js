'use strict'

let data = {
  commercial: 3,
  url: 'http://www.restuner.com/news-history.htm',
  version: {
    selector: '#content h1+p~p>b'
  },
  download: {
    plain: 'http://www.heaventools.com/download/rtsetup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
