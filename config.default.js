'use strict'

let config = {
  mode: 2, // 模式(对于免费软件) 0:只检查有无新版本 1.下载新版本安装包后不自动安装 2.下载并自动安装新版本
  commercialMode: 0, // 对于商业软件 0:只检查有无新版本 1.下载新版本安装包后不自动安装 2.下载并自动安装新版本
  specialMode: { // 为特定软件设置特定模式(最优先)
  },
  useProxy: 1, // 是否使用代理(包括请求与下载) 0.不使用 1.如果配置中声明，则使用 2.强制使用
  rootPath: 'path/to/root/path', // 根路径
  checkInterval: 1, // 检测更新的间隔(单位天)
  userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
  urlWithProxy: [ // 请求与下载的链接如果匹配任一，则走代理
  ],
  urlWithoutProxy: [ // 请求与下载的链接如果匹配任一，则不走代理(最优先)
  ],
  request: {// 请求相关
    timeout: 60, // 请求超时(单位秒)
    proxyHTTP: 'http://user:password@host:port', // HTTP代理
    proxySocks: true, // Socks代理(有则优先使用Socks代理)
    proxySocksHost: 'host', // Socks代理-域名，留空则为localhost
    proxySocksPort: 2345, // Socks代理-端口
    proxySocksUsername: 'user', // Socks代理-验证(无则留空)
    proxySocksPassword: 'password' // Socks代理-验证(无则留空)
  },
  download: { // 下载相关
    quiet: false, // 不显示进度
    retry: 5, // 重试次数(0表示无数次)
    timeout: 600, // 超时(单位秒，0表示无超时)
    proxy: 'host:port', // HTTP代理，留空则不使用代理
    urlWithoutHeader: [ // 下载链接如果匹配任一，则下载时不包括Header，Header包括userAgent/referer
    ]
  },
  preserveArchive: true, // 安装后是否保留安装包
  saveVersion: true, // 是否保存版本信息(推荐true)
  excludeGlobal: [ // 安装中要排除的文件/文件夹
    /^uninstall.exe/i // 相对于软件根路径
  ],
  software: { // 要启用更新的软件
    '7-Zip': '_Basis/7-Zip/7z.exe' // 路径(相对于rootPath，可使用绝对路径)
  }
}

module.exports = config
