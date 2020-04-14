'use strict';

const data = {
  url: 'https://ci.appveyor.com/api/projects/derceg/explorerplusplus',
  version: (res, $) => res.json.build.version,
  changelog: async (res, $) => res.json.build.message + '\n' + (res.json.build.messageExtended || ''),
  download: async (res, $, fns, choice = {}) => {
    if (choice && (typeof choice === 'string' || choice instanceof Array || choice instanceof RegExp)) {
      choice = [].concat(choice);
      choice = { filterFile: choice[0], match: choice[1] };
    }

    let job = res.json.build.jobs.filter(i => i.osType === 'Windows' && choice.match ? i.name.match(choice.match) : true);
    job = job[0];

    const res1 = await fns.req(`https://ci.appveyor.com/api/buildjobs/${job.jobId}/artifacts`);
    let file = choice.filterFile ? res1.json.filter(i => i.fileName.match(choice.filterFile)) : res1.json;
    file = file[0];
    return `${res.request.uri.href}/artifacts/${file.fileName}${job.name ? '?job=' + encodeURIComponent(job.name) : ''}`; // branch=master&
  }
};
module.exports = data;
