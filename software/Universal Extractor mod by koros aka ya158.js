'use strict'

let data = {
  url: 'http://forum.oszone.net/thread-295084.html',
  version: {
    func: async (res, $) => $('.fieldset>div>b:nth-child(3)').eq(0).text().split('-').reverse().join('-')
  }
}
module.exports = data
