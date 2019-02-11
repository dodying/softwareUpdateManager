'use strict'

let data = {
  useProxy: true,
  url: 'http://blog.bahraniapps.com/gifcam/',
  version: {
    selector: 'a[title="GifCam.zip"]'
  },
  download: {
    plain: 'http://www.bahraniapps.com/apps/gifcam/gifcam.php',
    output: '.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
