'use strict'

let data = {
  withoutHeader: true,
  url: 'http://www.pc6.com/softview/SoftView_105138.html',
  version: {
    selector: '[itemprop="version"]'
  },
  download: {
    func: async (res, $, fns, choice) => {
      let addressList = await fns.req('https://www.pc6.com/inc/SoftLinkType.js')
      addressList = addressList.body.match(/\{.*?\}/)[0]
      addressList = JSON.parse(addressList)

      let downInfo = res.body.match(/_downInfo=(\{.*?\})/)[1]
      downInfo = downInfo.replace(/(\{|,)([a-z]+):/gi, '$1"$2":')
      downInfo = JSON.parse(downInfo)

      let host = addressList['siteId_' + downInfo.TypeID].split('||')[1].split(',')[0]
      return host + downInfo.Address
    }
  },
  install: function (output, iPath, fns) {
    return fns.install(output, iPath)
  }
}
module.exports = data
