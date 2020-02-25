'use strict'

let info

let data = {
  url: 'https://api.bitbucket.org/2.0/repositories/AsionTang/67.yeapkbatchrename/downloads',
  version: (res, $, fns, choice) => {
    let match = choice || /.zip$/
    info = res.json.values.filter(i => i.name.match(match)).sort((a, b) => {
      a = (new Date(a.created_on)).getTime()
      b = (new Date(b.created_on)).getTime()
      return a > b ? -1 : a < b ? 1 : 0
    })[0]
    return info.name.match(match)[1]
  },
  download: () => info.links.self.href
}
module.exports = data
