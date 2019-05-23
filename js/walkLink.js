'use strict'

let compare = (a, b) => { // a大于b，返回-1(前移)；等于，返回0；小于，返回1(后移)
  a = String(a).trim().split(/[^\da-z]/i)
  b = String(b).trim().split(/[^\da-z]/i)
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) continue
    if (a[i].match(/^\d+$/) && b[i].match(/^\d+$/)) { // 都是数字或字母
      return +a[i] > +b[i] ? -1 : 1
    } else if (a[i].match(/^[a-z]+$/i) && b[i].match(/^[a-z]+$/i)) { // 都是或字母
      return a[i] > b[i] ? -1 : 1
    } else if (a[i].match(/^\d+$/) || b[i].match(/^\d+$/)) { // 一方是数字则一方大
      return a[i].match(/^\d+$/) ? -1 : 1
    } else if (a[i].match(/\d+/) && b[i].match(/\d+/)) { // 都包含数字
      return +a[i].match(/\d+/) > +b[i].match(/\d+/) ? -1 : 1
    } else if (a[i].match(/\d+/) || b[i].match(/\d+/)) { // 一方包含数字
      return a[i].match(/\d+/) ? -1 : 1
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
  let uri = []
  let res = []
  let order = []
  if (link instanceof require('http').IncomingMessage) {
    res.push(link)
  } else if (typeof link === 'string') {
    link.push(link)
  } else {
    console.error('Error:\tNo Link Given')
    return false
  }

  for (let i = 0; i < selectors.length;) {
    if (uri[i] && (!res[i] || res[i].request.uri.href !== uri[i])) res[i] = await fns.req(uri[i])
    let $ = fns.cheerio.load(res[i].body)
    if (!order[i]) order[i] = 0

    let { selector, attr: attributeName, match, matchCheck, sort } = typeof selectors[i] === 'string' ? { selector: selectors[i] } : selectors[i]
    let eles = $(selector).toArray()
    if (sort) eles = eles.sort((a, b) => compare($(a).text(), $(b).text()))

    let find = false

    for (let j = order[i]; j < eles.length; j++) {
      let ele = eles[j]
      let attr

      if (attributeName === 'text') {
        attr = $(ele).eq(0).text()
      } else if (attributeName === 'html') {
        attr = $(ele).eq(0).html()
      } else {
        attr = $(ele).eq(0).attr(attributeName || 'href')
      }
      attr = attr.trim()

      if (attr) {
        let matched = attr.match(match || /(.*)/)
        let checked = attr.match(matchCheck || /(.*)/)
        if (matched && matched[1] && checked) {
          order[i] = j
          i = i + 1
          if (i === selectors.length) {
            return matched[1]
          } else {
            uri[i] = matched[1]
            find = true
            break
          }
        }
      }
    }

    if (!find) {
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
