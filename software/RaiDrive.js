'use strict'

let data = {
  url: 'https://www.raidrive.com/download/',
  version: {
    selector: '#post-560 > div > div > div > div:nth-child(1) > div > div:nth-child(4) > div:nth-child(1) > strong'
  },
  download: {
    plain: 'https://www.raidrive.com/download.latest.php',
    output: '.exe'
  }
}
module.exports = data
