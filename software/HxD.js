'use strict'

let data = {
  url: 'https://mh-nexus.de/en/downloads.php?product=HxD20',
  version: {
    selector: 'body > div > div.maincontent > table:nth-child(5) > tbody > tr:nth-child(2) > td:nth-child(3)'
  },
  download: {
    plain: 'https://mh-nexus.de/downloads/HxDSetup.zip'
  },
  install: function (output, iPath) {
    return require('./../js/install_zipped')(output, iPath, 'install_inno_with_type', null, 'HxD.exe', require('./../config').locale.match(/^zh/i) ? '2' : '3')
  }
}
module.exports = data
/**
 * 1:deu
 * 2:chs
 * 3:enu
 * 4:fra
 * 5:ita
 * 6:plk
 * 7:kor
 */
