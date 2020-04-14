'use strict';

const data = {
  // withoutHeader: true,
  url: 'http://www.pc6.com/softview/SoftView_105138.html',
  version: '[itemprop="version"]',
  // changelog: '.introTit:contains("更新日志")+p',
  changelog: {
    selector: '#soft-intro',
    attr: 'text',
    match: /^更新日志/,
    split: true
  },
  download: async (res, $, fns, choice) => {
    let addressList = await fns.req('https://www.pc6.com/inc/SoftLinkType.js');
    addressList = addressList.body.match(/\{.*?\}/)[0];
    addressList = JSON.parse(addressList);

    let downInfo = res.body.match(/_downInfo=(\{.*?\})/)[1];
    downInfo = downInfo.replace(/(\{|,)([a-z]+):/gi, '$1"$2":');
    downInfo = JSON.parse(downInfo);

    const host = addressList['siteId_' + downInfo.TypeID].split('||')[1].split(',')[0];
    return downInfo.Address.match(/^https?:\/\//) ? downInfo.Address : host + downInfo.Address;
  }
};
module.exports = data;
