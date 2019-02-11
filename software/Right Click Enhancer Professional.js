'use strict'

let data = {
  commercial: true,
  useProxy: true,
  url: 'https://rbsoft.org/downloads/right-click-enhancer/rce-professional-changelog.html',
  version: {
    selector: '#section-changelog>h3'
  },
  download: {
    plain: 'https://rbsoft.org/downloads/right-click-enhancer/Right-Click-Enhancer-Professional.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
