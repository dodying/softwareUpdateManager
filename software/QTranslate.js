'use strict'

let data = {
  useProxy: true,
  url: 'https://quest-app.appspot.com/',
  version: {
    selector: 'a[title="Download QTranslate"]'
  },
  download: {
    selector: 'a[title="Download QTranslate"]',
    attr: 'href'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
