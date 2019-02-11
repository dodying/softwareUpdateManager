'use strict'

let data = {
  url: 'https://www.ntrun.com/',
  version: {
    selector: '.num',
    match: /软件版本：(\d+[\d.]+\d+)/
  }
}
module.exports = data
