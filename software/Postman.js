'use strict'

let data = {
  commercial: 2,
  url: 'https://dl.pstmn.io/api/version/notes?channel=stable',
  version: {
    func: async (res, $) => JSON.parse(res.body).notes[0].version
  },
  download: {
    plain: 'https://dl.pstmn.io/download/latest/win64',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install', 'full.nupkg', null, 'lib\\net45')
  }
}
module.exports = data
