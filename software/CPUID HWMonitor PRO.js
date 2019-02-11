'use strict'

let data = {
  commercial: 3,
  url: 'https://www.cpuid.com/softwares/hwmonitor-pro.html',
  version: {
    selector: '#download h4+.subtitle'
  },
  download: {
    func: async (res, $) => 'http://download.cpuid.com' + $('#download .icon-zip[href$=".zip"]').attr('href').replace('/downloads', '').replace('http://www.cpuid.com', '')
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
