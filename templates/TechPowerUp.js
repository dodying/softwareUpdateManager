'use strict';

const data = {
  url: 'https://www.techpowerup.com/download/techpowerup-gpu-z/',
  version: '.title',
  changelog: '.history-entries>.version',
  download: async (res, $, fns) => {
    const url = res.request.uri.href;
    const res1 = await fns.req({
      uri: url,
      method: 'POST',
      form: {
        id: $('.version:not(.hidden) form>input[name="id"]').val()
      }
    });

    const $1 = fns.cheerio.load(res1.body);
    const res2 = await fns.req({
      uri: url,
      method: 'POST',
      form: {
        id: $('.version:not(.hidden) form>input[name="id"]').val(),
        server_id: $1('[name="server_id"]').attr('value')
      }
    }, {
      check: res => [200, 302].includes(res.statusCode)
    });
    return res2.headers.location;
  }
};
module.exports = data;
