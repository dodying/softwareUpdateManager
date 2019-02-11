'use strict'

let data = {
  url: 'https://www.blender.org/download/',
  preferPath: 'blender.exe',
  version: {
    selector: '.dl-header-info>li',
    match: /v(.*)/
  },
  download: {
    func: async (res, $) => $('.dl-header-cta-button').attr('href').replace('download', 'release').replace('www', 'download').replace(/\/$/, '')
  },
  install: function (output, iPath) {
    return require('./../js/install_msi')(output, iPath, null, data.preferPath)
  }
}
module.exports = data
