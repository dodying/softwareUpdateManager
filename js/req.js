'use strict';

const url = require('url');

const request = require('request');
const requestPromise = require('request-promise');
const Agent = require('socks5-http-client/lib/Agent');
const Agent2 = require('socks5-https-client/lib/Agent');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

let config = {
  uriLast: null,
  cookies: request.jar(),
  retryList: {},
  proxyList: {},
  _: {}
};

const initConfig = (obj) => { config = Object.assign(config, obj); };
const setConfig = (key, value) => { config[key] = value; };
const getConfig = (key, defaultValue) => config[key] || defaultValue;

/**
 * @description test
 * @returns {boolean} test
 * @param {string} from test
 */

function reqOption (uriOrOption, optionUser = {}) {
  let option = typeof uriOrOption === 'string' ? { uri: uriOrOption } : uriOrOption;
  let uri = option.uri;
  let useProxy = optionUser.useProxy;

  if (config.uriLast) uri = new URL(uri, config.uriLast).href;
  option = Object.assign({
    method: 'GET',
    headers: {
      'User-Agent': config._.request.userAgent,
      Accept: 'text/plain, application/json, */*',
      // 'Accept-Language': '*;q=0.5',
      Referer: config.uriLast && new URL(config.uriLast).hostname === new URL(uri).hostname ? config.uriLast : uri
    },
    timeout: config._.request.timeout * 1000,
    jar: config.cookies,
    strictSSL: false,
    resolveWithFullResponse: true,
    simple: false,
    gzip: true
  }, option, { uri });

  uri = option.uri || option.url;
  delete option.url;

  if (config._.urlWithoutProxyForce.some(urlfilter => uri.match(urlfilter))) {
    useProxy = false;
  } else if (config._.urlWithProxyForce.some(urlfilter => uri.match(urlfilter))) {
    useProxy = true;
  } else if (uri !== config.uriLast || !(url.parse(uri).hostname in config.proxyList)) {
    if (config._.urlWithoutProxy.some(urlfilter => uri.match(urlfilter))) {
      useProxy = false;
    } else if (config._.urlWithProxy.some(urlfilter => uri.match(urlfilter)) || config._.useProxy === 2 || (config._.useProxy === 1 && useProxy)) {
      useProxy = true;
    }
  } else {
    useProxy = useProxy === undefined || (config._.autoToggleProxy && config.proxyList[url.parse(uri).hostname]) ? !config.proxyList[url.parse(uri).hostname] : useProxy;
  }
  config.proxyList[url.parse(uri).hostname] = useProxy;

  if (useProxy && config._.request.proxy && config._.request.proxy.match(/(http|socks5):\/\/((.*?):(.*?)@)?(.*?):(\d+)/i)) {
    const [, protocol,, username, password, hostname, port] = config._.request.proxy.match(/(http|socks5):\/\/((.*?):(.*?)@)?(.*?):(\d+)/i);
    if (protocol.toLowerCase() === 'http') {
      option.proxy = config._.request.proxy;
    } else if (protocol.toLowerCase() === 'socks5') {
      option.agentClass = uri.match(/^http:/) ? Agent : Agent2;
      option.agentOptions = {
        socksHost: hostname,
        socksPort: port
      };
      if (username && password) {
        option.agentOptions.socksUsername = username;
        option.agentOptions.socksPassword = password;
      }
    }
  }
  console.warn(`${option.method}${(option.proxy || option.agentClass) ? '+proxy' : ''}:\t${uri}`);
  if (option.form || option.body) console.debug({ body: option.form || option.body });

  config.uriLast = uri;
  return option;
}

