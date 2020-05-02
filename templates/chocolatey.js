'use strict';

let software, version;

const data = {
  version: async (res, $, fns, choice) => {
    let versionPerfer;
    [software, versionPerfer] = [].concat(choice || []);
    if (!software) {
      if (res.request.uri.href.match(/:\/\/chocolatey.org\/packages\/(.*?)([?#]|$)/)) {
        software = res.request.uri.href.match(/:\/\/chocolatey.org\/packages\/(.*?)([?#]|$)/)[1];
      }
    }
    const res1 = await fns.req({
      // uri: `https://chocolatey.org/api/v2/Packages()?$filter=(tolower(Id) eq '${software}')`,
      uri: `https://chocolatey.org/api/v2/FindPackagesById()?id='${software}'`,
      method: 'GET',
      headers: {
        'User-Agent': 'Chocolatey Core',
        Accept: 'application/atom+xml,application/xml',
        'Accept-Charset': 'UTF-8',
        Host: 'chocolatey.org'
      }
    });
    const $1 = fns.cheerio.load(res1.body);
    const versions = $1('feed>entry m\\:properties>d\\:Version').toArray().map(i => $(i).text());
    const latestVersion = $1('feed>entry:has(d\\:IsLatestVersion:contains(true)) m\\:properties>d\\:Version').text();
    version = versionPerfer && versions.includes(versionPerfer) ? versionPerfer : latestVersion;
    return version;
  },
  download: () => `https://chocolatey.org/api/v2/package/${software}/${version}`
};
module.exports = data;
