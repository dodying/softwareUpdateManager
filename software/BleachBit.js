'use strict'

let data = {
  url: 'https://www.bleachbit.org/download/windows',
  version: {
    selector: '#node-10 > div > div > div > div > p'
  },
  download: {
    func: async (res, $) => 'https://download.bleachbit.org/' + $('a[href$="portable.zip"]').eq(0).attr('href').match(/file=(.*)$/)[1]
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