async function req (uriOrOption, optionUser = {}) {
  const option = reqOption(uriOrOption, optionUser);
  const uri = option.uri || option.url;

  const errorHandle = (message) => {
    config.retryList[uri] = uri in config.retryList ? config.retryList[uri] + 1 : 1;

    console.error(`Try-${config.retryList[uri]}:\t${message}`);
    return config._.request.retry > config.retryList[uri] ? req(uriOrOption, optionUser) : null;
  };

  let res;
  try {
    if (!('encoding' in option)) option.encoding = null;
    res = await requestPromise(option);
    if (option.encoding === null) {
      // 判断网页编码
      let charset = res.headers['content-type'] && res.headers['content-type'].match(/charset=(.*?)(;|$)/) ? res.headers['content-type'].match(/charset=(.*?)(;|$)/i)[1] : 'utf-8';

      let body;
      try {
        body = iconv.decode(res.body, charset);
      } catch (error) {
        body = iconv.decode(res.body, 'utf-8');
      }

      const $ = cheerio.load(body);
      if ($('meta[http-equiv="Content-Type"][content*="charset"]').length || $('meta[charset]').length) {
        if ($('meta[http-equiv="Content-Type"][content*="charset"]').length) {
          charset = $('meta[http-equiv="Content-Type"][content*="charset"]').attr('content').match(/charset=(.*?)(;|$)/)[1];
        } else if ($('meta[charset]').length) {
          charset = $('meta[charset]').attr('charset');
        }
        try {
          body = iconv.decode(res.body, charset);
        } catch (error) {
          body = iconv.decode(res.body, 'utf-8');
        }
      }
      res.body = body;
    }
    const succeed = typeof optionUser.check === 'function' ? optionUser.check(res) : res.statusCode >= 200 || res.statusCode < 300;
    if (succeed) {
      if (res.body) {
        try {
          res.json = JSON.parse(res.body);
          console.debug(res.json);
        } catch (error) {}
      }
      delete config.retryList[uri];
      return res;
    } else {
      return errorHandle(res.statusCode + ' ' + res.statusMessage);
    }
  } catch (error) {
    if (error.cause && error.cause.errno === 'ETIMEDOUT' && error.cause.port === 443 && uri.match('http://')) {
      option.uri = uri.replace('http://', 'https://');
      return req(option, optionUser);
    } else {
      return errorHandle(error.message);
    }
  }
}

function reqRaw (uriOrOption, optionUser = {}) {
  const option = reqOption(uriOrOption, optionUser);
  return request(option);
}

async function reqHEAD (uriOrOption, optionUser = {}) {
  let option = typeof uriOrOption === 'string' ? { uri: uriOrOption } : uriOrOption;
  const uri = option.uri;
  let useProxy = optionUser.useProxy;
  const withoutHeader = optionUser.withoutHeader;

  let retry = 1;
  const head = async () => {
    return new Promise((resolve, reject) => {
      let req;
      const _withoutHeader = config._.download.urlWithoutHeader.some(urlfilter => uri.match(urlfilter)) || withoutHeader;
      if (!_withoutHeader) {
        req = reqRaw(option, optionUser);
      } else {
        option = Object.assign(option, {
          headers: {},
          jar: request.jar(),
          removeRefererHeader: true
        });
        req = reqRaw(option, optionUser);
      }
      let html = '';
      const reses = [];

      req.on('redirect', function () {
        console.debug(`Redirect:\t${this.uri.href}`);
      }).on('response', async res => {
        reses.push(res);
        if (['application', 'binary'].some(i => res.headers['content-type'] && res.headers['content-type'].match(i)) || (res.headers['content-disposition'] && res.headers['content-disposition'].match(/^attachment/))) {
          req.abort();
          resolve(reses);
          return;
        }

        res.on('end', async function () {
          const $ = cheerio.load(html);
          const match = html.match(/<meta http-equiv="?refresh"? content="?(.*)"?/i);
          const refresh = $('meta[http-equiv="refresh"],meta[http-equiv="REFRESH"]');
          if (refresh.length || match) {
            let uri1 = refresh.length ? refresh.attr('content') : match[1];
            uri1 = uri1.match(/url=(.*)/i)[1];
            option.uri = uri1;
            const reses1 = await reqHEAD(option, { useProxy });
            resolve(reses.concat(reses1));
          } else {
            resolve(reses);
          }
        });
        res.on('data', chunk => {
          html += chunk;
        });
      }).on('error', async error => {
        console.error(`Try-${retry}:\t${error.message}`);
        retry = retry + 1;
        useProxy = !useProxy;
        if (config._.request.retry > retry) {
          const reses1 = await head();
          resolve(reses.concat(reses1));
        } else {
          resolve(reses);
        }
      });
    });
  };
  const reses = await head();
  return reses[reses.length - 1];
}

req.config = {
  init: initConfig,
  set: setConfig,
  get: getConfig
};
req.raw = reqRaw;
req.head = reqHEAD;

module.exports = req;
