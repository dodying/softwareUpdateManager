'use strict'

let data = {
  url: 'https://github.com/giuspen/cherrytree/releases',
  version: {
    selector: '.commit-title>a'
  },
  download: {
    plain: 'http://www.giuspen.com/software/cherrytree_{version}_setup.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
