'use strict'

let data = {
  url: 'http://l.acesheep.com/bili/re.php?callback=?',
  version: {
    selector: 'body'
  },
  download: {
    func: (res, $) => $('body').text().match(/"u":"(.*?)"/)[1].replace(/\\/g, '')
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
