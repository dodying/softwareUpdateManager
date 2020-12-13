'use strict';

module.exports = {
  version: '.soft-title>h1',
  changelog: {
    url: '.links>a[href^="/baike"]',
    selector: '.section-header:contains("更新日志")+div'
  },
  download: (res) => res.body.match(/downUrl = '(.*?)'/)[1] + '&pos=detail_local&rand=' + (~~(Math.random() * (1 << 24))).toString(16)
};
