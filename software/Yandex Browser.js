'use strict'

let data = {
  url: 'https://browser.yandex.com/',
  version: {
    func: async (res, $) => JSON.parse(res.body.match(/, (\{"lang":"en",.*\}), true\);<\/script> /)[1]).browserVersion
  },
  download: {
    plain: 'https://browser.yandex.com/download/?full=1',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install')
  }
}
module.exports = data
