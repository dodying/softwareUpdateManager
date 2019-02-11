'use strict'

let data = {
  url: 'http://dejavu.narod.ru/hiddex.html',
  version: {
    selector: '.post_date',
    match: /version (.*) \(/
  },
  download: {
    plain: 'http://dejavu.narod.ru/hiddex.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_single')
  }
}
module.exports = data
