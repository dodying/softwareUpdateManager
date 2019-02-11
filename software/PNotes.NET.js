'use strict'

let data = {
  url: 'https://pnotes.sourceforge.io/index.php?page=5',
  version: {
    selector: 'body > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table.comparison > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td'
  },
  download: {
    selector: 'a[href*="/Bin/PNotes.NET"][href$=".zip/download"]'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
