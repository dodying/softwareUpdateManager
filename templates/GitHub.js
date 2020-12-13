'use strict';

let release, filterFile, latest;
const urlRe = /:\/\/github.com\/([^/]+\/[^/]+)\/releases(\/tag|\/latest)?/;

const data = {
  // url: 'https://api.github.com/repos/aria2/aria2/releases',
  url: (url) => {
    url = new URL(url, 'https://github.com');
    if (url.href.match(urlRe)) {
      let repo;
      [, repo, latest] = url.href.match(urlRe);
      // if (latest) console.warn('Latest:\tTrue');
      url.href = `https://api.github.com/repos/${repo}/releases`;
    }
    url.search = 'sort=pushed&per_page=100';
    return url.href;
  },
  version: async (res, $, fns, choice = [/.zip$/]) => {
    // res.json = res.json.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime()).reverse();

    if (typeof choice === 'function') {
      choice = { filter: choice };
    } else if (choice && (typeof choice === 'string' || choice instanceof Array || choice instanceof RegExp)) {
      choice = [].concat(choice);
      choice = {
        filterFile: choice[0],
        match: choice[1],
        prerelease: choice[2] || (latest ? false : undefined),
        attr: choice[3] || 'tag_name' // published_at name created_at
      };
    }
    filterFile = new RegExp(choice.filterFile, 'i');

    const filter = choice.filter || function (i) {
      const matched = i.assets.some(j => j.name.match(filterFile));
      if (matched) {
        if (!([true, false].includes(choice.prerelease))) {
          return true;
        } else {
          return matched && i.prerelease === choice.prerelease;
        }
      } else {
        return false;
      }
    };

    release = res.json.filter(filter);
    if (release.length === 0) {
      const baseurl = res.request.uri.href;
      let page = 2;
      while (release.length === 0) {
        const res = await fns.req(`${baseurl}&page=${page}`);
        if (res.json.length === 0) return false;
        release = res.json.filter(filter);
        page = page + 1;
      }
    }
    release = release[0];
    if (res.json.indexOf(release) > 5) console.warn(`Index:\t${res.json.indexOf(release)}`);

    // if (res.json.indexOf(release) !== 0) {
    //   if (fns.info.other && Object.values(fns.info.other).findIndex(i => i.site && i.site.GitHub.match(/\/releases$/)) >= 0) console.log('Release:\tBeta');
    //   const index = res.json.indexOf(release);
    //   const text = res.json.slice(0, index).map(i => {
    //     const filter = filterFile && i.assets.some(j => j.name.match(filterFile));
    //     const text = [
    //       i.prerelease ? '[PR]' : '[Stable]',
    //       i.tag_name,
    //       ': ',
    //       filter ? '[filter]' : '',
    //       i.assets.filter(j => {
    //         return filter ? j.name.match(filterFile) : !(j.name.match(/\.(dmg|gz|AppImage|ya?ml|rpm|deb|xz|txt|apk|ipa|crx|xpi)$|darwin|linux/i));
    //       }).map(j => j.name).join(' | ')
    //     ];
    //     return text.join('');
    //   }).join('\n');
    //   console.error(`Release:\t${text}`);
    // }
    // if (choice.prerelease === undefined && release.prerelease === true && res.json.findIndex(i => i.prerelease === false && i.assets.some(j => j.name.match(filterFile))) !== -1) {
    //   console.error('Stable-Release:\tTrue');
    // }
    // if (!latest && !release.prerelease && !fns.info.raw.site.GitHub.match(/\/latest$/)) {
    //   console.error('Stable-Release:\tTrue');
    // }

    let text;
    if (!choice.attr || typeof choice.attr === 'string') {
      text = release[choice.attr || 'tag_name'];
    } else if (typeof choice.attr === 'function') {
      text = choice.attr(release);
    } else {
      return false;
    }

    if (choice.match) {
      return text.match(choice.match)[1];
    } else if (text.match(/^v\.?(.*)$/i)) {
      return text.match(/^v\.?(.*)$/i)[1];
    } else {
      return text;
    }
  },
  changelog: async (res, $) => release.body,
  download: async (res, $, fns, choice = [filterFile]) => {
    choice = [].concat(choice);
    const url = release.assets.filter(i => i.name.match(choice[0] || /.zip$/))[0].browser_download_url;
    return choice[1] ? [url, choice[1]] : url;
  }
};
module.exports = data;
