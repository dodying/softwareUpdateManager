'use strict'

let templates = `'use strict'

let data = {
  site: {
    FileHorse: '{{url}}'
  },
  install: function (output, iPath, fns) {
    return fns.install.auto(output, iPath)
  }
}
module.exports = data
`

let search = async (fns, keyword) => {
  let res = await fns.req('https://www.filehorse.com/search?q=' + encodeURI(keyword))
  if (!res || !res.body) return []
  let $ = fns.cheerio.load(res.body)
  return $('.software_list>li:not(.ads,.no_match)').map((index, item) => {
    let url = $(item).find('h3>a').attr('href')
    let length = url.match(/\/download-(.*?)(|-32|-64)\//)[1].length
    let name = $(item).find('h3>a').text().substr(0, length)
    let version = $(item).find('h3>a').text().substr(length + 1)
    let price = $(item).find('h3+p>abbr').text().trim()
    return {
      name: name,
      image: $(item).find('a>img').attr('src'),
      version: version,
      url: url,
      description: [
        { key: 'Description', value: $(item).find('.description_hide>p').text().trim() },
        { key: 'Price', value: price },
        { key: 'Date', value: $(item).find('h3+p').text().replace(price, '').trim() }
      ].map(j => `<li><b>${j.key}</b>: ${j.value}</li>`).join(''),
      text: templates.replace('{{url}}', url)
    }
  }).toArray()
}

module.exports = search
