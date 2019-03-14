'use strict'

let compare = (a, b) => { // a大于b，返回-1(前移)；等于，返回0；小于，返回1(后移)
  a = String(a).split(/[^\da-z]/i)
  b = String(b).split(/[^\da-z]/i)
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) continue
    if ((a[i].match(/^\d+$/) && b[i].match(/^\d+$/))) { // 都是数字或字母
      return +a[i] > +b[i] ? -1 : 1
    } else if ((a[i].match(/^[a-z]+$/i) && b[i].match(/^[a-z]+$/i))) { // 都是或字母
      return a[i] > b[i] ? -1 : 1
    } else if (a[i].match(/^\d+$/) || b[i].match(/^\d+$/)) { // 一方是数字则一方大
      return a[i].match(/^\d+$/) ? -1 : 1
    }
  }
  return a.length > b.length ? -1 : a.length === b.length ? 0 : 1
}

/**
 * @description
 * @returns {(string | array)}
 * @param {(string | object)} selectors
 */

let walkLink = async (link, fns, ...selectors) => {
  let uri = [link]
  let res = []
  let order = []

  for (let i = 0; i < selectors.length;) {
    console.log(uri[i])
    if (!res[i] || res[i].request.uri.href !== uri[i]) res[i] = await fns.req(uri[i])
    let $ = fns.cheerio.load(res[i].body)
    if (!order[i]) order[i] = 0

    let { selector, attr: attributeName, match, sort } = typeof selectors[i] === 'string' ? { selector: selectors[i] } : selectors[i]
    let ele = $(selector).toArray()
    if (sort) ele = ele.sort((a, b) => compare($(a).text(), $(b).text()))
    let error = false
    if (!ele.length) {
      error = true
    } else if (ele.length <= order[i]) {
      error = true
    } else {
      ele = ele[order[i]]
      let attr

      if (attributeName === 'text') {
        attr = $(ele).eq(0).text()
      } else if (attributeName === 'html') {
        attr = $(ele).eq(0).html()
      } else {
        attr = $(ele).eq(0).attr(attributeName || 'href')
      }
      if (attr) {
        let matched = attr.trim().match(match || /(.*)/)[1]
        if (matched) {
          i = i + 1
          if (i === selectors.length) {
            return matched
          } else {
            uri[i] = matched
            continue
          }
        } else {
          error = true
        }
      } else {
        error = true
      }
    }
    if (error) {
      if (i === 0) {
        return false
      } else {
        i = i - 1
        order[i] = order[i] + 1
        continue
      }
    }
  }
}

module.exports = walkLink
