'use strict'

let release, filterFile

let data = {
  url: 'https://api.github.com/repos/aria2/aria2/releases',
  version: async (res, $, fns, choice = {}) => {
    if (typeof choice === 'function') {
      choice = { filter: choice }
    } else if (choice && (typeof choice === 'string' || choice instanceof Array || choice instanceof RegExp)) {
      choice = [].concat(choice)
      choice = { filterFile: choice[0], match: choice[1], prerelease: choice[2] }
    }
    filterFile = choice.filterFile

    let filter = choice.filter || function (i) {
      let matched = i.assets.some(j => j.name.match(choice.filterFile || /.zip$/))
      if (matched) {
        if (choice.prerelease === undefined) {
          return true
        } else {
          return matched && i.prerelease === choice.prerelease
        }
      } else {
        return false
      }
    }

    release = res.json.filter(filter)
    if (release.length === 0) {
      let baseurl = res.request.uri.href
      let page = 2
      while (release.length === 0) {
        let res = await fns.req(`${baseurl}?page=${page}`)
        if (res.json.length === 0) return false
        release = res.json.filter(filter)
        page = page + 1
      }
    }
    release = release[0]

    let text = release.tag_name
    console.debug({ text, match: choice.match })
    if (choice.match) {
      return text.match(choice.match)[1]
    } else if (text.match(/^v(.*)$/)) {
      return text.match(/^v(.*)$/)[1]
    } else {
      return text
    }
  },
  changelog: async (res, $) => release.body,
  download: async (res, $, fns, choice = filterFile) => release.assets.filter(i => i.name.match(choice || /.zip$/))[0].browser_download_url
}
module.exports = data
