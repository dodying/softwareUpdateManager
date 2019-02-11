'use strict'

let data = {
  commercial: 2,
  url: 'https://forum.odrive.com/c/release-notes',
  version: {
    func: async (res, $) => JSON.parse(JSON.parse($('#data-preloaded').attr('data-preloaded'))['topic_list_c/release-notes/l/latest'])['topic_list']['topics'].filter(i => i.title.match('Win v'))[0].title.match(/Win v.(\d+)/)[1]
  },
  download: {
    plain: 'https://www.odrive.com/downloaddesktop?platform=win',
    output: '.exe'
  },
  install: function (output, iPath) {
    return require('./../js/install_wix')(output, iPath, null, 'odrive.x64')
  }
}
module.exports = data
