'use strict';

const templates = `'use strict'

let data = {
  site: {
    Softpedia: '{{url}}'
  },
  install: 'install_auto'
}
module.exports = data
`;

const search = async (fns, keyword) => {
  const res = await fns.req({
    uri: 'https://www.softpedia.com/_xaja/programfinder.php',
    method: 'POST',
    form: {
      f: '0,2,4',
      v: '0,0,0',
      s: true,
      k: keyword
    }
  });
  return res && res.json && res.json.hasphones ? res.json.phones.sort((a, b) => a.date * 1 >= b.date ? -1 : a.date === b.date ? 0 : 1).map(i => {
    return {
      name: i.title,
      image: i.image,
      version: i.version,
      url: i.link,
      description: [
        { key: 'Description', value: i.subtitle },
        { key: 'Hot', value: i.dldcount },
        { key: 'Rating', value: i.rating.substr(0, 4) },
        { key: 'Price', value: i.price },
        { key: 'Date', value: new Date(i.date * 1000).toLocaleString() }
      ].map(j => `<li><b>${j.key}</b>: ${j.value}</li>`).join(''),
      text: templates.replace('{{url}}', i.link)
    };
  }) : [];
};

module.exports = search;
