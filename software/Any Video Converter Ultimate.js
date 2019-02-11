'use strict'

let data = {
  commercial: true,
  useProxy: true,
  url: 'https://www.any-video-converter.com/products/for_video_ultimate/whatnew.php',
  version: {
    selector: '.number'
  },
  download: {
    plain: 'https://www.any-video-converter.com/avc-ultimate.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_inno')(output, iPath)
  }
}
module.exports = data
