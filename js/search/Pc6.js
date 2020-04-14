'use strict';

const templates = `'use strict'

let data = {
  site: {
    Pc6: '{{url}}'
  },
  install: 'install_auto'
}
module.exports = data
`;

const search = async (fns, keyword) => {
  const res = await fns.req('https://s.pc6.com/?k=' + encodeURI(keyword));
  if (!res || !res.body) return [];
  const $ = fns.cheerio.load(res.body);
  return $('#result>dt').map((index, item) => {
    const url = $(item).find('a').attr('href');
    let arr = $(item).find('a').text().trim().split(/\s+/);
    const name = arr.slice(0, arr.length - 1);
    const version = arr[arr.length - 1];

    const info = $(item).next();
    arr = $(info).find('.info').text().trim().split(' - ');
    return {
      name: name,
      image: $(item).find('a>img').attr('src'),
      version: version,
      url: url,
      description: [
        { key: 'Size', value: arr[0] },
        { key: 'Lang', value: arr[1] },
        { key: 'Price', value: arr[2] },
        { key: 'Date', value: $(info).find('.addr>span:nth-child(2)').text().trim() },
        { key: 'Description', value: $(info).find('.intro>span').text().trim() }
      ].map(j => `<li><b>${j.key}</b>: ${j.value}</li>`).join(''),
      text: templates.replace('{{url}}', url)
    };
  }).toArray();
};

module.exports = search;
