'use strict'

let data = {
  url: 'https://www.autoitscript.com/site/autoit/downloads/',
  version: {
    selector: '.entry-content table>tbody>tr>td'
  },
  download: {
    plain: 'https://www.autoitscript.com/cgi-bin/getfile.pl?autoit3/autoit-v3.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
