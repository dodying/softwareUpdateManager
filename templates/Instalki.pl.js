'use strict'

let data = {
  url: 'https://www.instalki.pl/programy/pobierz/Windows/komunikatory/Discord.html',
  version: {
    selector: '.breadcrumbs'
  },
  download: {
    selector: '#link'
  },
  install: function (output, iPath, fns) {
    return fns.install(output, iPath)
  }
}
module.exports = data
