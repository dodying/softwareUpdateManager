'use strict';

const ignoreWordRe = /(readme|snapshot|^\.+)/gi;

const compareNumberLike = (a, b) => { // 比较 1.2.3 这样类似数字的文字
  if (a === b) return 0;
  a = String(a).trim().toLowerCase().split(/\.+/);
  b = String(b).trim().toLowerCase().split(/\.+/);
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (!(+a[i] === +b[i])) return +a[i] > +b[i] ? -1 : 1;
  }
  return 0; // 相同
};

const compare = (a, b) => { // a大于b，返回-1(前移)；等于，返回0；小于，返回1(后移)
  a = String(a).trim().toLowerCase().split(/[^\da-z.]/i);
  b = String(b).trim().toLowerCase().split(/[^\da-z.]/i);
  const numberLikeStartRe = /^\d+[\d.]*/;
  const numberLikeRe = /\d+[\d.]*/;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) continue;

    if (a[i].match(ignoreWordRe) || b[i].match(ignoreWordRe)) {
      return a[i].match(ignoreWordRe) ? 1 : -1;
    }

    const [aNLS, bNLS] = [a[i].match(numberLikeStartRe), b[i].match(numberLikeStartRe)];
    const [aNL, bNL] = [a[i].match(numberLikeRe), b[i].match(numberLikeRe)];

    if (aNLS && bNLS) { // 1.都以数字开头
      const sorted = compareNumberLike(aNLS[0], bNLS[0]);
      return sorted === 0 ? (a[i] > b[i] ? -1 : 1) : sorted;
    } else if (aNLS || bNLS) { // 1.一方以数字开头，则一方大
      return aNLS ? -1 : 1;
    } else if (aNL && bNL) { // 1.都包含数字
      const sorted = compareNumberLike(aNL[0], bNL[0]);
      return sorted === 0 ? (a[i] > b[i] ? -1 : 1) : sorted;
    } else if (aNL || bNL) { // 1.一方包含数字
      return aNL ? -1 : 1;
    } else if (a[i].match(/^[a-z]+$/i) && b[i].match(/^[a-z]+$/i)) { // 1.都是字母
      return a[i] > b[i] ? -1 : 1;
    }
  }
  return a.length > b.length ? -1 : a.length === b.length ? 0 : 1;
};

/**
 * @description
 * @returns {(string | array)}
 * @param {(string | object)} selectors: selector, attr, match, matchCheck, sort
 */

const walkLink = async (link, fns, ...selectors) => {
  const uri = [];
  const res = [];
  const order = [];
  if (link instanceof require('http').IncomingMessage) {
    res.push(link);
    uri.push(link.request.uri.href);
  } else if (typeof link === 'string') {
    uri.push(link);
  } else {
    console.error('Error:\tNo Link Given');
    return false;
  }

  let uriLast = uri[0];

  for (let i = 0; i < selectors.length;) {
    uriLast = new URL(uri[i], uriLast).href;
    if (uri[i] && (!res[i] || res[i].request.uri.href !== uri[i])) {
      res[i] = await fns.req(uriLast);
      uriLast = res[i].request.uri.href;
    }
    const $ = fns.cheerio.load(res[i].body);
    if (!order[i]) order[i] = 0;

    let { selector, attr: attributeName, match, matchCheck, sort } = typeof selectors[i] === 'string' ? { selector: selectors[i] } : selectors[i];
    attributeName = attributeName || 'href';

    let eles;
    try {
      eles = $(selector).toArray();
    } catch (error) {
      console.error(`Error:\tSelector "${selector}" Invalid when "walkLink"`);
      return false;
    }

    if (eles.length === 0) {
      console.error(`Error:\tSelector "${selector}" Nothing when "walkLink"`);
      return false;
    }
    if (sort) eles = eles.sort((a, b) => compare($(a).text(), $(b).text()));
    console.debug(eles.map(i => $(i).text().trim()));

    let find = false;

    for (let j = order[i]; j < eles.length; j++) {
      const ele = eles[j];
      let attr;

      if (attributeName === 'text') {
        attr = $(ele).eq(0).text();
      } else if (attributeName === 'html') {
        attr = $.html($(ele).eq(0));
      } else {
        attr = $(ele).eq(0).attr(attributeName);
      }
      if (!attr) {
        console.error(`Error:\tAttribute "${attributeName}" Empty when "walkLink"`);
        return null;
      }
      attr = attr.trim();

      if (attr) {
        const matched = match ? attr.match(match) || decodeURIComponent(attr).match(match) : [attr, attr];
        const checked = matchCheck ? attr.match(matchCheck) || decodeURIComponent(attr).match(matchCheck) : [attr, attr];
        console.debug({ attr, match, matched: [].concat(matched), check: matchCheck, checked: [].concat(checked) });
        if (matched && matched[1] && checked) {
          order[i] = j;
          i = i + 1;
          if (i === selectors.length) {
            if (attr !== matched[1]) console.debug({ attr, matched: matched[1], match });
            if ((!match || match.source === '(.*)') && attributeName === 'href') matched[1] = new URL(matched[1], uriLast).href;
            return matched[1];
          } else {
            uri[i] = matched[1];
            find = true;
            break;
          }
        }
      }
    }

    if (!find) {
      if (i === 0) {
        return false;
      } else {
        i = i - 1;
        order[i] = order[i] + 1;
        continue;
      }
    }
  }
};

module.exports = walkLink;
