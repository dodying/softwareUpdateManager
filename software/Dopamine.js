'use strict'

let data = {
  url: 'https://www.digimezzo.com/content/software/dopamine/',
  version: {
    selector: '.file a[href*="(Release)"][href$="Portable.zip"]'
  },
  download: {
    selector: '.file a[href*="(Release)"][href$="Portable.zip"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
