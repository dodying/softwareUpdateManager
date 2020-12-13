'use strict';

let artifact;
const urlRe = /:\/\/github.com\/([^/]+\/[^/]+)/;

const data = {
  // url: 'https://api.github.com/repos/containerd/containerd/actions/artifacts',
  url: (url) => {
    url = new URL(url, 'https://github.com');
    if (url.href.match(urlRe)) {
      const [, repo] = url.href.match(urlRe);
      url.href = `https://api.github.com/repos/${repo}/actions/artifacts`;
    }
    url.search = 'per_page=100';
    return url.href;
  },
  version: async (res, $, fns, choice) => {
    artifact = res.json.artifacts.find(i => i.name.match(choice) && !i.expired);
    if (artifact) return artifact.id;
  },
  download: async (res, $, fns, choice) => {
    const request = require(fns.dirname + '\\config').request;
    if (!request.github) {
      console.error('Error:\tPlease set "request.github" in config');
      return;
    }
    artifact = choice ? res.json.artifacts.find(i => i.name.match(choice) && !i.expired) : artifact;
    if (!artifact) return;
    const res1 = await fns.req({
      headers: {
        Authorization: `token ${request.github}`,
        'User-Agent': request.userAgent
      },
      uri: artifact.archive_download_url,
      followRedirect: false
    });
    return res1.headers.location;
  }
};
module.exports = data;
