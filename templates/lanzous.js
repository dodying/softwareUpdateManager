'use strict';

let info;

const data = {
  version: async (res, $, fns, choice) => {
    const match = choice ? [].concat(choice) : [/.zip$/, /(\d+[\d.]+\d+)/];

    const timeName = res.body.match(/'t':(.*?),/)[1];
    const keyName = res.body.match(/'k':(.*?),/)[1];
    const time = res.body.match(`${timeName} = '(.*?)';`)[1];
    const key = res.body.match(`${keyName} = '(.*?)';`)[1];
    let form = res.body.replace(/[\r\n]/g, '').match(/data : \{(.*?)\}/)[1];
    form = `{${form.replace(/'/g, '"').trim().replace(/,$/, '').replace('pgs', 1).replace(timeName, `"${time}"`).replace(keyName, `"${key}"`)}}`;
    form = JSON.parse(form);

    const res1 = await fns.req({
      method: 'POST',
      uri: 'https://www.lanzous.com/filemoreajax.php',
      form
    });
    info = res1.json.text.filter(i => i.name_all.match(match[0]))[0];
    return info.name_all.match(match[1] || match[0])[1];
  }
  // download: async (res, $, fns, choice) => {
  //   let res1 = await fns.req(`https://www.lanzous.com/${info.id}`)
  //   let uri2 = res1.body.match(/src="\/(fn\?[\w]{3,})"/i)[1]
  //   let res2 = await fns.req(`https://www.lanzous.com/${uri2}`)
  //   let form = res2.body.match(/\s+data : (\{.*?\})/)[1]
  //   form = form.replace(/'/g, '"').trim()
  //   form = JSON.parse(form)
  //   let res3 = await fns.req({
  //     method: 'POST',
  //     uri: 'https://www.lanzous.com/ajaxm.php',
  //     form
  //   })
  //   return [res3.json.dom + '/file/' + res3.json.url, require('path').extname(info.name_all)]
  // }
};
module.exports = data;
