'use strict'

let data = {
  commercial: true,
  url: 'http://www.internetdownloadmanager.com/',
  version: {
    selector: 'img[src="home/new!.gif"]+font'
  },
  download: {
    selector: 'a[href*="idman"][href*=".exe"]',
    attr: 'href',
    output: '.exe'
  }
}
module.exports = data
