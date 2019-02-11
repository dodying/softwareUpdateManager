'use strict'

let data = {
  url: 'https://antibody-software.com/web/software/software/wizmouse-makes-your-mouse-wheel-work-on-the-window-under-the-mouse/',
  version: {
    selector: '.smalldark'
  },
  download: {
    selector: 'a[href*="/files/"]'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
