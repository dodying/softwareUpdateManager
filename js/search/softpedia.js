'use strict'

let templates = `'use strict'

let data = {
  site: {
    Softpedia: '{{url}}'
  },
  install: function (output, iPath) {
    return require('./../js/install_auto')(output, iPath)
  }
}
module.exports = data
`

let search = async (req, cheerio, keyword) => {
  let res = await req('https://www.softpedia.com/_xaja/programfinder.php', {
    method: 'POST',
    form: {
      f: '0,2,4',
      v: '0,0,0',
      s: true,
      k: keyword
    },
    json: true
  })
  return res.body.hasphones ? res.body.phones.sort((a, b) => a.date * 1 >= b.date ? -1 : a.date === b.date ? 0 : 1).map(i => {
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
    }
  }) : []
}

module.exports = search
