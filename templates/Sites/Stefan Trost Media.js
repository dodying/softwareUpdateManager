'use strict'

let data = {
  version: ['td:contains("Last Update")+td', 'text', /(.*)/],
  changelog: {
    url: '[href$="-changelog"]',
    selector: 'main>ul>li'
  },
  download: (res, $) => `https://www.sttmedia.com/downloads/${$('.dl-empf-win>a,.dl-def-win>a').eq(0).attr('href').match(/download=(.*)/)[1]}.zip`
}
module.exports = data
