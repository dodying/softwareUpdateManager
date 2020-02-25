'use strict'

let data = {
  version: '.entry-title',
  changelog: '.entry-content>p:contains("What is New"),.entry-content>p:contains("What’s New"),.entry-content>p:contains("What is new"),.entry-content>p:contains("Changelog"),',
  download: async (res, $, fns, choice) => 'https://www.sordum.org/files/downloads.php' + $('[href*="/downloads/?"]').eq(0).attr('href').match(/\?.*$/)[0]
}
module.exports = data
