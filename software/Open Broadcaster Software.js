'use strict'

let data = {
  url: 'https://obsproject.com/download',
  version: {
    selector: '#win_blurb .dl_ver'
  },
  download: {
    selector: '#win_blurb a.green_btn'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
