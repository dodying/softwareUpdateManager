'use strict'

let data = {
  commercial: true,
  url: 'http://blog.utorrent.com/releases/windows/',
  version: {
    selector: '.entry-title'
  },
  download: {
    plain: 'http://download-hr.utorrent.com/track/stable/endpoint/utorrent/os/windows',
    output: '.exe'
  }
}
module.exports = data
