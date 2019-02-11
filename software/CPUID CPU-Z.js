'use strict'

let data = {
  url: 'https://www.cpuid.com/softwares/cpu-z.html',
  version: {
    selector: '#download h4+.subtitle'
  },
  download: {
    func: async (res, $) => 'http://download.cpuid.com' + $('#download .icon-zip[href$="cn.zip"]').attr('href').replace('/downloads', '').replace('http://www.cpuid.com', '')
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
