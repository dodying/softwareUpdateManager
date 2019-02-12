'use strict'

let data = {
  // ?commercial:
  // 1. boolean: false=Free true=Commercial
  // 2. number: 0=Free 1=FreePersonal 2=Freemium 3=Commercial

  // ?useProxy: true/false,
  // ?withoutHeader: true/false,
  url: 'https://github.com/telegramdesktop/tdesktop/releases/latest',
  // ?preferPath: 'preferPath',
  version: {
    selector: '.muted-link.css-truncate'
    // ?attr:
    // 1. text or omitted => text()
    // 2. html => html()
    // 3. other => attr(other)
    //
    // ?match:
    // 1. omitted => /(\d+[\d.]+\d+)/[1]
    // 2. /other/ => /other/[1]
    // ---
    // or func: async (res, $, req, cheerio, choice) => { return version }
  },
  /**
   * download:
   * omitted => open url
   */
  download: {
    // --- mode 0 ---
    // plain: 'url/to/download'
    //   you can use variables with {}
    //   defined variables:
    //     version: the latest version
    //
    // --- mode 1 ---
    selector: 'a[href*="/releases/download/"][href$=".zip"]'
    // ?attr:
    // 1. omitted => attr('href')
    // 2. text => text()
    // 3. html => html()
    // 4. other => attr(other)
    //
    // ?match: '', // omitted => /(.*)/[1]
    //
    // --- mode 2 ---
    // func: async (res, $, req, cheerio, choice) => { return url }

    // ?output:
    // save to which extension, format: '.ext'
    // eg: output='.zip', it'll be named as 'Telegram-version.zip'
    // or omitted: extension according to download url
  },
  /**
   * omitted => install manually
   * install: async function(output, iPath, choice)
   * @returns {boolean} if install completed
   * @param {string} output the path to the install pack file.
   * @param {string} iPath the path to the bin file.
   */
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
  /**
   * beforeInstall: async function(output, iPath)
   * afterInstall: async function(output, iPath)
   */
  /**
   * other: object
   */
  /**
   * versionChoice
   * downloadChoice
   * installChoice
   */
}
module.exports = data
