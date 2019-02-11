// 'use strict'

// let data = {
//   url: 'https://otp.landian.la/zh-cn/',
//   version: {
//     selector: '.templatemo_homewrapper p'
//   },
//   download: {
//     selector: '.templatemo_homewrapper a'
//   },
//   install: function (output, iPath) {
//     return require('./../js/install')(output, iPath)
//   }
// }
// module.exports = data
'use strict'

let data = {
  url: 'https://mirrors.yuntu.ca/office-tool/',
  version: {
    func: async (res, $) => $('.fb-n>a').map((i, j) => $(j).text()).toArray().filter(i => i.match('Office Tool')).reverse()[0].match(/Office Tool v(.*)\.zip/)[1]
  },
  download: {
    plain: 'https://mirrors.yuntu.ca/office-tool/Office%20Tool%20v{version}.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
