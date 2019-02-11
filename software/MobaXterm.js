'use strict'

let data = {
  commercial: 2,
  url: 'https://mobaxterm.mobatek.net/download-home-edition.html',
  version: {
    selector: '.btn_bleu'
  },
  download: {
    selector: '.btn_bleu'
  },
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
}
module.exports = data
