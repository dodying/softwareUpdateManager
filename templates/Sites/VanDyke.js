'use strict';

const data = {
  version: ['#download-tabs>h4', 'text', /([\d.]+.*?)\s-/],
  changelog: async (res, $, fns, choice) => {
    const uri1 = $('.list [href$="history.txt"]').eq(0).attr('href');
    const res1 = await fns.req(uri1);
    let changelog = res1.body;

    const lineArr = changelog.trim().split(/\n/);
    const split = lineArr.filter(line => line.match(/^Changes in/));
    const start = lineArr.indexOf(split[0]);
    if (start === -1) return null;
    let end = lineArr.indexOf(split[1]);
    end = end === -1 ? lineArr.length : end;
    changelog = lineArr.slice(start, end).join('\n');
    return changelog;
  },
  download: async (res, $, fns, choice) => {
    const pid = $(`.filename>a:contains(".exe")${choice || ''}`).eq(0).attr('href').match(/pid=(.*?)(&|$)/)[1];

    await fns.req({
      uri: 'https://www.vandyke.com/cgi-bin/account_verify.php',
      method: 'POST',
      form: {
        pid: pid,
        action: 'download',
        username: 'dbarry112@mailinator.com',
        password: '28decc',
        status: '5',
        privacy_stmt: 'agree'
      }
    });

    return [`https://www.vandyke.com/cgi-bin/download.php?pid=${pid}&PHPSESSID=&status=licensed&submit=`, '.exe'];
  }
};
module.exports = data;
