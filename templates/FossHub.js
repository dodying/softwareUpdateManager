'use strict'

let data = {
  url: 'https://www.fosshub.com/CudaText.html',
  version: ['[itemprop="softwareVersion"]', 'text', /(.*)/],
  download: async (res, $, fns, choice) => {
    let data = res.body.match(/var settings =(\{.*\})/)[1]
    data = JSON.parse(data)
    let file = data.pool.f.filter(i => i.n.match(choice || /.zip$/))[0]
    let res1 = await fns.req({
      method: 'POST',
      uri: 'https://api.fosshub.com/download/',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Origin': 'https://www.fosshub.com',
        'Referer': 'https://www.fosshub.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
      },
      body: JSON.stringify({
        projectId: data.projectId,
        releaseId: file.r,
        projectUri: data.pool.u,
        fileName: file.n,
        source: data.pool.c
      })
    })
    return res1.json.data.url
  }
}
module.exports = data
