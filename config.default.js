'use strict';

const config = {
  debug: false,
  formatOptions: {}, // debug模式下，写日志时，记录Object使用的格式，参照inspectOptions
  locale: 'zh-CN', // 决定时间格式
  ignoreWarn: { // 无视警告
    mode1: false, // 模式 1: 下载但不安装
    mode3: false, // 模式 3: 删除原版本（包括配置）后安装新版本
    preferPath: false, // preferPath与目标路径不匹配
    install: false, // 与手动安装相似(可能会生成快捷方式和写入注册表，甚至是捆绑文件或病毒)
    withoutVirusScan: false, // 安装文件未扫描
    fixedPath: false // 目标路径无法改变
  },
  profile: { // 如果你要安装同个软件到不同位置，在这里设置
    example: {
      deepmerge: true // 是否深度合并，是则只替换相同key的值，否则直接替换对象
    }
  },
  mode: 2, // 模式(对于免费软件) 0:只检查有无新版本 1.下载新版本安装包后不自动安装 2.下载并自动安装新版本 3.删除原版本（包括配置）后并安装新版本
  commercialMode: 0, // 对于商业软件 0:只检查有无新版本 1.下载新版本安装包后不自动安装 2.下载并自动安装新版本 3.删除原版本（包括配置）后并安装新版本
  freePersion: true, // 是否将 Free Personal 类型的软件是为商业软件
  freemium: true, // 是否将 Freemium 类型的软件是为商业软件
  virus: { // 检查病毒
    apiKey: '', // 获取地址: https://www.virustotal.com/#/settings/apikey (留空则不检查)
    upload: true, // 是否上传文件以分析
    ignoreSoftware: [], // 忽略来自某软件的检查结果
    ignoreResult: [], // 忽略来自某重结果
    safeDetectionRatio: 0 // 视为安全的检出率
  },
  specialMode: { // 为特定软件设置特定模式(最优先)
    '7-Zip': 0
  },
  useProxy: 1, // 是否使用代理(包括请求与下载) 0.不使用 1.如果配置中声明，则使用 2.强制使用
  archivePath: 'archive',
  rootPath: 'path/to/root/path', // 根路径
  checkInterval: 1, // 检测更新的间隔(单位天)
  urlWithProxy: [ // 请求与下载的链接如果匹配任一，则走代理
  ],
  urlWithoutProxy: [ // 请求与下载的链接如果匹配任一，则不走代理(最优先)
  ],
  urlWithProxyForce: [],
  urlWithoutProxyForce: [],
  autoToggleProxy: true, // 是否自动切换代理状态
  request: {
    userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    retry: 5, // 重试次数(0表示不重试)
    timeout: 60, // 请求超时(单位秒)
    proxy: 'protocol://username:password@hostname:port' // 代理，留空则不使用代理 protocol: socks5/http
  },
  download: { // 下载相关
    /**
     * method:
     *   request: (不推荐)无需下载，但bug众多，使用时continue推荐为false(即续传可能会出错)
     *   wget
     *   curl: 支持socks代理
     */
    method: 'request',
    userAgent: null,
    quiet: false, // 不显示进度
    continue: true, // 是否断点续传
    retry: 5, // 重试次数(0表示无数次)
    retryDelay: 5, // 重试延迟(单位秒)
    timeout: 600, // 超时(单位秒，0表示无超时)
    proxy: 'protocol://username:password@hostname:port', // 代理，留空则不使用代理
    urlWithoutHeader: [ // 下载链接如果匹配任一，则下载时不包括Header，Header包括userAgent/referer
    ],
    sfMirror: 'nchc'// sf下载镜像
  },
  preserveArchive: true, // 安装后是否保留安装包
  preserveOldArchive: false, // 当有新版本时，是否保留旧版本
  backupOldVersion: 0, // 当新版本安装时，是否备份旧版本 0.不备份 1.移动 2.打包(可能会很慢)
  saveVersion: true, // 是否保存版本信息(推荐true)
  openInstaller: 0, // 当缺少安装方式时，是否直接打开安装包 0.不打开 1.打开
  installForce: { // 当使用命令行安装时，是否直接安装 // TODO
    'Google/Google Earth Pro': true
  },
  includeGlobal: [ // 安装中要保留的文件/文件夹(优先于excludeGlobal)
    'locales', 'resources'
  ],
  excludeGlobal: [ // 安装中要排除的文件/文件夹
    /^uninstall.exe/i // 相对于软件安装路径
  ],
  search: [ // 留空则搜索全部网站，否则只按以下顺序搜索
    'Softpedia'
  ],
  software: { // 要启用更新的软件
    // 键名：软件名[:版本] (在software文件夹下)
    // 键值：路径(相对于rootPath，可使用绝对路径)
    '7-Zip': '7-Zip|7z.exe',

    // 安装路径与程序路径（用于获取版本号）用 | 分隔
    // 在下方示例中，
    // 安装路径为 Epic
    // 程序路径为 Portal/Binaries/Win32/EpicGamesLauncher.exe
    // 如果你不知道程序路径，可以使用空值 "Epic|"，或是先设置为任意值，等安装后在修改
    // 注意：如果程序路径不存在(不等同于空值)，该脚本会在每次运行时都尝试安装改软件
    'Epic Games': 'Epic|Portal/Binaries/Win32/EpicGamesLauncher.exe',

    'Bandisoft/Bandizip:portable': 'Bandizip|Bandizip64.exe' // 安装 Bandizip 的 portable 版本
  }
};

module.exports = config;
