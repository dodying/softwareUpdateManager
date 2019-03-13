<!-- TOC -->

- [SoftwareUpdateManager](#softwareupdatemanager)
  - [软件更新管理器](#软件更新管理器)
    - [Note](#note)
      - [说明](#说明)
        - [使用方法](#使用方法)
        - [其他说明](#其他说明)
    - [Command-Line](#command-line)
      - [命令行](#命令行)
    - [TODO](#todo)
    - [Software Example](#software-example)
      - [软件示例](#软件示例)
    - [Supported Software](#supported-software)
      - [支持的软件](#支持的软件)
    - [Special Software](#special-software)
      - [特别的软件](#特别的软件)
        - [Special Installer](#special-installer)
          - [特殊的安装方式(作为参考)](#特殊的安装方式作为参考)
        - [Without Download](#without-download)
          - [缺失下载](#缺失下载)
        - [Without Installer](#without-installer)
          - [缺失安装方式](#缺失安装方式)
        - [Extractable Software](#extractable-software)
          - [可以解包的软件](#可以解包的软件)

<!-- /TOC -->

# SoftwareUpdateManager
## 软件更新管理器

### Note
#### 说明

##### 使用方法

1. `git clone https://github.com/dodying/softwareUpdateManager`
2. `git clone https://github.com/dodying/software-for-softwareUpdateManager`，并移动 **software** 到 **softwareUpdateManager** 下
3. 从[这里](https://github.com/dodying/softwareUpdateManager/releases/tag/plugins)下载 **plugins.7z**，并解压到 **plugins** 下
4. 复制一份 **config.default.js**，按其中注释修改并存为 **config.js**

##### 其他说明

1. 以下软件，如果`通常版(installer)`与`便携版(portable)`功能相同则一般以绿色版优先(如果安装版的包小许多，则可能以安装版优先)，同时64位优先
2. 大多软件都支持自动安装
3. 带 :money_with_wings: 的为**商业软件** (包括Freemium与Free Persion)， 带 :airplane: 的需**番羽土墙**， 带 :hand: 的需**手动安装**
4. 代理优先级(前提是设置了代理): `config.urlWithoutProxy > config.urlWithProxy > config.useProxy > software.useProxy`
5. 模式优先级: `config.specialMode > config.mode = config.commercialSoftware`
6. 安装方法并没有一一测试，如果自动安装失败，请尝试手动安装


### Command-Line
#### 命令行

* `--help`
* `--makemd`
* `--search keyword`
* `[--profile name] --list`
* `[--quiet] [--profile name] [--filter name] [ --test | --onlycheck | --backup | --install ]`
* `[--quiet] [--profile name] [ --test | --onlycheck | --backup | --install ] [name]`

<details>
  <summary>Command-Line Details</summary>

* `node index`

   `node index.js`
    检查并更新所有软件
* `--help`, `-h`

    `node index.js --help`
* `--makemd`, `-md`

    `node index.js --makemd`
    根据`software`文件夹下的`js`文件创建`README.md`
* `--search`, `-s`

    `node index.js --search keyword`
    搜索并创建`js`文件
* `--profile`, `-p`

    `node index.js --profile name`
    eg: `node index.js -profile sync`
        ==> 当`config`与`config.profile.sync`中存在相同项时，以`config.profile.sync`优先，同时数据会保存在`data-sync.json`中
* `--list`, `-l`

    `node index.js --list`
    列出`database.json`中的软件及版本
* `--quiet`, `-q`

    `node index.js --quiet`
    所有的提问为false或0(第一项)
* `--filter`, `-f`

    `node index.js --filter name`
    检查并更新匹配的软件(多个匹配条件用`,`相隔) (忽略更新间隔)
* `--test`, `-t`

    `node index.js --test`
    获取网上所有软件的最新版本号 (忽略更新间隔)
* `--onlycheck`, `-oc`

    `node index.js --onlycheck`
    获取网上软件的最新版本号，并写入`database.json` (忽略更新间隔)
    效果: 忽略本地版本
* `--backup`, `-b`

    `node index.js --backup`
    获取网上软件的最新版本，并下载安装包 (忽略更新间隔)
* `--install`, `-i`

    `node index.js --install`
    安装本地最新版本
* `software_name`

    `node index.js 7-Zip AIMP "Google Chrome"`
    检查并更新这些软件(多个软件用`空格`相隔) (忽略更新间隔)
</details>

### TODO

* [x] 支持同一软件的不同版本
* [x] 从 [FileHorse.com](http://www.filehorse.com/) 等网站搜索并生成相应js
* [x] 自动检查安装包类型并安装

### Software Example
#### 软件示例

请参照 [Telegram](software/Telegram.js)
<details>
  <summary>Example Details</summary>

```js
'use strict'

let data = {
  // ?commercial:
  // 1. boolean: false=Free true=Commercial
  // 2. number: 0=Free 1=FreePersonal 2=Freemium 3=Commercial

  // ?useProxy: true/false,
  // ?withoutHeader: true/false,

  // ?noMd5: true/false,

  // url or site, either needed
  url: 'https://github.com/telegramdesktop/tdesktop/releases/latest',
  site: {
    // key of site, should be found in folder templates
    // value of site, should be the url
    Softpedia: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/Internet/Chat/Portable-Telegram-Desktop.shtml'
  },

  // ?preferPath: 'preferPath',
  version: {
    selector: '.muted-link.css-truncate',
    // ?attr:
    // 1. text or omitted => text()
    // 2. html => html()
    // 3. other => attr(other)
    //
    match: /v(.*)/
    // ?match:
    // 1. omitted => /(\d+[\d.]+\d+)/[1]
    // 2. /other/ => /other/[1]
    // ---
    // or func: async (res, $, req, cheerio, choice) => { return version }
  },
  /**
   * download:
   * omitted => open url
   */
  download: {
    // --- mode 0 ---
    // plain: 'url/to/download'
    //   you can use variables with {}
    //   defined variables:
    //     version: the latest version
    //
    // --- mode 1 ---
    selector: 'a[href*="/releases/download/"][href$=".zip"]'
    // ?attr:
    // 1. omitted => attr('href')
    // 2. text => text()
    // 3. html => html()
    // 4. other => attr(other)
    //
    // ?match: '', // omitted => /(.*)/[1]
    //
    // --- mode 2 ---
    // func: async (res, $, req, cheerio, choice) => { return url }

    // ?output:
    // save to which extension, format: '.ext'
    // eg: output='.zip', it'll be named as 'Telegram-version.zip'
    // or omitted: extension according to download url
  },
  /**
   * omitted => install manually
   * install: async function(output, iPath, choice)
   * @returns {boolean} if install completed
   * @param {string} output the path to the install pack file.
   * @param {string} iPath the path to the bin file.
   */
  install: function (output, iPath) {
    return require('./../js/install')(output, iPath)
  }
  /**
   * beforeInstall: async function(output, iPath)
   * afterInstall: async function(output, iPath)
   */
  /**
   * other: object
   */
  /**
   * versionChoice
   * downloadChoice
   * installChoice
   */
}
module.exports = data

```
</details>


### Supported Software
#### 支持的软件

<details>
  <summary>Software List Details</summary>

1. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=1clipboard.io" width="16"> 1Clipboard](http://1clipboard.io/)
2. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=rammichael.com" width="16"> 7+ Taskbar Tweaker](https://rammichael.com/downloads/7tt_setup.exe?changelog)
3. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.7-zip.org" width="16"> 7-Zip-CLI](https://www.7-zip.org/download.html)
4. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.7-zip.org" width="16"> 7-Zip](https://www.7-zip.org/download.html)
5. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Abricotine](https://github.com/brrd/Abricotine/releases/latest) :hand: [58/1,788/126] Markdown editor with inline preview.
6. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=launchpad.net" width="16"> ACBF Viewer](https://launchpad.net/acbf/+download)
7. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ActiveCollab-Electron](https://github.com/nurtext/active-collab-desktop/releases/latest) [9/31/11] Unofficial Active Collab Desktop application based on Electron.
8. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=activecollab.com" width="16"> ActiveCollab](https://activecollab.com/help/release-notes/)
9. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.actualtools.com" width="16"> Actual Title Buttons](https://www.actualtools.com/titlebuttons/) :money_with_wings:
10. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Advanced REST Client](https://github.com/advanced-rest-client/arc-electron/releases/latest) [28/277/45] Advanced REST Client - electron app.
11. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.aida64.co.uk" width="16"> AIDA64 Engineer](https://www.aida64.co.uk/download) [Free Personal]
12. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.aida64.co.uk" width="16"> AIDA64 Extreme](https://www.aida64.co.uk/download) [Free Personal]
13. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.aimp.ru" width="16"> AIMP](http://www.aimp.ru/?do=download&os=windows)
14. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Alacritty](https://github.com/jwilm/alacritty/releases/latest) [353/14,776/653] A cross-platform, GPU-accelerated terminal emulator
15. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Altair](https://github.com/imolorhe/altair/releases/latest) [21/999/47] ✨⚡️ A beautiful feature-rich GraphQL Client for all platforms.
16. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Aminal](https://github.com/liamg/aminal/releases/latest) [34/1,908/58] A modern cross-platform terminal emulator in Go.
17. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=apps.ankiweb.net" width="16"> Anki](https://apps.ankiweb.net/)
18. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> annie](https://github.com/iawia002/annie/releases/latest) [135/5,279/402] 👾 Fast, simple and clean video downloader.
19. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.any-video-converter.com" width="16"> Any Video Converter](https://www.any-video-converter.com/products/for_video_ultimate/whatnew.php) [Free Personal]
20. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.anyburn.com" width="16"> AnyBurn](http://www.anyburn.com/cn/index.htm)
21. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=anydesk.com" width="16"> AnyDesk](https://anydesk.com/platforms/windows) [Freemium]
22. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Ao](https://github.com/klaussinani/ao/releases/latest) [34/871/90] ✔️ Elegant Microsoft To-Do desktop app.
23. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=apk.ghpym.com" width="16"> APK Messenger](https://apk.ghpym.com/downloads.html)
24. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> APK-Info](https://github.com/Enyby/APK-Info/releases/latest) [11/56/7] APK-Info is a Windows tool to get detailed info about an apk file.
25. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=arctime.org" width="16"> Arctime](https://arctime.org/download.html) [Free Personal]
26. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> aria2-desktop](https://github.com/wapznw/aria2desktop/releases/latest) [10/82/5] 一个漂亮的aria2的UI界面 aria2ui, aria2gui.
27. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> aria2](https://github.com/aria2/aria2/releases/latest) [638/13,737/1,542] aria2 is a lightweight multi-protocol & multi-source, cross platform download utility operated in command-line. It supports HTTP/HTTPS, FTP, SFTP, BitTorrent and Metalink.
28. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.alex-is.de" width="16"> AS SSD Benchmark](https://www.alex-is.de/PHP/fusion/downloads.php?download_id=9)
29. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Atom](https://github.com/atom/atom/releases/latest) [2,466/48,044/11,216] :atom: The hackable text editor.
30. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=audacious-media-player.org" width="16"> Audacious](https://audacious-media-player.org/download)
31. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=biblprog.com" width="16"> Audacity](https://biblprog.com/en/audacity/download/)
32. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.autohotkey.com" width="16"> AutoHotkey](https://www.autohotkey.com/download/)
33. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.autoitscript.com" width="16"> AutoIt](https://www.autoitscript.com/site/autoit/downloads/)
34. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.automaticimagedownloader.com" width="16"> Automatic Image Downloader](https://www.automaticimagedownloader.com/)
35. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> AUXPI](https://github.com/aimerforreimu/AUXPI/releases/latest) [3/221/37] 🍭 集合多家 API 的新一代图床.
36. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=avocode.com" width="16"> Avocode](https://avocode.com/changelog) :money_with_wings:
37. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.axife.com" width="16"> Axife](https://www.axife.com/downloads.html) :money_with_wings:
38. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Babun](https://github.com/babun/babun/releases) [298/8,525/529] Babun - a Windows shell you will love!
39. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> BaiduCDP](https://github.com/cool2528/baiduCDP/releases/latest) [33/902/132] 百度网盘下载神器.
40. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> BaiduPCS-Go](https://github.com/iikira/BaiduPCS-Go/releases/latest) [506/12,204/1,665] 百度网盘客户端 - Go语言编写.
41. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> BaiduPCS-Web](https://github.com/liuzhuoling2011/baidupcs-web/releases/latest) [82/1,626/281] Contribute to  development by creating an account on GitHub.
42. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> balenaEtcher](https://github.com/balena-io/etcher/releases/latest) [341/14,051/796] Flash OS images to SD cards & USB drives, safely and easily.
43. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.bandisoft.com" width="16"> Bandisoft Bandizip](https://www.bandisoft.com/bandizip/)
44. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.bandisoft.com" width="16"> Bandisoft Honeyview](http://www.bandisoft.com/honeyview/)
45. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Bdash](https://github.com/bdash-app/bdash/releases/latest) [49/1,246/78] Simple SQL Client for lightweight data analysis.
46. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Beaker](https://github.com/beakerbrowser/beaker/releases/latest) [180/4,614/341] An experimental peer-to-peer Web browser.
47. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=bearychat.com" width="16"> BearyChat](https://bearychat.com/releases/client/changelog.json)
48. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Beeftext](https://github.com/xmichelo/Beeftext/releases/latest) [10/91/2] A text snippet tool for Windows.
49. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Betwixt](https://github.com/kdzwinel/betwixt/releases/latest) [85/4,037/123] :zap: Web Debugging Proxy based on Chrome DevTools Network panel.
50. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=scootersoftware.com" width="16"> Beyond Compare](http://scootersoftware.com/download.php?zz=dl4) :money_with_wings:
51. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> BiglyBT](https://github.com/BiglySoftware/BiglyBT/releases/latest) [37/281/57] Feature-filled Bittorrent client based on the Azureus open source project
52. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Bitwarden](https://github.com/bitwarden/desktop/releases/latest) [46/599/64] The desktop vault (Windows, macOS, & Linux).
53. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.bleachbit.org" width="16"> BleachBit](https://www.bleachbit.org/download/windows)
54. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.blender.org" width="16"> Blender](https://www.blender.org/download/)
55. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Boostnote](https://github.com/BoostIO/boost-releases/releases/latest) [49/210/9] 🚀 Boostnote app releases & changelog.
56. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> BorderlessGaming](https://github.com/Codeusa/Borderless-Gaming/releases/latest) [135/2,094/246] Play your favorite games in a borderless window; no more time consuming alt-tabs. 
57. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> BotFramework-Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases/latest) [130/959/405] Bot Framework Emulator.
58. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.boxedapp.com" width="16"> BoxedApp Packer](https://www.boxedapp.com/boxedapppacker/changelog.html) :money_with_wings:
59. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Brackets](https://github.com/adobe/brackets/releases/latest) [1,630/29,613/6,395] An open source code editor for the web, written in JavaScript, HTML and CSS.
60. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Brave](https://github.com/brave/brave-browser/releases/latest) [104/1,696/164] Next generation Brave browser for macOS, Windows, Linux, and eventually Android
61. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Brook](https://github.com/txthinking/brook/releases/latest) [434/8,089/1,535] Brook is a cross-platform(Linux/MacOS/Windows/Android/iOS) proxy/vpn software
62. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Build Checker App](https://github.com/willmendesneto/build-checker-app/releases/latest) [2/47/5] Application using ReactJS  + NodeJS for to monitor build/deploy status in your Continuous Integration server
63. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Bulk Crap Uninstaller](https://github.com/Klocman/Bulk-Crap-Uninstaller/releases/latest) [34/395/32] Remove large amounts of unwanted applications quickly.
64. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=bulkimagedownloader.com" width="16"> Bulk Image Downloader](https://bulkimagedownloader.com/) :money_with_wings:
65. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Buttercup](https://github.com/buttercup/buttercup-desktop/releases/latest) [71/2,761/194] :key: Javascript Secrets Vault - Multi-Platform Desktop Application
66. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=cacher-download.nyc3.digitaloceanspaces.com" width="16"> Cacher](https://cacher-download.nyc3.digitaloceanspaces.com/latest.yml)
67. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Calibre](https://github.com/kovidgoyal/calibre/releases/latest) [312/5,488/982] The official source code repository for the calibre ebook manager
68. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softpedia.com" width="16"> Cameyo](https://www.softpedia.com/get/System/System-Miscellaneous/Cameyo.shtml) Free Download Cameyo - Virtualize the running of various applications on your computer, without the need to install them in order to benefit from th...
69. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Caprine](https://github.com/sindresorhus/caprine/releases/latest) [112/4,084/376] Elegant Facebook Messenger desktop app.
70. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Caption](https://github.com/gielcobben/caption/releases/latest) [32/1,099/79] Get Caption, start watching.
71. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=caret.io" width="16"> Caret](https://caret.io/)
72. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> CashNotify](https://github.com/BaguetteEngineering/download.cashnotify.com/releases/latest) [2/0/0] Host releases for CashNotify 3.
73. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=catlight.io" width="16"> CatLight](https://catlight.io/downloads) :money_with_wings:
74. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=singularlabs.com" width="16"> CCEnhancer](https://singularlabs.com/software/ccenhancer/download-ccenhancer/)
75. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.centbrowser.cn" width="16"> CentBrowser](https://www.centbrowser.cn/history.html)
76. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Cerebro](https://github.com/KELiON/cerebro/releases/latest) [157/5,845/343] Open-source productivity booster with a brain.
77. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> CerebroApp](https://github.com/KELiON/cerebro/releases/latest) [157/5,845/343] Open-source productivity booster with a brain.
78. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Championify](https://github.com/dustinblackman/Championify/releases/latest) [63/877/117] Import recent item sets from popular aggregators like Champion.gg in to League of Legends to use within game! No hassle.
79. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> CherryTree](https://github.com/giuspen/cherrytree/releases) [71/780/122] cherrytree.
80. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=csharp.love" width="16"> ChromeUpdateSharp](https://csharp.love/chrome-update-tool.html)
81. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=cintanotes.com" width="16"> CintaNotes](http://cintanotes.com/download/) [Free Personal]
82. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=hp.vector.co.jp" width="16"> CLaunch](http://hp.vector.co.jp/authors/VA018351/claunch.html)
83. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=blog.getcleaver.com" width="16"> Cleaver](https://blog.getcleaver.com/)
84. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Clementine](https://github.com/clementine-player/Clementine/releases/latest) [148/2,122/440] :tangerine: Clementine Music Player.
85. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> clink](https://github.com/mridgers/clink/releases/latest) [134/2,285/206] Bash's powerful command line editing in cmd.exe.
86. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> ClipAngel](https://sourceforge.net/projects/clip-angel/files/) Clipboard history capture and paste tool
87. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> cloud-torrent](https://github.com/jpillora/cloud-torrent/releases/latest) [211/3,152/1,068] ☁️ Cloud Torrent: a self-hosted remote torrent client
88. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.evorim.com" width="16"> Cloudevo](https://www.evorim.com/en/cloudevo) [Free Personal] :hand:
89. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Cmder Mini](https://github.com/cmderdev/cmder/releases/latest) [588/17,357/1,228] Lovely console emulator package for Windows.
90. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> CMWTAT Digital Edition](https://github.com/TGSAN/CMWTAT_Digital_Edition/releases/latest) [22/543/68] CloudMoe Windows 10 Activation Toolkit get digital license, the best open source Win 10 activator in GitHub. GitHub 上最棒的开源 Win10 数字权利（数字许可证）激活工具！
91. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=cocos2d-x.org" width="16"> Cocos2d-x](http://cocos2d-x.org/download)
92. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=cocos2d-x.org" width="16"> CocosCreator](http://cocos2d-x.org/download)
93. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> CodeNotes](https://github.com/lauthieb/code-notes/releases/latest) [29/503/55] A simple code snippet & gist manager for developers built with Electron & Vue.js 🚀
94. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=comicrack.cyolito.com" width="16"> ComicRack](http://comicrack.cyolito.com/downloads)
95. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ComicTagger](https://github.com/davide-romanini/comictagger/releases) [29/92/28] A cross-platform GUI/CLI app for writing metadata to digital comics (fork)
96. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ConEmu](https://github.com/Maximus5/ConEmu/releases/latest) [248/5,696/397] Customizable Windows terminal with tabs, splits, quake-style, hotkeys and more
97. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.conyedit.com" width="16"> ConyEdit](https://www.conyedit.com/download)
98. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> Cool Reader](https://sourceforge.net/projects/crengine/files/) A cross-platform XML/CSS based eBook reader
99. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> CopyQ](https://github.com/hluk/CopyQ/releases/latest) [102/1,707/138] Clipboard manager with advanced features.
100. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> CopyTranslator](https://github.com/CopyTranslator/CopyTranslator/releases) [131/2,650/308] Foreign language reading and translation assistant based on copy and translate.
101. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> cow](https://github.com/cyfdecyf/cow/releases/latest) [440/7,488/1,582] HTTP proxy written in Go. COW can automatically identify blocked sites and use parent proxies to access.
102. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.cpuid.com" width="16"> CPUID CPU-Z](https://www.cpuid.com/softwares/cpu-z.html)
103. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.cpuid.com" width="16"> CPUID HWMonitor PRO](https://www.cpuid.com/softwares/hwmonitor-pro.html) :money_with_wings:
104. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.cpuid.com" width="16"> CPUID HWMonitor](https://www.cpuid.com/softwares/hwmonitor.html)
105. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.cpuid.com" width="16"> CPUID Perfmonitor2](https://www.cpuid.com/softwares/perfmonitor-2.html)
106. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Crypter](https://github.com/HR/Crypter/releases/latest) [18/294/40] An innovative, convenient and secure cross-platform encryption app 🔒⬅️ ✨➡️🔓
107. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Crypto-Notepad](https://github.com/Crypto-Notepad/Crypto-Notepad/releases/latest) [7/52/11] :key: Simple notepad for Windows with encryption features
108. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=crystalmark.info" width="16"> CrystalDiskInfo](https://crystalmark.info/en/download/)
109. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=crystalmark.info" width="16"> CrystalDiskMark](https://crystalmark.info/en/download/)
110. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=curl.haxx.se" width="16"> curl](https://curl.haxx.se/windows/)
111. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mirrors.kernel.org" width="16"> Cygwin](http://mirrors.kernel.org/sourceware/cygwin/x86_64/)
112. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> DB Browser for SQLite](https://github.com/sqlitebrowser/sqlitebrowser/releases/latest) [479/10,871/1,261] Official home of the DB Browser for SQLite (DB4S) project. Previously known as "SQLite Database Browser" and "Database Browser for SQLite". Website at: 
113. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dbeaver.io" width="16"> DBeaver](https://dbeaver.io/download/) [Free Personal]
114. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> DBGlass](https://github.com/web-pal/DBGlass/releases/latest) [52/1,215/64] PostgreSQL client built with Electron.
115. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.deleaker.com" width="16"> Deleaker](https://www.deleaker.com/changelog.html) :money_with_wings:
116. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dev.deluge-torrent.org" width="16"> Deluge](https://dev.deluge-torrent.org/wiki/ReleaseNotes)
117. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Desktop Dimmer](https://github.com/sidneys/desktop-dimmer/releases/latest) [15/198/13] Enable darker-than-dark dimming for internal and external screens.
118. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Detect it Easy](https://github.com/horsicq/DIE-engine/releases/latest) [39/210/53] DIE engine.
119. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> DevDocs](https://github.com/egoist/devdocs-desktop/releases/latest) [57/1,891/135] 🗂 A full-featured desktop app for DevDocs.io.
120. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> DevHub](https://github.com/devhubapp/devhub/releases/latest) [70/4,378/180] DevHub: TweetDeck for GitHub - Android, iOS, Web & Desktop
121. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=truehumandesign.se" width="16"> Diffinity](http://truehumandesign.se/s_diffinity.php)
123. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.digitalvolcano.co.uk" width="16"> DigitalVolcano/Duplicate Cleaner Pro](https://www.digitalvolcano.co.uk/dcdownloads.html) :money_with_wings:
124. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.digitalvolcano.co.uk" width="16"> DigitalVolcano/Duplicate Cleaner](https://www.digitalvolcano.co.uk/dcdownloads.html)
125. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.digitalvolcano.co.uk" width="16"> DigitalVolcano/HashTool](https://www.digitalvolcano.co.uk/hash.html)
126. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.digitalvolcano.co.uk" width="16"> DigitalVolcano/TaskCanvas](https://www.digitalvolcano.co.uk/taskcanvasdownload.html) :money_with_wings:
127. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.digitalvolcano.co.uk" width="16"> DigitalVolcano/TextCrawler Pro](https://www.digitalvolcano.co.uk/tcdownloads.html) :money_with_wings:
128. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.digitalvolcano.co.uk" width="16"> DigitalVolcano/TextCrawler](https://www.digitalvolcano.co.uk/tcdownloads.html)
130. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dimio.altervista.org" width="16"> Dimio/DClean](http://dimio.altervista.org/eng/)
131. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dimio.altervista.org" width="16"> Dimio/Deep Explorer](http://dimio.altervista.org/eng/)
132. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dimio.altervista.org" width="16"> Dimio/Double Finder](http://dimio.altervista.org/eng/)
133. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dimio.altervista.org" width="16"> Dimio/DShutdown](http://dimio.altervista.org/eng/)
134. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dimio.altervista.org" width="16"> Dimio/DSpeech](http://dimio.altervista.org/eng/)
135. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dimio.altervista.org" width="16"> Dimio/DSynchronize](http://dimio.altervista.org/eng/)
136. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dimio.altervista.org" width="16"> Dimio/DTaskManager](http://dimio.altervista.org/eng/)
137. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dimio.altervista.org" width="16"> Dimio/HDHacker](http://dimio.altervista.org/eng/)
138. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> dingtalk](https://github.com/nashaofu/dingtalk/releases/latest) [55/851/137] 钉钉桌面版，基于electron和钉钉网页版开发，支持Windows、Linux和macOS.
139. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.filehorse.com" width="16"> Discord](https://www.filehorse.com/download-discord/download/) [Free Personal]
140. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.eassos.com" width="16"> DiskGenius](http://www.eassos.com/download.php) [Free Personal]
142. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Access Recovery](https://www.diskinternals.com/access-recovery/) :money_with_wings:
143. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Address Book Recovery](https://www.diskinternals.com/wab-recovery/)
144. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Bootable Recovery CD](https://www.diskinternals.com/boot-cd/)
145. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/CD-DVD Recovery](https://www.diskinternals.com/cd-dvd-recovery/) :money_with_wings:
146. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Disk Reader for Total Commander](https://www.diskinternals.com/reader-for-tc/)
147. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/EFS Recovery](https://www.diskinternals.com/efs-recovery/) :money_with_wings:
148. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Excel Recovery](https://www.diskinternals.com/excel-recovery/) :money_with_wings:
149. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/FAT Recovery](https://www.diskinternals.com/fat-recovery/) :money_with_wings:
150. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Flash Recovery](https://www.diskinternals.com/flash-recovery/) :money_with_wings:
151. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Linux Reader](https://www.diskinternals.com/linux-reader/)
152. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Linux Recovery](https://www.diskinternals.com/linux-recovery/)
153. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Mail Recovery Express](https://www.diskinternals.com/mail-recovery-express/) :money_with_wings:
154. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Mail Recovery](https://www.diskinternals.com/mail-recovery/) :money_with_wings:
155. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/MSSQL Recovery](https://www.diskinternals.com/mssql-recovery/) :money_with_wings:
156. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Music Recovery](https://www.diskinternals.com/music-recovery/) :money_with_wings:
157. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/NTFS Recovery](https://www.diskinternals.com/ntfs-recovery/) :money_with_wings:
158. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Office Recovery](https://www.diskinternals.com/office-recovery/) :money_with_wings:
159. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Outlook Recovery](https://www.diskinternals.com/outlook-recovery/) :money_with_wings:
160. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Partition Recovery](https://www.diskinternals.com/partition-recovery/) :money_with_wings:
161. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/RAID Recovery](https://www.diskinternals.com/raid-recovery/) :money_with_wings:
162. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Recovery for iPod](https://www.diskinternals.com/ipod-recovery/) :money_with_wings:
163. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Recovery Server](https://www.diskinternals.com/recovery-server/)
164. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/Uneraser](https://www.diskinternals.com/uneraser/) :money_with_wings:
165. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/VMFS Recovery](https://www.diskinternals.com/vmfs-recovery/) :money_with_wings:
166. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.diskinternals.com" width="16"> DiskInternals/ZIP Repair](https://www.diskinternals.com/zip-repair/)
167. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.chuyu.me" width="16"> Dism++](http://www.chuyu.me/zh-Hans/index.html)
168. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.displayfusion.com" width="16"> DisplayFusion](https://www.displayfusion.com/ChangeLog/) [Free Personal]
169. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=ditto-cp.sourceforge.io" width="16"> Ditto](https://ditto-cp.sourceforge.io/)
170. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> dnscrypt-proxy](https://github.com/jedisct1/dnscrypt-proxy/releases/latest) [201/3,133/263] dnscrypt-proxy 2 - A flexible DNS proxy, with support for encrypted DNS protocols.
171. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> DocFetcher](https://sourceforge.net/projects/docfetcher/files) Desktop search application
172. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Dockeron](https://github.com/dockeron/dockeron/releases/latest) [29/525/76] 🤖🤖🤖 Electron + Vue.js for Docker.
173. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.digimezzo.com" width="16"> Dopamine](https://www.digimezzo.com/content/software/dopamine/)
174. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=biblprog.com" width="16"> Dropbox](https://biblprog.com/en/dropbox/download/)
175. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> DTCP](https://github.com/alchen/DTCP/releases/latest) [4/45/9] Desktop Twitter Client Project.
176. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.duplicatecleaner.com" width="16"> Duplicate Cleaner](https://www.duplicatecleaner.com/index.html) [Free Personal]
177. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> duplicati](https://github.com/duplicati/duplicati/releases) [207/3,838/470] Store securely encrypted backups in the cloud!
178. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> DxWnd](https://sourceforge.net/projects/dxwnd/files/Latest%20build/) Window hooker to run fullscreen programs in window and much more...
179. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dynvpn.com" width="16"> DynVPN-CLI](https://dynvpn.com/download/)
180. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dynvpn.com" width="16"> DynVPN](https://dynvpn.com/download/)
181. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.eagleget.com" width="16"> EagleGet](http://www.eagleget.com/download-eagleget-portable/)
182. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=icecreamapps.com" width="16"> Ebook Reader](https://icecreamapps.com/Ebook-Reader/) [Free Personal]
183. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> eDEX-UI](https://github.com/GitSquared/edex-ui/releases/latest) [192/8,454/444] A cross-platform, customizable science fiction terminal emulator with advanced monitoring & touchscreen support.
184. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Eintopf](https://github.com/mazehall/eintopf/releases/latest) [7/61/3] The smartest way to share and administrate docker projects.
185. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ElectronReact](https://github.com/electron-react-boilerplate/electron-react-boilerplate/releases/latest) [265/11,459/1,889] A Foundation for Scalable Cross-Platform Apps.
186. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Elephant](https://github.com/jusu/Elephant/releases/latest) [20/210/26] Notetaker with a classic interface.
187. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.emdb.eu" width="16"> EMDB](http://www.emdb.eu/)
188. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.emeditor.com" width="16"> EmEditor](https://www.emeditor.com/download/) :money_with_wings:
189. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=lifeinhex.com" width="16"> Enigma Virtual Box unpacker](https://lifeinhex.com/tag/enigma-virtual-box/) :hand:
190. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=enigmaprotector.com" width="16"> Enigma Virtual Box](https://enigmaprotector.com/en/downloads/changelogenigmavb.html)
192. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> erickutcher/HTTP Downloader](https://github.com/erickutcher/httpdownloader/releases/latest) [4/12/8] HTTP(S) download manager that uses input/output completion ports (IOCP).
193. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> erickutcher/HTTP Proxy](https://github.com/erickutcher/httpproxy/releases/latest) [1/1/5] HTTP(S) proxy that uses input/output completion ports (IOCP).
194. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> erickutcher/MD5 Bruteforcer](https://github.com/erickutcher/md5bruteforcer/releases/latest) [1/0/1] Brute force MD5 hash values using CUDA.
195. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> erickutcher/Monitor Off](https://github.com/erickutcher/monitoroff/releases/latest) [1/0/0] Turn off your monitor with a simple mouse click or keyboard shortcut.
196. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> erickutcher/Thumbcache Viewer](https://github.com/thumbcacheviewer/thumbcacheviewer/releases/latest) [6/35/8] Thumbcache Viewer - Extract Windows Vista, Windows 7, Windows 8, Windows 8.1, and Windows 10 thumbcache database files.
197. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> erickutcher/Thumbs Viewer](https://github.com/thumbsviewer/thumbsviewer/releases/latest) [6/28/8] Thumbs Viewer - Extract Windows Thumbs.db database files.
198. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> erickutcher/VZ Enhanced 56K](https://github.com/erickutcher/vzenhanced56k/releases/latest) [2/2/1] VZ Enhanced 56K is a 56K based call logger/blocker.
199. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> erickutcher/VZ Enhanced](https://github.com/vzenhanced/vzenhanced/releases/latest) [4/2/0] VZ Enhanced is a caller ID notifier that can forward and block phone calls.
200. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=evernote.com" width="16"> Evernote](https://evernote.com/intl/zh-cn/download)
201. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.voidtools.com" width="16"> Everything](https://www.voidtools.com/downloads/)
202. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.1space.dk" width="16"> Executor](http://www.1space.dk/executor/downloadlinks.html)
203. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.exodus.io" width="16"> Exodus](https://www.exodus.io/download/) :money_with_wings:
204. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Extraterm](https://github.com/sedwards2009/extraterm/releases) [42/960/40] The swiss army chainsaw of terminal emulators.
205. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.easersoft.com" width="16"> ExtremeCopy](http://www.easersoft.com/product.html) :money_with_wings:
206. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=justgetflux.com" width="16"> f.lux](https://justgetflux.com/update/v4/windows-download.json)
207. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> falcon](https://github.com/plotly/falcon/releases/latest) [56/691/92] Free, open-source SQL client for Windows and Mac 🦅
208. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> FastCopy-M](https://github.com/Mapaler/FastCopy-M/releases/latest) [34/365/66] FastCopy-Multilanguage，FastCopy完整支持多国语言版.
209. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=fastcopy.jp" width="16"> FastCopy](https://fastcopy.jp/)
210. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.faststone.org" width="16"> FastStone Capture](http://www.faststone.org/FSCapturerDownload.htm) :money_with_wings:
211. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.faststone.org" width="16"> FastStone Image Viewer](http://www.faststone.org/FSViewerDownload.htm) [Freemium]
212. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.faststone.org" width="16"> FastStone MaxView](http://www.faststone.org/FSMaxViewDownload.htm) :money_with_wings:
213. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.faststone.org" width="16"> FastStone Photo Resizer](http://www.faststone.org/FSResizerDownload.htm) [Freemium]
214. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Felony](https://github.com/henryboldi/felony/releases/latest) [80/3,469/143] 🔑🔥📈 Next Level PGP.
215. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=ffmpeg.zeranoe.com" width="16"> ffmpeg](https://ffmpeg.zeranoe.com/builds/)
216. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> Fiddler Web Debugger](https://www.majorgeeks.com/mg/getmirror/fiddler,1.html) Fiddler Web Debugger is a serviceable web debugging proxy for logging all HTTP(S) traffic linking your computer and the internet, allowing for traffic inspection, breakpoint setting and more.
217. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=z-o-o-m.eu" width="16"> FileUploader](http://z-o-o-m.eu/down.htm)
218. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=filezilla-project.org" width="16"> FileZilla Server](https://filezilla-project.org/download.php?type=server)
219. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=filezilla-project.org" width="16"> FileZilla](https://filezilla-project.org/download.php?type=client)
220. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> Find And Replace@olivierwehner](https://sourceforge.net/projects/findandreplace/files/) Search and replace operations on file content accross multiple files. Recursive operations within entire directory trees. FAR comes with support for…
221. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Find and Replace@zzzprojects](https://github.com/zzzprojects/findandreplace/releases/latest) [10/70/21] fnr.exe - Find And Replace Tool.
222. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> firefly-proxy](https://github.com/yinghuocho/firefly-proxy/releases/latest) [377/4,512/855] A proxy software to help circumventing the Great Firewall.
223. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=filehippo.com" width="16"> Flamory](https://filehippo.com/zh/download_flamory/) [Freemium]
224. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.foobar2000.org" width="16"> Foobar2000](http://www.foobar2000.org/download)
225. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.fopnu.com" width="16"> Fopnu](https://www.fopnu.com/download/windows64.html)
226. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=git-fork.com" width="16"> Fork](https://git-fork.com/releasenoteswin)
227. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pcfreetime.com" width="16"> FormatFactory](http://www.pcfreetime.com/formatfactory/CN/download.html)
228. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=fotosketcher.com" width="16"> FotoSketcher](https://fotosketcher.com/download-fotosketcher/)
229. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=biblprog.com" width="16"> Foxit Reader](https://biblprog.com/en/foxit_reader/download/) [Freemium]
230. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Franz](https://github.com/meetfranz/franz/releases/latest) [110/2,765/374] Franz is a free messaging app for services like WhatsApp, Slack, Messenger and many more.
231. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> freac](https://github.com/enzo1982/freac/releases/latest) [23/170/22] The fre:ac audio converter project.
232. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=freealarmclocksoftware.com" width="16"> Free Alarm Clock](http://freealarmclocksoftware.com/) [Free Personal]
233. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.freedownloadmanager.org" width="16"> Free Download Manager](https://www.freedownloadmanager.org/download.htm)
234. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> FreeCAD](https://github.com/FreeCAD/FreeCAD/releases/latest) [429/3,526/1,250] This is the official source code of FreeCAD, a free and opensource multiplatform 3D parametric modeler. Issues are managed on our own bug tracker at https://www.freecadweb.org/tracker
235. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=freecommander.com" width="16"> FreeCommander](https://freecommander.com/en/downloads/) [Free Personal]
236. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=freefilesync.org" width="16"> FreeFileSync](https://freefilesync.org/download.php) [Free Personal] :hand:
237. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softpedia.com" width="16"> FreeGate](https://www.softpedia.com/get/Network-Tools/Misc-Networking-Tools/Freegate.shtml) :airplane: Free Download Freegate - Use this powerful software solution to visit your favorite pages while avoiding detection with enhanced speed and history a...
238. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> FreeMAN](https://github.com/matthew-matvei/freeman/releases/latest) [8/128/16] A free, extensible, cross-platform file manager for power users
239. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Freenet](https://github.com/freenet/fred/releases/latest) [72/484/147] Freenet REference Daemon.
240. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=freeter.io" width="16"> Freeter](https://freeter.io/download) [Free Personal]
241. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> FromScratch](https://github.com/Kilian/fromscratch/releases/latest) [22/474/51] Autosaving Scratchpad. A simple but smart note-taking app
242. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> FrostWire](https://github.com/frostwire/frostwire/releases) [28/191/106] An easy to use Cloud Downloader, BitTorrent Client and Media Player. Search, Download, Play, Share
243. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> fzf](https://github.com/junegunn/fzf-bin/releases/latest) [9/62/1] Dummy repository to serve binary releases of fzf.
244. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> gallery-dl](https://github.com/mikf/gallery-dl/releases/latest) [41/434/59] Command-line program to download image-galleries and -collections from several image hosting sites
245. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Ganache](https://github.com/trufflesuite/ganache/releases/latest) [69/1,484/233] Personal blockchain for Ethereum development.
246. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.geany.org" width="16"> Geany](https://www.geany.org/Download/Releases)
247. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=ftp.gnome.org" width="16"> gedit](http://ftp.gnome.org/pub/GNOME/binaries/win64/gedit/)
248. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> genet](https://github.com/genet-app/genet/releases/latest) [6/149/18] Graphical network analyzer powered by web technologies
249. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Ghost](https://github.com/TryGhost/Ghost-Desktop/releases/latest) [55/993/160] ⚡️ Ghost for Desktops.
250. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=en.softonic.com" width="16"> GifCam](https://en.softonic.com/download/gifcam/windows/post-download)
251. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=eternallybored.org" width="16"> Gifsicle](https://eternallybored.org/misc/gifsicle/)
253. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gillmeister-software.com" width="16"> Gillmeister Software/Automatic Email Processor](https://gillmeister-software.com/products/automatic-email-processor/download.aspx)
254. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gillmeister-software.com" width="16"> Gillmeister Software/AutoText Master](https://gillmeister-software.com/products/autotext-master/download.aspx)
255. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gillmeister-software.com" width="16"> Gillmeister Software/Batch Text Replacer](https://gillmeister-software.com/products/batch-text-replacer/download.aspx)
256. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.folder2list.com" width="16"> Gillmeister Software/Folder2List](https://www.folder2list.com/download.aspx)
257. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.outlook-attachment-extractor.com" width="16"> Gillmeister Software/Outlook Attachment Extractor](https://www.outlook-attachment-extractor.com/download.aspx)
258. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.rename-expert.com" width="16"> Gillmeister Software/Rename Expert](https://www.rename-expert.com/download.aspx)
259. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gillmeister-software.com" width="16"> Gillmeister Software/Word Text Replacer](https://gillmeister-software.com/products/word-text-replacer/download.aspx)
260. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.gimp.org" width="16"> GIMP](https://www.gimp.org/downloads/)
261. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Git Extensions](https://github.com/gitextensions/gitextensions/releases) [251/3,702/1,186] Git Extensions is a standalone UI tool for managing git repositories. It also integrates with Windows Explorer and Microsoft Visual Studio (2010/2012/2013/2015/2017).
262. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Git-it](https://github.com/jlord/git-it-electron/releases/latest) [179/2,772/671] :computer: :mortar_board: Git-it is a (Mac, Win, Linux) Desktop App for Learning Git and GitHub
263. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Git](https://github.com/git-for-windows/git/releases/latest) [450/4,233/15,254] A fork of Git containing Windows-specific patches.
264. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=central.github.com" width="16"> GitHub](https://central.github.com/deployments/desktop/desktop/changelog.json)
265. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.gitkraken.com" width="16"> GitKraken](https://www.gitkraken.com/download) [Freemium]
266. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> GitNote](https://github.com/zhaopengme/gitnote/releases/latest) [24/512/24] A modern note taking app based on GIT that does not require a local GIT environment.
268. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Absolute Uninstaller](https://www.glarysoft.com/absolute-uninstaller/)
269. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Disk SpeedUp](https://www.glarysoft.com/disk-speedup/)
270. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Glary Disk Cleaner](https://www.glarysoft.com/disk-cleaner/)
271. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Glary Disk Explorer](https://www.glarysoft.com/disk-explorer/)
272. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Glary Duplicate Cleaner](https://www.glarysoft.com/duplicate-cleaner/)
273. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Glary Tracks Eraser](https://www.glarysoft.com/tracks-eraser/)
274. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Glary Undelete](https://www.glarysoft.com/glary-undelete/)
275. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Glary Utilities Pro](https://www.glarysoft.com/glary-utilities-pro/) :money_with_wings:
276. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Glary Utilities](https://www.glarysoft.com/glary-utilities/)
277. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Malware Hunter](https://www.glarysoft.com/malware-hunter/) :money_with_wings:
278. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Quick Search](https://www.glarysoft.com/quick-search/)
279. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Quick Startup](https://www.glarysoft.com/quick-startup/)
280. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Registry Repair](https://www.glarysoft.com/registry-repair/)
281. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Software Update Pro](https://www.glarysoft.com/software-update/) :money_with_wings:
282. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.glarysoft.com" width="16"> Glarysoft/Software Update](https://www.glarysoft.com/software-update/)
283. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=getglimpses.com" width="16"> glimpses](https://getglimpses.com/)
284. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.gnupg.org" width="16"> GnuPG](https://www.gnupg.org/download/index.html)
285. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> goflyway](https://github.com/coyove/goflyway/releases) [177/3,620/560] An encrypted HTTP server.
286. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=golang.org" width="16"> golang](https://golang.org/dl/)
287. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=api.pzhacm.org" width="16"> Google Chrome](https://api.pzhacm.org/iivb/cu.json)
288. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=biblprog.com" width="16"> Google Drive](https://biblprog.com/en/google_drive/download/)
289. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Google-Play-Music](https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases/latest) [303/7,541/733] A beautiful cross platform Desktop Player for Google Play Music
291. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gottcode.org" width="16"> GottCode/Connectagram](https://gottcode.org/connectagram/)
292. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gottcode.org" width="16"> GottCode/CuteMaze](https://gottcode.org/cutemaze/)
293. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gottcode.org" width="16"> GottCode/FocusWriter](https://gottcode.org/focuswriter/)
294. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gottcode.org" width="16"> GottCode/Gottet](https://gottcode.org/gottet/)
295. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gottcode.org" width="16"> GottCode/Hexalate](https://gottcode.org/hexalate/)
296. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gottcode.org" width="16"> GottCode/Kapow](https://gottcode.org/kapow/)
297. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gottcode.org" width="16"> GottCode/NovProg](https://gottcode.org/novprog/)
298. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gottcode.org" width="16"> GottCode/Peg-E](https://gottcode.org/peg-e/)
299. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gottcode.org" width="16"> GottCode/Simsu](https://gottcode.org/simsu/)
300. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gottcode.org" width="16"> GottCode/Tanglet](https://gottcode.org/tanglet/)
301. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gottcode.org" width="16"> GottCode/Tetzle](https://gottcode.org/tetzle/)
302. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=gpg4win.org" width="16"> Gpg4win](https://gpg4win.org/download.html)
303. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.techpowerup.com" width="16"> GPU-Z](https://www.techpowerup.com/download/techpowerup-gpu-z/)
304. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.filehorse.com" width="16"> Grammarly](https://www.filehorse.com/download-grammarly/)
305. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> GroupMe](https://github.com/dcrousso/GroupMe/releases/latest) [5/59/6] Unofficial GroupMe App.
306. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> gVim](https://github.com/vim/vim-win32-installer/releases/latest) [84/733/94] Vim Win32 Installer.
307. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=hackolade.com" width="16"> Hackolade](https://hackolade.com/download.html) :money_with_wings:
308. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Hain](https://github.com/hainproject/hain/releases/latest) [116/2,943/146] An 'alt+space' launcher for Windows, built with Electron
309. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=handbrake.fr" width="16"> HandBrake](https://handbrake.fr/downloads.php)
310. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> HappyPanda X](https://github.com/happypandax/happypandax/releases/latest) [33/135/14] A cross-platform server and client application for managing and reading manga and doujinshi
311. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Harmony](https://github.com/vincelwt/harmony/releases/latest) [Free Personal] [33/766/66] :musical_note: Sleek music player for Spotify, SoundCloud, Google Play Music and your local files
313. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=updates.haztek-software.com" width="16"> HazteK-Software/Host File Manager](https://updates.haztek-software.com/changes.php?appid=7)
314. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=updates.haztek-software.com" width="16"> HazteK-Software/Remote Manager](https://updates.haztek-software.com/changes.php?appid=8)
315. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=updates.haztek-software.com" width="16"> HazteK-Software/SHAsher](https://updates.haztek-software.com/changes.php?appid=6)
316. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=updates.haztek-software.com" width="16"> HazteK-Software/Simple Phone Book](https://updates.haztek-software.com/changes.php?appid=5)
317. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=updates.haztek-software.com" width="16"> HazteK-Software/SMTP Mail Sender](https://updates.haztek-software.com/changes.php?appid=4)
318. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=updates.haztek-software.com" width="16"> HazteK-Software/StorURL](https://updates.haztek-software.com/changes.php?appid=1)
319. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=updates.haztek-software.com" width="16"> HazteK-Software/TrueIP](https://updates.haztek-software.com/changes.php?appid=2)
320. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=hddscan.com" width="16"> HDDScan](http://hddscan.com/)
321. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Headset](https://github.com/headsetapp/headset-electron/releases/latest) [28/621/70] Official Headset repo.
322. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.helpandmanual.com" width="16"> Help+Manual](https://www.helpandmanual.com/downloads.html) :money_with_wings:
323. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.helpndoc.com" width="16"> HelpNDoc](https://www.helpndoc.com/download/) [Freemium]
324. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.rejetto.com" width="16"> HFS](http://www.rejetto.com/hfs/?f=dl)
325. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dejavu.narod.ru" width="16"> HiddeX](http://dejavu.narod.ru/hiddex.html)
326. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=hide.me" width="16"> Hide.me](https://hide.me/en/software/windows) [Free Personal]
327. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> HostsMan](https://www.majorgeeks.com/mg/getmirror/hostsman,1.html) HostsMan is a freeware application that lets you manage your Hosts file with ease....
328. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=hotalarmclock.com" width="16"> Hot Alarm Clock](https://hotalarmclock.com/download/) [Free Personal]
329. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.filehorse.com" width="16"> HotspotShield](https://www.filehorse.com/download-hotspot-shield/download/) [Free Personal] :airplane:
330. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Hourglass](https://github.com/dziemborowicz/hourglass/releases/latest) [16/179/40] The simple countdown timer for Windows.
331. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.httrack.com" width="16"> HTTrack](http://www.httrack.com/page/2/en/index.html)
332. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.hwinfo.com" width="16"> HWiNFO](https://www.hwinfo.com/download/)
333. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mh-nexus.de" width="16"> HxD](https://mh-nexus.de/en/downloads.php?product=HxD20)
334. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Hyper](https://github.com/zeit/hyper/releases) [491/27,792/2,266] A terminal built on web technologies.
335. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> igdm](https://github.com/ifedapoolarewaju/igdm/releases/latest) [123/1,029/255] Desktop application for Instagram DMs.
336. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ILSpy](https://github.com/icsharpcode/ILSpy/releases/latest) [635/7,174/1,592] .NET Decompiler.
337. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=imagemagick.org" width="16"> ImageMagick](https://imagemagick.org/script/download.php)
338. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Imagemin](https://github.com/imagemin/imagemin-app/releases/latest) [26/744/51] imagemin as an OS X, Linux and Windows app.
339. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Inboxer](https://github.com/denysdovhan/inboxer/releases/latest) [52/625/62] Unofficial, free and open-source Inbox by Gmail Desktop App
340. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=inkscape.org" width="16"> Inkscape](https://inkscape.org/release/)
341. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> Inno Setup Unpacker](https://sourceforge.net/projects/innounp/files/innounp/) Unpacker for installations made by Inno Setup
342. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.jrsoftware.org" width="16"> Inno Setup](http://www.jrsoftware.org/isdl.php)
343. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> innoextract](https://github.com/dscharrer/innoextract/releases/latest) [22/197/35] A tool to unpack installers created by Inno Setup.
344. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.havysoft.cl" width="16"> InnoExtractor](http://www.havysoft.cl/descargar.html)
345. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Insomnia](https://github.com/getinsomnia/insomnia/releases/latest) [Free Personal] [156/9,228/492] Cross-platform HTTP and GraphQL Client.
346. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=data.services.jetbrains.com" width="16"> IntelliJ IDEA Community](https://data.services.jetbrains.com/products/releases?code=IIC&latest=true&type=release)
347. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=data.services.jetbrains.com" width="16"> IntelliJ IDEA Ultimate](https://data.services.jetbrains.com/products/releases?code=IIU&latest=true&type=release) :money_with_wings:
348. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.westbyte.com" width="16"> Internet Download Accelerator](https://www.westbyte.com/ida/index.phtml?page=download) [Freemium]
349. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.internetdownloadmanager.com" width="16"> Internet Download Manager](http://www.internetdownloadmanager.com/) :money_with_wings: :hand:
359. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/Advanced SystemCare](https://www.majorgeeks.com/mg/getmirror/advanced_systemcare,1.html) Advanced SystemCare is a popular and efficient all-in-one computer tweaker that will help clean, optimize, speed up and protect your computer. Video tutorial available.
360. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/Driver Booster](https://www.majorgeeks.com/mg/getmirror/iobit_driver_booster,1.html) Driver Booster can identify, back up and fix outdated, missing or incorrect drivers on your computer.
361. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/IObit Game Booster](https://www.majorgeeks.com/mg/getmirror/iobit_game_booster,1.html) Designed to help optimize your PC for smoother, more responsive game play in the latest PC games with the touch of a button, Game Booster helps achieve the performance edge previously only available t...
362. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/IObit Malware Fighter](https://www.majorgeeks.com/mg/getmirror/iobit_malware_fighter,1.html) IObit Malware Fighter 6 is an advanced malware & spyware removal utility that detects and removes the deepest infections and protects your PC from malicious behavior in real time. With the world leading Bitdefender antivirus engine, IObit Anti-malware engine, and Anti-ransomware Engine, IObit Malware Fighter 6 can remove the latest spyware, adware, ransomware, Trojans, keyloggers, bots, worms, hijackers, and viruses, etc.
      
363. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/IObit Toolbox](https://www.majorgeeks.com/mg/getmirror/iobit_toolbox,1.html) IObit Toolbox is a free portable software that system administrators and computer geeks will take along to solve PC problems anytime and anywhere. With more than 20 dedicated tools, IObit Toolbox allo...
364. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/IObit Undelete](https://www.majorgeeks.com/mg/getmirror/iobit_undelete,1.html) IObit Undelete is a no-nonsense solution for recovering lost or deleted files.
365. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/IObit Uninstaller](https://www.majorgeeks.com/mg/getmirror/iobit_uninstaller,1.html) IObit Uninstaller helps you remove unwanted programs and browser plug-ins/toolbars completely even when Windows "Add or Remove Programs" fails. Video tutorial available.
366. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/IObit Unlocker](https://www.majorgeeks.com/mg/getmirror/iobit_unlocker,1.html) If you are trying to delete a file or folder in Windows, and see annoying messages like "Cannot delete file: Access is denied;" then IObit Unlocker is the ideal tool for such conditions. 
367. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/Protected Folder](https://www.majorgeeks.com/mg/getmirror/iobit_protected_folder,1.html) Protected Folder is designed to password-protect your folders and files from being seen, read or modified. It works like a safety box, just drag and drop the folders or files you want to hide or prote...
368. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/Random Password Generator](https://www.majorgeeks.com/mg/getmirror/random_password_generator,1.html) Random Password Generator is developed to create powerful passwords which are not easy to be cracked. This smart and easy-to-use tool allows you to securely and easily manage your passwords and IDs wi...
369. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/Smart Defrag](https://www.majorgeeks.com/mg/getmirror/iobit_smartdefrag,1.html) Smart Defrag can defragment files, folder, and entire drives as needed or scheduled. It also features SSD trimming to prolong your SDD performance and life.
370. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/Start Menu 8](https://www.majorgeeks.com/mg/getmirror/start_menu_8,1.html) Start Menu 8 is for users who don't like the start screen in Windows 8 & Windows 10. You can bring back both the classic Start button and Start Menu and customize it any way you like.
371. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> IObit/WinMetro](https://www.majorgeeks.com/mg/getmirror/winmetro,1.html) WinMetro is specially designed to bring the newly introduced Windows 8 Metro UI to Windows 7, Windows Vista and Windows XP.
372. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ipneed.com" width="16"> IP雷达](http://www.ipneed.com/main/download.html)
373. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ISx](https://github.com/lifenjoiner/ISx/releases/latest) [6/17/9] ISx is an InstallShield installer extractor.
374. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> James](https://github.com/james-proxy/james/releases/latest) [43/1,035/91] Web Debugging Proxy Application.
375. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> jasper](https://github.com/jasperapp/jasper/releases/latest) [28/991/45] Jasper - A flexible and powerful issue reader for GitHub
376. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=l.acesheep.com" width="16"> JiJiDownForWPF](http://l.acesheep.com/bili/re.php?callback=?)
377. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Joplin](https://github.com/laurent22/joplin/releases/latest) [223/6,863/532] Joplin - a note taking and to-do application with synchronization capabilities for Windows, macOS, Linux, Android and iOS. Forum: https://discourse.joplin.cozic.net/
378. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> K-Lite Codec Pack Basic](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_basic,1.html) K-Lite Codec Pack is a collection of components needed for audio and video playback in DirectShow players such as Windows Media Player, Media Center, and Media Player Classic. It is designed as a user-friendly solution for playing all your movie files. You should be able to play all the popular movie formats and even some rare formats.
379. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> K-Lite Codec Pack Full](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_full,1.html) K-Lite Codec Pack is a collection of components needed for audio and video playback in DirectShow players such as Windows Media Player, Media Center, and Media Player Classic. It is designed as a user-friendly solution for playing all your movie files. You should be able to play all the popular movie formats and even some rare formats.
380. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> K-Lite Codec Pack Standard](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_standard,1.html) K-Lite Codec Pack is a collection of components needed for audio and video playback in DirectShow players such as Windows Media Player, Media Center, and Media Player Classic. It is designed as a user-friendly solution for playing all your movie files. You should be able to play all the popular movie formats and even some rare formats.
381. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> K-Lite Codec Pack Update](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_update,1.html) K-Lite Codec Pack Update is a cumulative update for the latest version of the popular K-Lite Codec Packs.
382. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Kakapo](https://github.com/bluedaniel/Kakapo-app/releases/latest) [17/351/32] :musical_note: [Web & Desktop] An open source ambient sound mixer
383. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Kaku](https://github.com/EragonJ/Kaku/releases/latest) [59/915/106] 🎧 Kaku is a highly integrated music player supports different online platform like YouTube, SoundCloud, Vimeo and more. Available on Mac, Windows and Linux.
385. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/ARPMiner](https://www.kaplansoft.com/download.html)
386. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/DBConverter](https://www.kaplansoft.com/download.html)
387. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/ENUM Resolver](https://www.kaplansoft.com/download.html)
388. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/SipCLI](https://www.kaplansoft.com/download.html)
389. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/SIPob](https://www.kaplansoft.com/download.html)
390. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/SMPPCli](https://www.kaplansoft.com/download.html)
391. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/Tekaba](https://www.kaplansoft.com/download.html)
392. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekCERT](https://www.kaplansoft.com/download.html)
393. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekConSer](https://www.kaplansoft.com/download.html)
394. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekENUM](https://www.kaplansoft.com/download.html)
395. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekFax](https://www.kaplansoft.com/download.html)
396. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekIVR](https://www.kaplansoft.com/download.html)
397. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekOTP](https://www.kaplansoft.com/download.html)
398. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekPhone](https://www.kaplansoft.com/download.html)
399. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekRADIUS LT](https://www.kaplansoft.com/download.html)
400. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekRADIUS](https://www.kaplansoft.com/download.html)
401. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekRecorder](https://www.kaplansoft.com/download.html)
402. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekSIP Route Server](https://www.kaplansoft.com/download.html)
403. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekSIP](https://www.kaplansoft.com/download.html)
404. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekSMTP](https://www.kaplansoft.com/download.html)
405. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekTape](https://www.kaplansoft.com/download.html)
406. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TekWiFi](https://www.kaplansoft.com/download.html)
407. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/TelCLI](https://www.kaplansoft.com/download.html)
408. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kaplansoft.com" width="16"> KaplanSoft/WebKilit](https://www.kaplansoft.com/download.html)
410. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/ApHeMo](https://www.kcsoftwares.com/?download) :money_with_wings:
411. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/Audiograil](https://www.kcsoftwares.com/?download) :money_with_wings:
412. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/AVIToolbox](https://www.kcsoftwares.com/?download) :money_with_wings:
413. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/BATExpert](https://www.kcsoftwares.com/?download)
414. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/dot11Expert](https://www.kcsoftwares.com/?download) :money_with_wings:
415. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/DUMo](https://www.kcsoftwares.com/?download) :money_with_wings:
416. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/HDDExpert](https://www.kcsoftwares.com/?download)
417. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/IDPhotoStudio](https://www.kcsoftwares.com/?download)
418. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/Ignition](https://www.kcsoftwares.com/?download)
419. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/K-ML](https://www.kcsoftwares.com/?download) :money_with_wings:
420. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/KCleaner](https://www.kcsoftwares.com/?download) [Free Personal]
421. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/KFK](https://www.kcsoftwares.com/?download)
422. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/MassCert](https://www.kcsoftwares.com/?download)
423. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/PhotoToFilm](https://www.kcsoftwares.com/?download) :money_with_wings:
424. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/PortExpert](https://www.kcsoftwares.com/?download)
425. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/RAMExpert](https://www.kcsoftwares.com/?download)
426. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/Startup Sentinel](https://www.kcsoftwares.com/?download)
427. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/SUMo](https://www.kcsoftwares.com/?download) [Free Personal]
428. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/Vampix](https://www.kcsoftwares.com/?download)
429. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/VideoInspector](https://www.kcsoftwares.com/?download)
430. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kcsoftwares.com" width="16"> KC Softwares/Zer0](https://www.kcsoftwares.com/?download)
432. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=community.kde.org" width="16"> KDE/Amarok](https://community.kde.org/Amarok/GettingStarted/Download/Windows)
433. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mirrors.shu.edu.cn" width="16"> KDE/digiKam](https://mirrors.shu.edu.cn/kde/ftp/stable/digikam/?C=N&O=D)
434. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.falkon.org" width="16"> KDE/Falkon](https://www.falkon.org/)
435. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mirrors.shu.edu.cn" width="16"> KDE/Kate](https://mirrors.shu.edu.cn/kde/ftp/stable/kate/?C=N&O=D)
436. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kdevelop.org" width="16"> KDE/KDevelop](https://www.kdevelop.org/download)
437. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> KDE/KDiff3](https://sourceforge.net/projects/kdiff3/files/kdiff3/) A graphical text difference analyzer
438. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mirrors.shu.edu.cn" width="16"> KDE/KEXI](https://mirrors.shu.edu.cn/kde/ftp/stable/kexi/win64/)
439. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mirrors.shu.edu.cn" width="16"> KDE/KMyMoney](https://mirrors.shu.edu.cn/kde/ftp/stable/kmymoney/latest/win64/)
440. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=krita.org" width="16"> KDE/Krita](https://krita.org/en/download/krita-desktop/)
441. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=marble.kde.org" width="16"> KDE/Marble](https://marble.kde.org/install.php)
442. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mirrors.shu.edu.cn" width="16"> KDE/Umbrello](https://mirrors.shu.edu.cn/kde/ftp/stable/umbrello/latest/win64/)
443. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=keepass.info" width="16"> KeePass](https://keepass.info/download.html)
444. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> KeeWeb](https://github.com/keeweb/keeweb/releases/latest) [256/7,357/605] Free cross-platform password manager compatible with KeePass
445. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> KeyNote NF](https://github.com/dpradov/keynote-nf/releases/latest) [28/125/42] Tabbed notebook with RichText editor, multi-level notes and strong encryption.
446. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Keypirinha](https://github.com/Keypirinha/Keypirinha/releases/latest) [29/385/9] A fast keystroke launcher for Windows.
447. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kinza.jp" width="16"> Kinza](https://www.kinza.jp/en/download/thankyou/windows_x64/)
448. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Kitematic](https://github.com/docker/kitematic/releases/latest) [359/9,935/1,175] Visual Docker Container Management on Mac & Windows
449. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softpedia.com" width="16"> KiTTY](https://www.softpedia.com/get/Network-Tools/Telnet-SSH-Clients/9bis-KiTTY.shtml) Free Download KiTTY - This application is a fork from version 0.67 of the PuTTY SSH/ Telnet client, providing users with additional features and imp...
450. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.majorgeeks.com" width="16"> KMPlayer](https://www.majorgeeks.com/mg/getmirror/kmplayer,1.html) KMPlayer is a full-featured movie and audio player that supports a wide range of codecs and file formats. One nice thing about this multimedia player is that the internal Codec is fully processed, for speed and safety, within KMPlayer - making it less complicated and time-consuming.
451. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=kodi.tv" width="16"> Kodi](https://kodi.tv/download/849)
452. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Koko](https://github.com/KokoIRC/koko/releases/latest) [9/306/29] Yet another IRC client for me and you :koko:.
453. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=koofr.eu" width="16"> Koofr](https://koofr.eu/desktop-apps/) [Free Personal]
454. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Koromo Copy](https://github.com/dc-koromo/koromo-copy/releases/latest) [3/19/0] WPF-based downloader, file-manager program that implements Hitomi Downloader as main function
455. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> LabelPlus](https://github.com/LabelPlus/LabelPlus/releases/latest) [5/37/3] Easy tool for comic translation.
456. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softpedia.com" width="16"> Lantern](https://www.softpedia.com/get/Internet/Servers/Proxy-Servers/Lantern.shtml) Free Download Lantern - Get access to restricted or unavailable websites from anywhere across the world with the help of this efficient tool that ca...
457. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.last.fm" width="16"> Last.fm Scrobbler](https://www.last.fm/about/trackmymusic)
458. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> launch4j](https://sourceforge.net/projects/launch4j/files/) Cross-platform Java executable wrapper for creating lightweight Windows native EXEs. Provides advanced JRE search, application startup configuration…
459. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=app.leanote.com" width="16"> Leanote](http://app.leanote.com/) [Free Personal]
460. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Lepton](https://github.com/hackjutsu/Lepton/releases/latest) [151/4,999/249] 💻    Democratizing Snippet Management (macOS/Win/Linux)
461. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> LibreCAD](https://github.com/LibreCAD/LibreCAD/releases/latest) [155/1,157/459] LibreCAD is a cross-platform 2D CAD program written in C++11 using the Qt framework. It can read DXF and DWG files and can write DXF, PDF and SVG files. The user interface is highly customizable, and has dozens of translations.
462. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.libreoffice.org" width="16"> LibreOffice](https://www.libreoffice.org/download/download/) :airplane:
463. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.cockos.com" width="16"> LICEcap](https://www.cockos.com/licecap/)
464. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=light-alloy.verona.im" width="16"> Light Alloy](http://light-alloy.verona.im/download/)
465. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> lightGallery](https://github.com/sachinchoolur/lightgallery-desktop/releases/latest) [27/858/71] A modern, electron and nodejs based image viewer for Mac, Windows and Linux.
466. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> lightsocks](https://github.com/gwuhaolin/lightsocks/releases/latest) [137/2,415/548] ⚡️一个轻巧的网络混淆代理🌏.
467. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> LightTable](https://github.com/LightTable/LightTable/releases/latest) [467/10,486/900] The Light Table IDE ⛺.
468. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> lintalist](https://github.com/lintalist/lintalist/releases/latest) [11/69/14] Searchable interactive texts to copy & paste text, run scripts, using easily exchangeable bundles
469. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.listary.com" width="16"> Listary](https://www.listary.com/download) [Free Personal]
470. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Listen 1](https://github.com/listen1/listen1_desktop/releases/latest) [65/1,149/266] one for all free music in china (Windows, Mac, Linux desktop)
471. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> LMMS](https://github.com/LMMS/lmms/releases/latest) [213/2,588/466] Cross-platform music production software.
472. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Locale-Emulator](https://github.com/xupefei/Locale-Emulator/releases/latest) [231/3,324/306] Yet Another System Region and Language Simulator.
473. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.filehorse.com" width="16"> LogMeIn Hamachi](https://www.filehorse.com/download-logmein-hamachi/download/) [Free Personal]
474. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Loop Drop](https://github.com/mmckegg/loop-drop-app/releases/latest) [32/736/81] MIDI looper, modular synth and sampler app built using Web Audio and Web MIDI APIs
475. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> LosslessCut](https://github.com/mifi/lossless-cut/releases/latest) [92/2,019/132] Save space by quickly and losslessly trimming video and audio files
476. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Lua for Windows](https://github.com/rjpcomputing/luaforwindows/releases/latest) [129/1,048/220] Lua for Windows is a 'batteries included environment' for the Lua scripting language on Windows. NOTICE: Looking for maintainer.
477. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> LuaBinaries](https://sourceforge.net/projects/luabinaries/files/) LuaBinaries is a distribution of the Lua libraries and executables compiled for several platforms.
478. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Luna](https://github.com/rvpanoz/luna/releases/latest) [12/510/28] npm management through a modern UI. Created with ReactJS and Redux, Material-UI. Bundled with Webpack. Build on Electron.
479. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=lynx.invisible-island.net" width="16"> lynx](https://lynx.invisible-island.net/release/breakout/CHANGES)
480. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=madvr.com" width="16"> MadVR](http://madvr.com/)
481. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Mahou](https://github.com/BladeMight/Mahou/releases/latest) [22/195/25] Mahou(魔法) - The magic layout switcher.
482. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Mailspring](https://github.com/Foundry376/Mailspring/releases/latest) [139/5,735/335] :love_letter: A beautiful, fast and maintained fork of @Nylas Mail by one of the original authors.
483. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Mancy](https://github.com/princejwesley/Mancy/releases/latest) [63/2,613/156]  >_ Electron based NodeJS REPL :see_no_evil:.
484. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> MangaRipper](https://github.com/NguyenDanPhuong/MangaRipper/releases/latest) [34/112/33] This software helps you download manga (Japanese Comic) from several websites for your offline viewing. 
485. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Manta](https://github.com/hql287/Manta/releases/latest) [104/4,366/299] 🎉 Flexible invoicing desktop app with beautiful & customizable templates.
486. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Markn](https://github.com/minodisk/markn/releases/latest) [2/130/4] Lightweight markdown viewer.
487. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> MarkRight](https://github.com/dvcrn/markright/releases/latest) [25/908/59] ➡ Electron powered markdown editor with live preview
488. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> MarkText](https://github.com/marktext/marktext/releases/latest) [186/9,173/581] 📝Next generation markdown editor, running on platforms of MacOS Windows and Linux.
489. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Marky](https://github.com/vesparny/marky/releases/latest) [11/347/41] A markdown editor built with Electron and React.
490. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.havysoft.cl" width="16"> MassTube](http://www.havysoft.cl/descargar.html) [Free Personal]
491. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Materialette](https://github.com/mike-schultz/materialette/releases/latest) [32/1,027/63] Materialette - A material design color palette.
492. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Mattermost](https://github.com/mattermost/desktop/releases/latest) [69/881/311] Mattermost Desktop application for Windows, Mac and Linux
493. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.maxthon.cn" width="16"> Maxthon](http://www.maxthon.cn/mx5/changelog/)
494. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.alexnolan.net" width="16"> MDB Viewer Plus](http://www.alexnolan.net/software/mdbplus.xml)
495. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mediaarea.net" width="16"> MediaInfo-CLI](https://mediaarea.net/en/MediaInfo/Download/Windows)
496. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mediaarea.net" width="16"> MediaInfo](https://mediaarea.net/en/MediaInfo/Download/Windows)
497. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=raw.githubusercontent.com" width="16"> MEGAcmd](https://raw.githubusercontent.com/meganz/MEGAcmd/master/build/megacmd/megacmd.changes)
498. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> megacmd@t3rm1n4l](https://github.com/t3rm1n4l/megacmd/releases/latest) [45/417/71] A command-line client for mega.co.nz storage service
499. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softpedia.com" width="16"> MegaDownloader](https://www.softpedia.com/get/Internet/Download-Managers/MegaDownloader.shtml) Free Download MegaDownloader - Grab or retrieve files from MEGA links and enjoy videos online even without a browser installed using this straightfo...
500. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=megatools.megous.com" width="16"> Megatools](https://megatools.megous.com/)
501. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> MeGUI](https://sourceforge.net/projects/megui/files) MeGUI is the most comprehensive GUI based ISO MPEG-4 solution. It suports MPEG-4 ASP (xvid), MPEG-4 AVC (x264), AAC, MP2, MP3, Flac, Vorbis, AC3…
502. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=meldmerge.org" width="16"> Meld](http://meldmerge.org/)
503. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> MemReduct](https://github.com/henrypp/memreduct/releases/latest) [49/392/93] Lightweight real-time memory management application to monitor and clean system memory on your computer.
504. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mercurial-scm.org" width="16"> Mercurial](https://www.mercurial-scm.org/wiki/Download)
505. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Messenger](https://github.com/aluxian/Messenger-for-Desktop/releases/latest) [118/2,159/291] Bring messenger.com to your OS X, Windows or Linux desktop.
506. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=miktex.org" width="16"> MiKTeX](https://miktex.org/download)
507. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Min](https://github.com/minbrowser/min/releases/latest) [99/2,899/270] A smarter, faster web browser.
509. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mindgems.com" width="16"> MindGems/Audio Dedupe](https://www.mindgems.com/products/Duplicate-MP3-Finder/Audio-Dedupe-Download.htm) :money_with_wings:
510. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mindgems.com" width="16"> MindGems/Boss Key](https://www.mindgems.com/products/Boss-Key/boss-key-download.htm) :money_with_wings:
511. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mindgems.com" width="16"> MindGems/Easy Screen Capture And Annotation ](https://www.mindgems.com/products/Easy-Screen-Capture-AA/ESCAA-Download.htm) :money_with_wings:
512. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mindgems.com" width="16"> MindGems/Easy Web Gallery Builder](https://www.mindgems.com/products/Easy-Web-Gallery-Builder/Easy_Web_Gallery_Builder-Download.htm) :money_with_wings:
513. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mindgems.com" width="16"> MindGems/Fast Duplicate File Finder](https://www.mindgems.com/products/Fast-Duplicate-File-Finder/Fast-Duplicate-File-Finder-Download.htm)
514. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mindgems.com" width="16"> MindGems/Folder Size](https://www.mindgems.com/products/Folder-Size/Folder-Size-Download.htm)
515. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mindgems.com" width="16"> MindGems/Visual Similarity Duplicate Image Finder](https://www.mindgems.com/products/VS-Duplicate-Image-Finder/VSDIF-Download.htm) :money_with_wings:
516. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> MinGit](https://github.com/git-for-windows/git/releases/latest) [450/4,233/15,254] A fork of Git containing Windows-specific patches.
517. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> MinGW-w64](https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/) A complete runtime environment for gcc
518. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.partitionwizard.com" width="16"> MiniTool Partition Wizard](https://www.partitionwizard.com/upgrade-history.html) [Free Personal]
519. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.minitool.com" width="16"> MiniTool Power Data Recovery](https://www.minitool.com/data-recovery-software/upgrade-history.html) [Free Personal]
520. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.minitool.com" width="16"> MiniTool ShadowMaker](https://www.minitool.com/backup/upgrade-history.html) [Free Personal]
522. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mirillis.com" width="16"> Mirillis/Action](https://mirillis.com/download-action)
523. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=monflo.mirillis.com" width="16"> Mirillis/Monflo](https://monflo.mirillis.com/download/thank-you?file=monflopc) :money_with_wings:
524. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mirillis.com" width="16"> Mirillis/Splash](https://mirillis.com/download-splash-free-hd-video-player)
525. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Mist Browser](https://github.com/ethereum/mist/releases/latest) [770/7,238/1,844] Mist. Browse and use Ðapps on the Ethereum network.
526. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mitec.cz" width="16"> MiTec EXE Explorer](http://www.mitec.cz/index.html)
527. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mitec.cz" width="16"> MiTec Task Manager DeLuxe](http://www.mitec.cz/Data/XML/data_tmxvh.xml)
528. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mixxx.org" width="16"> Mixxx](https://mixxx.org/download/)
529. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mkvtoolnix.download" width="16"> MKVToolNix](https://mkvtoolnix.download/doc/NEWS.md)
530. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mobaxterm.mobatek.net" width="16"> MobaXterm](https://mobaxterm.mobatek.net/download-home-edition.html) [Free Personal]
531. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Mockoon](https://github.com/255kb/mockoon/releases/latest) [27/1,055/40] Mockoon is the easiest and quickest way to run mock APIs locally. No remote deployment, no account required, open source.
532. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Moeditor](https://github.com/Moeditor/Moeditor/releases/latest) [103/3,773/251] Your all-purpose markdown editor.
533. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Mongotron](https://github.com/officert/mongotron/releases/latest) [73/2,512/209] Cross platform Mongo DB management.
534. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Motrix](https://github.com/agalwood/Motrix/releases) [96/5,594/462] A full-featured download manager.
536. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mozilla.org" width="16"> Mozilla/Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/notes/)
537. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mozilla.org" width="16"> Mozilla/Firefox Nightly](https://www.mozilla.org/en-US/firefox/nightly/notes/)
538. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mozilla.org" width="16"> Mozilla/Firefox](https://www.mozilla.org/en-US/firefox/latest/releasenotes/)
539. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.seamonkey-project.org" width="16"> Mozilla/SeaMonkey](https://www.seamonkey-project.org/releases/)
540. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.thunderbird.net" width="16"> Mozilla/Thunderbird](https://www.thunderbird.net/notes/)
541. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.mp3tag.de" width="16"> Mp3tag](https://www.mp3tag.de/en/download.html)
542. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> MPC-BE](https://sourceforge.net/projects/mpcbe/files/) Media Player Classic - BE
543. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mpc-hc.org" width="16"> MPC-HC](https://mpc-hc.org/downloads/)
544. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=oss.netfarm.it" width="16"> MPlayer](http://oss.netfarm.it/mplayer/)
545. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> mps-youtube](https://github.com/mps-youtube/mps-youtube/releases/latest) [201/4,899/418] Terminal based YouTube player and downloader.
546. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mpv.srsfckn.biz" width="16"> mpv](https://mpv.srsfckn.biz/)
547. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> mRemoteNG](https://github.com/mRemoteNG/mRemoteNG/releases) [235/2,863/550] mRemoteNG is the next generation of mRemote, open source, tabbed, multi-protocol, remote connections manager.
548. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=repo.msys2.org" width="16"> msys2](http://repo.msys2.org/distrib/x86_64/)
549. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Mullvad](https://github.com/mullvad/mullvadvpn-app/releases/latest) [Free Personal] [22/257/17] The Mullvad VPN client app for desktop and mobile.
550. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Multrin](https://github.com/sentialx/multrin/releases/latest) [19/423/13] Organize multiple apps in tabs!
551. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Museeks](https://github.com/martpie/museeks/releases/latest) [48/726/129] 🎵 A simple, clean and cross-platform music player.
553. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.musetips.com" width="16"> musetips/MP3 Cutter and Editor](http://www.musetips.com/free-mp3-cutter-and-editor.html)
554. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.musetips.com" width="16"> musetips/MP3 Ringtone Maker](http://www.musetips.com/free-mp3-ringtone-maker.html)
555. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.musetips.com" width="16"> musetips/Ringtone Maker](http://www.musetips.com/free-ringtone-maker.html)
556. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.musetips.com" width="16"> musetips/Text Filter](http://www.musetips.com/text-filter.html)
557. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.musetips.com" width="16"> musetips/WMA Cutter and Editor](http://www.musetips.com/free-wma-cutter-and-editor.html)
558. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> music-jojo](https://github.com/liuzhuoling2011/music-jojo/releases/latest) [7/134/18] 一款基于electron-vue的高颜值音乐下载器, 让你能非常优雅的下载音乐.
559. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.getmusicbee.com" width="16"> MusicBee](https://www.getmusicbee.com/downloads/) [Freemium]
560. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=picard.musicbrainz.org" width="16"> MusicBrainz Picard](https://picard.musicbrainz.org/downloads/)
561. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> MusicLake](https://github.com/sunzongzheng/music/releases/latest) [18/619/56] electron跨平台音乐播放器；可搜网易云、QQ音乐、虾米音乐；支持QQ、微博登录，云歌单; 支持一键导入音乐平台歌单
562. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> MusicPlayer2](https://github.com/zhongyang219/MusicPlayer2/releases/latest) [6/44/24] 这是一款可以播放常见音频格式的音频播放器。支持歌词显示、歌词卡拉OK样式显示、歌词在线下载、歌词编辑、歌曲标签识别、Win10小娜搜索显示歌词、频谱分析、音效设置、任务栏缩略图按钮、主题颜色等功能。 播放内核为BASS音频库(V2.4)。
563. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> MyCrypto](https://github.com/MyCryptoHQ/MyCrypto/releases/latest) [66/612/315] MyCrypto is an open-source, client-side tool for generating ether wallets, handling ERC-20 tokens, and interacting with the blockchain more easily.
564. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> mypaint](https://github.com/mypaint/mypaint/releases/latest) [138/1,139/198] MyPaint is a simple drawing and painting program that works well with Wacom-style graphics tablets.
565. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Nagisa](https://github.com/Project-Nagisa/Nagisa/releases/latest) [5/52/4] An open source file transfer utility on Universal Windows Platform.
566. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nand.it" width="16"> nanDECK](http://www.nand.it/nandeck/)
567. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.xnview.com" width="16"> NConvert](https://www.xnview.com/en/nconvert/) [Freemium]
568. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ndm](https://github.com/720kb/ndm/releases/latest) [30/1,559/88] :computer: npm desktop manager https://720kb.github.io/ndm
569. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Neard](https://github.com/neard/neard/releases/latest) [35/243/38] 🎲 Portable WAMP software stack.
571. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/Easy USB Creator](https://neosmart.net/Software/Changelog/21) [Freemium]
572. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/Easy Window Switcher](https://neosmart.net/Software/Changelog/26) [Freemium]
573. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/EasyBCD](https://neosmart.net/Software/Changelog/1) [Freemium]
574. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/iReboot](https://neosmart.net/Software/Changelog/11) [Freemium]
575. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/LastPass to 1Password Conversion Utility](https://neosmart.net/Software/Changelog/28)
576. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/ln-win](https://neosmart.net/Software/Changelog/16)
577. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/NST Downloader](https://neosmart.net/Software/Changelog/15)
578. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/RunInBash](https://neosmart.net/Software/Changelog/27)
579. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/ToolTipFixer](https://neosmart.net/Software/Changelog/10)
580. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/TweakUI](https://neosmart.net/Software/Changelog/6)
581. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/uptime](https://neosmart.net/Software/Changelog/29)
582. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/Windows 10 Rollback Utility](https://neosmart.net/Software/Changelog/23) :hand:
583. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=neosmart.net" width="16"> NeoSmart/Windows OEM Product Key Tool](https://neosmart.net/Software/Changelog/22)
584. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=netbalancer.com" width="16"> NetBalancer](https://netbalancer.com/download) :money_with_wings:
585. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=netbeans.apache.org" width="16"> NetBeans](https://netbeans.apache.org/download/index.html)
586. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Netron](https://github.com/lutzroeder/netron/releases/latest) [110/3,179/337] Visualizer for deep learning and machine learning models
587. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=nextcloud.com" width="16"> Nextcloud](https://nextcloud.com/install/)
588. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ngrev](https://github.com/mgechev/ngrev/releases/latest) [51/978/56] Tool for reverse engineering of Angular applications
589. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=nimbusweb.me" width="16"> Nimbus Note](https://nimbusweb.me/) [Free Personal]
591. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Access PassView](https://www.nirsoft.net/utils/accesspv.html)
592. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ActiveX Compatibility Manager](https://www.nirsoft.net/utils/acm.html)
593. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ActiveXHelper](https://www.nirsoft.net/utils/axhelper.html)
594. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AdapterWatch](https://www.nirsoft.net/utils/awatch.html)
595. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AddrView](https://www.nirsoft.net/utils/addrview.html)
596. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AdvancedRun](https://www.nirsoft.net/utils/advanced_run.html)
597. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AllThreadsView](https://www.nirsoft.net/utils/all_threads_view.html)
598. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AlternateStreamView](https://www.nirsoft.net/utils/alternate_data_streams.html)
599. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AltStreamDump](https://www.nirsoft.net/utils/alternate_stream_dump.html)
600. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AppAudioConfig](https://www.nirsoft.net/utils/app_audio_config.html)
601. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AppCompatibilityView](https://www.nirsoft.net/utils/app_compatibility_view.html)
602. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AppCrashView](https://www.nirsoft.net/utils/app_crash_view.html)
603. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AppNetworkCounter](https://www.nirsoft.net/utils/app_network_counter.html)
604. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AppReadWriteCounter](https://www.nirsoft.net/utils/app_read_write_counter.html)
605. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AsterWin IE](https://www.nirsoft.net/utils/asterie.html)
606. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/AtNow](https://www.nirsoft.net/utils/atnow.html)
607. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/BatteryInfoView](https://www.nirsoft.net/utils/battery_information_view.html)
608. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/BlueScreenView](https://www.nirsoft.net/utils/blue_screen_view.html)
609. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/BluetoothCL](https://www.nirsoft.net/utils/bluetoothcl.html)
610. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/BluetoothLogView](https://www.nirsoft.net/utils/bluetooth_log_view.html)
611. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/BluetoothView](https://www.nirsoft.net/utils/bluetooth_viewer.html)
612. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/BrowserAddonsView](https://www.nirsoft.net/utils/web_browser_addons_view.html)
613. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/BrowsingHistoryView](https://www.nirsoft.net/utils/browsing_history_view.html)
614. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/BulkFileChanger](https://www.nirsoft.net/utils/bulk_file_changer.html)
615. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/BulletsPassView](https://www.nirsoft.net/utils/bullets_password_view.html)
616. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ChromeCacheView](https://www.nirsoft.net/utils/chrome_cache_view.html)
617. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ChromeCookiesView](https://www.nirsoft.net/utils/chrome_cookies_view.html)
618. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ChromeHistoryView](https://www.nirsoft.net/utils/chrome_history_view.html)
619. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ChromePass](https://www.nirsoft.net/utils/chromepass.html)
620. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/CleanAfterMe](https://www.nirsoft.net/utils/clean_after_me.html)
621. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Clipboardic](https://www.nirsoft.net/utils/clipboardic.html)
622. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Content Advisor Password Remover](https://www.nirsoft.net/utils/conadvpass.html)
623. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ControlMyMonitor](https://www.nirsoft.net/utils/control_my_monitor.html)
624. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/CountryTraceRoute](https://www.nirsoft.net/utils/country_traceroute.html)
625. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/CredentialsFileView](https://www.nirsoft.net/utils/credentials_file_view.html)
626. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/CSVFileView](https://www.nirsoft.net/utils/csv_file_view.html)
627. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/CurrPorts](https://www.nirsoft.net/utils/cports.html)
628. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/CurrProcess](https://www.nirsoft.net/utils/cprocess.html)
629. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/CustomExplorerToolbar](https://www.nirsoft.net/utils/custom_explorer_toolbar.html)
630. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/CustomizeIE](https://www.nirsoft.net/utils/ctie.html)
631. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DataProtectionDecryptor](https://www.nirsoft.net/utils/dpapi_data_decryptor.html)
632. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DeviceIOView](https://www.nirsoft.net/utils/device_io_view.html)
633. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DevManView](https://www.nirsoft.net/utils/device_manager_view.html)
634. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Dialupass](https://www.nirsoft.net/utils/dialupass.html)
635. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DiskCountersView](https://www.nirsoft.net/utils/disk_counters_view.html)
636. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DiskSmartView](https://www.nirsoft.net/utils/disk_smart_view.html)
637. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DLL Export Viewer](https://www.nirsoft.net/utils/dll_export_viewer.html)
638. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DNSDataView](https://www.nirsoft.net/utils/dns_records_viewer.html)
639. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DNSQuerySniffer](https://www.nirsoft.net/utils/dns_query_sniffer.html)
640. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DomainHostingView](https://www.nirsoft.net/utils/domain_hosting_view.html)
641. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DotNetResourcesExtract](https://www.nirsoft.net/utils/dot_net_resources_extract.html)
642. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DownTester](https://www.nirsoft.net/utils/download_speed_tester.html)
643. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DriveLetterView](https://www.nirsoft.net/utils/drive_letter_view.html)
644. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DriverView](https://www.nirsoft.net/utils/driverview.html)
645. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/DumpEDID](https://www.nirsoft.net/utils/dump_edid.html)
646. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/EdgeCookiesView](https://www.nirsoft.net/utils/edge_cookies_view.html)
647. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/EncryptedRegView](https://www.nirsoft.net/utils/encrypted_registry_view.html)
648. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Enterprise Manager PassView](https://www.nirsoft.net/utils/empv.html)
649. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ESEDatabaseView](https://www.nirsoft.net/utils/ese_database_view.html)
650. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/EventLogChannelsView](https://www.nirsoft.net/utils/event_log_channels_view.html)
651. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/EventLogSourcesView](https://www.nirsoft.net/utils/event_log_sources_view.html)
652. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ExecutedProgramsList](https://www.nirsoft.net/utils/executed_programs_list.html)
653. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ExeInfo](https://www.nirsoft.net/utils/exeinfo.html)
654. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ExifDataView](https://www.nirsoft.net/utils/exif_data_view.html)
655. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/FastResolver](https://www.nirsoft.net/utils/fastresolver.html)
656. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/FavoritesView](https://www.nirsoft.net/utils/faview.html)
657. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/FBCacheView](https://www.nirsoft.net/utils/facebook_cache_viewer.html)
658. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/FileAccessErrorView](https://www.nirsoft.net/utils/file_access_error_view.html)
659. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/FileActivityWatch](https://www.nirsoft.net/utils/file_activity_watch.html)
660. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/FileTypesMan](https://www.nirsoft.net/utils/file_types_manager.html)
661. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/FirefoxDownloadsView](https://www.nirsoft.net/utils/firefox_downloads_view.html)
662. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/FlashCookiesView](https://www.nirsoft.net/utils/flash_cookies_view.html)
663. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/FolderChangesView](https://www.nirsoft.net/utils/folder_changes_view.html)
664. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/FoldersReport](https://www.nirsoft.net/utils/folrep.html)
665. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/FolderTimeUpdate](https://www.nirsoft.net/utils/folder_time_update.html)
666. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/FullEventLogView](https://www.nirsoft.net/utils/full_event_log_view.html)
667. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/GACView](https://www.nirsoft.net/dot_net_tools/gac_viewer.html)
668. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/GDIView](https://www.nirsoft.net/utils/gdi_handles.html)
669. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/GUIPropView](https://www.nirsoft.net/utils/gui_prop_view.html)
670. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/HandleCountersView](https://www.nirsoft.net/utils/handle_counters_view.html)
671. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/HashMyFiles](https://www.nirsoft.net/utils/hash_my_files.html)
672. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/HeapMemView](https://www.nirsoft.net/utils/heap_memory_view.html)
673. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/HostedNetworkStarter](https://www.nirsoft.net/utils/wifi_hotspot_starter.html)
674. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/HotKeysList](https://www.nirsoft.net/utils/hot_keys_list.html)
675. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/HTMLAsText](https://www.nirsoft.net/utils/htmlastext.html)
676. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/HtmlDocEdit](https://www.nirsoft.net/utils/html_doc_edit.html)
677. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/HTTPNetworkSniffer](https://www.nirsoft.net/utils/http_network_sniffer.html)
678. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/IconsExtract](https://www.nirsoft.net/utils/iconsext.html)
679. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/IE PassView](https://www.nirsoft.net/utils/internet_explorer_password.html)
680. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/IECacheView](https://www.nirsoft.net/utils/ie_cache_viewer.html)
681. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/IECompo](https://www.nirsoft.net/utils/iecompo.html)
682. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/IECookiesView](https://www.nirsoft.net/utils/iecookies.html)
683. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/IEDesignMode](https://www.nirsoft.net/utils/ie_design_mode.html)
684. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/IEHistoryView](https://www.nirsoft.net/utils/iehv.html)
685. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ImageCacheViewer](https://www.nirsoft.net/utils/image_cache_viewer.html)
686. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/InjectedDLL](https://www.nirsoft.net/utils/injected_dll.html)
687. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/InsideClipboard](https://www.nirsoft.net/utils/inside_clipboard.html)
688. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/InstalledCodec](https://www.nirsoft.net/utils/installed_codec.html)
689. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/InstalledDriversList](https://www.nirsoft.net/utils/installed_drivers_list.html)
690. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/InstalledPackagesView](https://www.nirsoft.net/utils/installed_packages_view.html)
691. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/IPInfoOffline](https://www.nirsoft.net/utils/ip_country_info_offline.html)
692. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/IPNetInfo](https://www.nirsoft.net/utils/ipnetinfo.html)
693. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/JavaScript Animator Express](https://www.nirsoft.net/utils/jsae.html)
694. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/JumpListsView](https://www.nirsoft.net/utils/jump_lists_view.html)
695. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/KeyboardStateView](https://www.nirsoft.net/utils/keyboard_state_view.html)
696. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/LastActivityView](https://www.nirsoft.net/utils/computer_activity_view.html)
697. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/LiveContactsView](https://www.nirsoft.net/utils/live_messenger_contacts.html)
698. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/LiveTcpUdpWatch](https://www.nirsoft.net/utils/live_tcp_udp_watch.html)
699. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/LoadedDllsView](https://www.nirsoft.net/utils/loaded_dll_view.html)
700. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/LSASecretsDump](https://www.nirsoft.net/utils/lsa_secrets_dump.html)
701. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/LSASecretsView](https://www.nirsoft.net/utils/lsa_secrets_view.html)
702. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MACAddressView](https://www.nirsoft.net/utils/mac_address_lookup_find.html)
703. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Mail PassView](https://www.nirsoft.net/utils/mailpv.html)
704. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MessenPass](https://www.nirsoft.net/utils/mspass.html)
705. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MetarWeather](https://www.nirsoft.net/utils/mweather.html)
706. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MIMEView](https://www.nirsoft.net/utils/mimeview.html)
707. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MMCSnapInsView](https://www.nirsoft.net/utils/mmc_snapins_view.html)
708. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MonitorInfoView](https://www.nirsoft.net/utils/monitor_info_view.html)
709. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MUICacheView](https://www.nirsoft.net/utils/muicache_view.html)
710. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MultiMonitorTool](https://www.nirsoft.net/utils/multi_monitor_tool.html)
711. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MyEventViewer](https://www.nirsoft.net/utils/my_event_viewer.html)
712. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MyLastSearch](https://www.nirsoft.net/utils/my_last_search.html)
713. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MZCacheView](https://www.nirsoft.net/utils/mozilla_cache_viewer.html)
714. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MZCookiesView](https://www.nirsoft.net/utils/mzcv.html)
715. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/MZHistoryView](https://www.nirsoft.net/utils/mozilla_history_view.html)
716. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NetBScanner](https://www.nirsoft.net/utils/netbios_scanner.html)
717. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NetConnectChoose](https://www.nirsoft.net/utils/net_connect_choose.html)
718. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NetResView](https://www.nirsoft.net/utils/netresview.html)
719. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NetRouteView](https://www.nirsoft.net/utils/network_route_view.html)
720. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Network Password Recovery](https://www.nirsoft.net/utils/network_password_recovery.html)
721. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NetworkConnectLog](https://www.nirsoft.net/utils/network_connect_log.html)
722. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NetworkCountersWatch](https://www.nirsoft.net/utils/network_counters_watch.html)
723. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NetworkInterfacesView](https://www.nirsoft.net/utils/network_interfaces.html)
724. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NetworkLatencyView](https://www.nirsoft.net/utils/network_latency_view.html)
725. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NetworkOpenedFiles](https://www.nirsoft.net/utils/network_opened_files.html)
726. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NetworkTrafficView](https://www.nirsoft.net/utils/network_traffic_view.html)
727. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NetworkUsageView](https://www.nirsoft.net/utils/network_usage_view.html)
728. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NirCmd-CLI](https://www.nirsoft.net/utils/nircmd.html)
729. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NirCmd](https://www.nirsoft.net/utils/nircmd.html)
730. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NirExt](https://www.nirsoft.net/utils/nirext.html)
731. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NK2Edit](https://www.nirsoft.net/utils/outlook_nk2_edit.html)
732. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/NTFSLinksView](https://www.nirsoft.net/utils/ntfs_links_view.html)
733. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/OfficeIns](https://www.nirsoft.net/utils/officeins.html)
734. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/OfflineRegistryFinder](https://www.nirsoft.net/utils/offline_registry_finder.html)
735. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/OfflineRegistryView](https://www.nirsoft.net/utils/offline_registry_view.html)
736. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/OpenedFilesView](https://www.nirsoft.net/utils/opened_files_view.html)
737. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/OpenSaveFilesView](https://www.nirsoft.net/utils/open_save_files_view.html)
738. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/OpenWithView](https://www.nirsoft.net/utils/open_with_view.html)
739. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/OperaCacheView](https://www.nirsoft.net/utils/opera_cache_view.html)
740. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/OperaPassView](https://www.nirsoft.net/utils/opera_password_recovery.html)
741. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/OutlookAddressBookView](https://www.nirsoft.net/utils/outlook_address_book_view.html)
742. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/OutlookAttachView](https://www.nirsoft.net/utils/outlook_attachment.html)
743. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/OutlookStatView](https://www.nirsoft.net/utils/outlook_statistics.html)
744. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Password Security Scanner](https://www.nirsoft.net/utils/password_security_scanner.html)
745. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/PasswordFox](https://www.nirsoft.net/utils/passwordfox.html)
746. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/pcANYWHERE Hosts Scanner](https://www.nirsoft.net/utils/pcanyscan.html)
747. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/PCAnywhere PassView](https://www.nirsoft.net/utils/pcanypass.html)
748. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/PingInfoView](https://www.nirsoft.net/utils/multiple_ping_tool.html)
749. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/PreviousFilesRecovery](https://www.nirsoft.net/utils/previous_files_recovery.html)
750. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ProcessActivityView](https://www.nirsoft.net/utils/process_activity_view.html)
751. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ProcessTCPSummary](https://www.nirsoft.net/utils/process_tcp_summary.html)
752. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ProcessThreadsView](https://www.nirsoft.net/utils/process_threads_view.html)
753. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ProduKey](https://www.nirsoft.net/utils/product_cd_key_viewer.html)
754. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Protected Storage PassView](https://www.nirsoft.net/utils/pspv.html)
755. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/PstPassword](https://www.nirsoft.net/utils/pst_password.html)
756. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/QuickSetDNS](https://www.nirsoft.net/utils/quick_set_dns.html)
757. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/RecentFilesView](https://www.nirsoft.net/utils/recent_files_view.html)
758. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/RegDllView](https://www.nirsoft.net/utils/registered_dll_view.html)
759. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/RegFileExport](https://www.nirsoft.net/utils/registry_file_offline_export.html)
760. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/RegFromApp](https://www.nirsoft.net/utils/reg_file_from_application.html)
761. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/RegistryChangesView](https://www.nirsoft.net/utils/registry_changes_view.html)
762. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/RegScanner](https://www.nirsoft.net/utils/regscanner.html)
763. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Remote Desktop PassView](https://www.nirsoft.net/utils/remote_desktop_password.html)
764. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ResourcesExtract](https://www.nirsoft.net/utils/resources_extract.html)
765. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/RouterPassView](https://www.nirsoft.net/utils/router_password_recovery.html)
766. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/RTMPDumpHelper](https://www.nirsoft.net/utils/rtmp_dump_helper.html)
767. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/RunAsDate](https://www.nirsoft.net/utils/run_as_date.html)
768. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/RunFromProcess](https://www.nirsoft.net/utils/run_from_process.html)
769. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SafariCacheView](https://www.nirsoft.net/utils/safari_cache_view.html)
770. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SafariHistoryView](https://www.nirsoft.net/utils/safari_history_view.html)
771. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SearchFilterView](https://www.nirsoft.net/utils/search_filter_view.html)
772. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SearchMyFiles](https://www.nirsoft.net/utils/search_my_files.html)
773. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SecuritySoftView](https://www.nirsoft.net/utils/security_software_view.html)
774. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SeqDownload](https://www.nirsoft.net/utils/seqdownload.html)
775. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ServiWin](https://www.nirsoft.net/utils/serviwin.html)
776. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ShadowCopyView](https://www.nirsoft.net/utils/shadow_copy_view.html)
777. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ShellBagsView](https://www.nirsoft.net/utils/shell_bags_view.html)
778. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ShellExView](https://www.nirsoft.net/utils/shexview.html)
779. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ShellMenuNew](https://www.nirsoft.net/utils/shell_menu_new.html)
780. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ShellMenuView](https://www.nirsoft.net/utils/shell_menu_view.html)
781. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ShortcutsMan](https://www.nirsoft.net/utils/shman.html)
782. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SimpleProgramDebugger](https://www.nirsoft.net/utils/simple_program_debugger.html)
783. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SimpleWMIView](https://www.nirsoft.net/utils/simple_wmi_view.html)
784. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SiteShoter](https://www.nirsoft.net/utils/web_site_screenshot.html)
785. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SkypeContactsView](https://www.nirsoft.net/utils/skype_contacts_view.html)
786. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SkypeLogView](https://www.nirsoft.net/utils/skype_log_view.html)
787. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SmartSniff](https://www.nirsoft.net/utils/smsniff.html)
788. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SniffPass](https://www.nirsoft.net/utils/password_sniffer.html)
789. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SocketSniff](https://www.nirsoft.net/utils/socket_sniffer.html)
790. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SoundVolumeView](https://www.nirsoft.net/utils/sound_volume_view.html)
791. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SpecialFoldersView](https://www.nirsoft.net/utils/special_folders_view.html)
792. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/StartBlueScreen](https://www.nirsoft.net/utils/start_blue_screen.html)
793. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/SysExporter](https://www.nirsoft.net/utils/sysexp.html)
794. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/TableTextCompare](https://www.nirsoft.net/utils/csv_file_comparison.html)
795. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/TagsReport](https://www.nirsoft.net/utils/tagsrep.html)
796. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/TaskSchedulerView](https://www.nirsoft.net/utils/task_scheduler_view.html)
797. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/TcpLogView](https://www.nirsoft.net/utils/tcp_log_view.html)
798. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/TimeZonesView](https://www.nirsoft.net/utils/time_zones_view.html)
799. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/TurnedOnTimesView](https://www.nirsoft.net/utils/computer_turned_on_times.html)
800. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/TurnFlash](https://www.nirsoft.net/utils/tflash.html)
801. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/TurnFlash2](https://www.nirsoft.net/utils/tflash2.html)
802. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/UninstallView](https://www.nirsoft.net/utils/uninstall_view.html)
803. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/URLProtocolView](https://www.nirsoft.net/utils/url_protocol_view.html)
804. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/URLStringGrabber](https://www.nirsoft.net/utils/url_string_grabber.html)
805. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/USBDeview](https://www.nirsoft.net/utils/usb_devices_view.html)
806. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/USBLogView](https://www.nirsoft.net/utils/usb_log_view.html)
807. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/UserAssistView](https://www.nirsoft.net/utils/userassist_view.html)
808. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/UserProfilesView](https://www.nirsoft.net/utils/user_profiles_view.html)
809. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/VaultPasswordView](https://www.nirsoft.net/utils/vault_password_view.html)
810. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/VideoCacheView](https://www.nirsoft.net/utils/video_cache_view.html)
811. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/VNCPassView](https://www.nirsoft.net/utils/vnc_password.html)
812. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Volumouse](https://www.nirsoft.net/utils/volumouse.html)
813. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WakeMeOnLan](https://www.nirsoft.net/utils/wake_on_lan.html)
814. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WebBrowserPassView](https://www.nirsoft.net/utils/web_browser_password.html)
815. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WebCacheImageInfo](https://www.nirsoft.net/utils/web_cache_image_info.html)
816. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WebCamImageSave](https://www.nirsoft.net/utils/web_cam_image_capture.html)
817. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WebCookiesSniffer](https://www.nirsoft.net/utils/web_cookies_sniffer.html)
818. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WebSiteSniffer](https://www.nirsoft.net/utils/web_site_sniffer.html)
819. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WebVideoCap](https://www.nirsoft.net/utils/web_video_capture.html)
820. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WhatInStartup](https://www.nirsoft.net/utils/what_run_in_startup.html)
821. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WhatIsHang](https://www.nirsoft.net/utils/what_is_hang.html)
822. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WhoisCL](https://www.nirsoft.net/utils/whoiscl.html)
823. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WhoIsConnectedSniffer](https://www.nirsoft.net/utils/who_is_connected_sniffer.html)
824. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WhoisThisDomain](https://www.nirsoft.net/utils/whois_this_domain.html)
825. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WhosIP](https://www.nirsoft.net/utils/whosip.html)
826. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WifiChannelMonitor](https://www.nirsoft.net/utils/wifi_channel_monitor.html)
827. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WifiHistoryView](https://www.nirsoft.net/utils/wifi_history_view.html)
828. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WifiInfoView](https://www.nirsoft.net/utils/wifi_information_view.html)
829. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Win9x PassView](https://www.nirsoft.net/utils/win9xpv.html)
830. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WinCrashReport](https://www.nirsoft.net/utils/application_crash_report.html)
831. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WinExplorer](https://www.nirsoft.net/utils/winexp.html)
832. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WinFontsView](https://www.nirsoft.net/utils/windows_fonts_viewer.html)
833. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WinLister](https://www.nirsoft.net/utils/winlister.html)
834. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WinLogOnView](https://www.nirsoft.net/utils/windows_log_on_times_view.html)
835. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WinPrefetchView](https://www.nirsoft.net/utils/win_prefetch_view.html)
836. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WinsockServicesView](https://www.nirsoft.net/utils/winsock_service_providers.html)
837. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WinUpdatesList](https://www.nirsoft.net/utils/wul.html)
838. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/Wireless Network Watcher](https://www.nirsoft.net/utils/wireless_network_watcher.html)
839. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WirelessConnectionInfo](https://www.nirsoft.net/utils/wireless_connection_information.html)
840. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WirelessKeyView](https://www.nirsoft.net/utils/wireless_key.html)
841. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WirelessNetConsole](https://www.nirsoft.net/utils/wireless_net_console.html)
842. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/WirelessNetView](https://www.nirsoft.net/utils/wireless_network_view.html)
843. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.nirsoft.net" width="16"> NirSoft/ZipInstaller](https://www.nirsoft.net/utils/zipinst.html)
844. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> NixNote](https://sourceforge.net/projects/nevernote/files) An open source client for Evernote.
845. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Nocturn](https://github.com/k0kubun/Nocturn/releases/latest) [22/651/60] Multi-platform Twitter Client built with React, Redux and Electron
846. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=nodejs.org" width="16"> Nodejs-LTS](https://nodejs.org/en/download/)
847. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=nodejs.org" width="16"> Nodejs](https://nodejs.org/en/download/current/)
848. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Notable](https://github.com/notable/notable/releases/latest) [130/8,988/347] The markdown-based note-taking app that doesn't suck.
849. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=notepad-plus-plus.org" width="16"> notepad++](https://notepad-plus-plus.org/download/)
850. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> notepad2-mod](https://github.com/XhmikosR/notepad2-mod/releases/latest) [130/1,031/189] LOOKING FOR DEVELOPERS - Notepad2-mod, a Notepad2 fork, a fast and light-weight Notepad-like text editor with syntax highlighting
851. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.conceptworld.com" width="16"> Notezilla](https://www.conceptworld.com/Notezilla/Portable) :money_with_wings:
852. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.notion.so" width="16"> Notion](https://www.notion.so/desktop) [Free Personal]
853. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Noty](https://github.com/fabiospampinato/noty/releases/latest) [7/169/10] Autosaving sticky note with support for multiple notes without needing multiple windows.
854. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Now Desktop](https://github.com/zeit/now-desktop/releases/latest) [37/1,093/155] Create deployments right from the tray menu.
856. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ntwind.com" width="16"> NTWind/Alt-Tab Terminator](https://www.ntwind.com/software/alttabter.html)
857. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ntwind.com" width="16"> NTWind/Bad Application](https://www.ntwind.com/software/utilities/badapp.html)
858. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ntwind.com" width="16"> NTWind/Close All](https://www.ntwind.com/software/utilities/close-all.html)
859. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ntwind.com" width="16"> NTWind/Hidden Start](https://www.ntwind.com/software/hstart.html) :money_with_wings:
860. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ntwind.com" width="16"> NTWind/Sticky Previews](https://www.ntwind.com/software/sticky-previews.html) :money_with_wings:
861. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ntwind.com" width="16"> NTWind/Visual Subst](https://www.ntwind.com/software/utilities/visual-subst.html)
862. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ntwind.com" width="16"> NTWind/WinCam](https://www.ntwind.com/software/wincam.html) :money_with_wings:
863. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ntwind.com" width="16"> NTWind/WindowSpace](https://www.ntwind.com/software/windowspace.html) :money_with_wings:
864. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ntwind.com" width="16"> NTWind/WinSnap](https://www.ntwind.com/software/winsnap.html) :money_with_wings:
865. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Nuclear](https://github.com/nukeop/nuclear/releases/latest) [117/4,509/300] Desktop music player for streaming from free sources
866. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=forum.odrive.com" width="16"> odrive Sync](https://forum.odrive.com/c/release-notes) [Free Personal]
867. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ODrive](https://github.com/liberodark/ODrive/releases/latest) [28/422/59] Google Drive GUI for Windows / Mac / Linux.
868. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=mirrors.yuntu.ca" width="16"> Office Tool Plus](https://mirrors.yuntu.ca/office-tool/)
869. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> OnTopReplica](https://github.com/LorenzCK/OnTopReplica/releases/latest) [56/556/74] A real-time always-on-top “replica” of a window of your choice (on Windows).
870. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=obsproject.com" width="16"> Open Broadcaster Software](https://obsproject.com/download)
871. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> OpenShot](https://github.com/OpenShot/openshot-qt/releases/latest) [73/830/141] OpenShot Video Editor is an award-winning free and open-source video editor for Linux, Mac, and Windows, and is dedicated to delivering high quality video editing and animation solutions to the world.
872. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=openvpn.net" width="16"> OpenVPN](https://openvpn.net/community-downloads/) :airplane:
873. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=biblprog.com" width="16"> Opera](https://biblprog.com/en/opera/download/)
874. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Outline](https://github.com/Jigsaw-Code/outline-client/releases/latest) [146/3,262/547] Outline clients, developed by Jigsaw. The Outline clients use the popular Shadowsocks protocol, and lean on the Cordova and Electron frameworks to support Windows, Android / ChromeOS, Linux, iOS and macOS.
875. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Outlook Google Calendar Sync](https://github.com/phw198/OutlookGoogleCalendarSync/releases/latest) [49/586/79] Sync your Outlook and Google calendars.
876. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.dotpdn.com" width="16"> Paint.NET](https://www.dotpdn.com/downloads/pdn.html)
877. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.palemoon.org" width="16"> Pale Moon](https://www.palemoon.org/)
878. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=folk.uio.no" width="16"> Past](https://folk.uio.no/ohammer/past/)
879. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> PasteEx](https://github.com/huiyadanli/PasteEx/releases/latest) [30/365/35] :clipboard: Paste As File 把剪贴板的内容直接粘贴为文件.
880. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.xuetr.com" width="16"> PCHunter](http://www.xuetr.com/?p=191)
881. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.peazip.org" width="16"> PeaExtractor](http://www.peazip.org/peaextractor-unace-unrar-unzip.html)
882. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.peazip.org" width="16"> PeaUtils](http://www.peazip.org/peautils-hash-secure-delete.html)
883. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> PeaZip](https://github.com/giorgiotani/PeaZip/releases/latest) [29/192/29] Free Zip / Unzip software and Rar file extractor. Cross-platform file and archive manager. Features volume spanning, compression, authenticated encryption. Supports 7Z, 7-Zip sfx, ACE, ARJ, BZ2, CAB, CHM, CPIO, DEB, GZ, ISO, JAR, LHA/LZH, NSIS, OOo, PAQ/LPAQ, PEA, QUAD, RAR, RPM, split, TAR, Z, ZIP, ZIPX.
884. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=pencil.evolus.vn" width="16"> Pencil](http://pencil.evolus.vn/Downloads.html)
885. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Persepolis Download Manager](https://github.com/persepolisdm/persepolis/releases/latest) [185/3,086/370] Persepolis Download Manager is a GUI for aria2.
886. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.winitor.com" width="16"> pestudio](https://www.winitor.com/binaries.html)
887. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> PHP Desktop](https://github.com/cztomczak/phpdesktop) Develop desktop GUI applications using PHP, HTML5, JavaScript and SQLite - cztomczak/phpdesktop
888. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> PicGo](https://github.com/Molunerfinn/PicGo/releases/latest) [76/3,841/293] :rocket:A simple & beautiful tool for pictures uploading built by electron-vue
889. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pcfreetime.com" width="16"> Picosmos](http://www.pcfreetime.com/picosmos/index.php)
890. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> PicoTorrent](https://github.com/picotorrent/picotorrent/releases/latest) [38/669/76] A tiny, hackable BitTorrent client.
891. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=picpick.app" width="16"> PicPick](https://picpick.app/zh/download) [Freemium]
892. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pidgin.im" width="16"> Pidgin](https://www.pidgin.im/)
893. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> Piggydb](https://sourceforge.net/projects/piggydb/files/) Piggydb helps you have more fun with knowledge creation.
894. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Pingendo](https://github.com/Pingendo/pingendo/releases/latest) [3/9/0] Contribute to  development by creating an account on GitHub.
895. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> PiP-Tool](https://github.com/LionelJouin/PiP-Tool/releases/latest) [8/128/7] PiP tool is a software to use the Picture in Picture mode on Windows. This feature allows you to watch content (video for example) in thumbnail format on the screen while continuing to use any other software on Windows.
897. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ccleaner.com" width="16"> Piriform/CCleaner](https://www.ccleaner.com/ccleaner/download) [Free Personal]
898. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ccleaner.com" width="16"> Piriform/Defraggler](https://www.ccleaner.com/defraggler/download) [Freemium]
899. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ccleaner.com" width="16"> Piriform/Recuva](https://www.ccleaner.com/recuva/download) [Free Personal]
900. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ccleaner.com" width="16"> Piriform/Speccy](https://www.ccleaner.com/speccy/download) [Free Personal]
901. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Pixiv-Nginx](https://github.com/mashirozx/Pixiv-Nginx/releases/latest) [26/244/31] P站（Pixiv）的正确打开方式.
902. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> PixivUtil2](https://github.com/Nandaka/PixivUtil2/releases/latest) [76/682/76] Download images from Pixiv and more!
903. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Playback](https://github.com/seungjulee/playback/releases/latest) [1/2/262] Video player build using atom-shell and node.js.
904. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.dcmembers.com" width="16"> PlayTime](http://www.dcmembers.com/skwire/download/playtime/)
905. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=plex.tv" width="16"> PlexMediaPlayer](https://plex.tv/api/downloads/3.json)
906. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=plex.tv" width="16"> PlexMediaServer](https://plex.tv/api/downloads/1.json)
907. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=pnotes.sourceforge.io" width="16"> PNotes](https://pnotes.sourceforge.io/index.php?page=5)
908. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=pnotes.sourceforge.io" width="16"> PNotes.NET](https://pnotes.sourceforge.io/index.php?page=5)
909. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> poi](https://github.com/poooi/poi/releases/latest) [109/1,252/338] Scalable KanColle browser and tool.
910. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Polar Bookshelf](https://github.com/burtonator/polar-bookshelf/releases/latest) [55/2,564/105] Polar is a personal knowledge repository for PDF and web content supporting incremental reading and document annotation.
911. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Pomodoro](https://github.com/G07cha/pomodoro/releases/latest) [13/172/32] Pomodoro time managment tool build with electron :tomato:
912. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Pomotroid](https://github.com/Splode/pomotroid/releases/latest) [14/310/38] :tomato: Simple and visually-pleasing Pomodoro timer
913. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=dl.pstmn.io" width="16"> Postman](https://dl.pstmn.io/api/version/notes?channel=stable) [Free Personal]
914. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=potplayer.daum.net" width="16"> PotPlayer](https://potplayer.daum.net/)
915. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.apreltech.com" width="16"> Power Manager](https://www.apreltech.com/PowerManager) :money_with_wings:
916. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=prepros.io" width="16"> Prepros](https://prepros.io/downloads) [Freemium]
917. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.privatetunnel.com" width="16"> Private Tunnel](https://www.privatetunnel.com/apps/) [Free Personal]
918. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=privazer.com" width="16"> PrivaZer](https://privazer.com/download.php)
919. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Proton](https://github.com/steventhanna/proton/releases/latest) [7/130/16] A stand-alone application to quickly preview and edit Markdown files using Electron. 
920. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ProtonMail](https://github.com/protonmail-desktop/application/releases/latest) [35/346/42] :envelope: Unofficial Electron wrapper for ProtonMail
921. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=protonvpn.com" width="16"> ProtonVPN](https://protonvpn.com/download/win-update.json) [Free Personal] :airplane:
922. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.proxifier.com" width="16"> Proxifier](https://www.proxifier.com/) :money_with_wings:
923. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.filehorse.com" width="16"> Psiphon](https://www.filehorse.com/download-psiphon/download/)
924. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=getpublii.com" width="16"> Publii](https://getpublii.com/download/)
925. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> PupaFM](https://github.com/xwartz/PupaFM/releases/latest) [12/335/53] 🎵 douban.fm Music Desktop Player.
926. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Pushbullet](https://github.com/sidneys/pb-for-desktop/releases/latest) [16/342/24] The missing Desktop application for Pushbullet.
927. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.chiark.greenend.org.uk" width="16"> PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
928. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> PyScripter](https://sourceforge.net/projects/pyscripter/files/) Python IDE
929. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.python.org" width="16"> Python](https://www.python.org/downloads/windows/)
930. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.python.org" width="16"> Python2](https://www.python.org/downloads/windows/)
931. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.qbittorrent.org" width="16"> qBittorrent](https://www.qbittorrent.org/download.php)
932. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.qownnotes.org" width="16"> QOwnNotes](https://www.qownnotes.org/installation)
933. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=quest-app.appspot.com" width="16"> QTranslate](https://quest-app.appspot.com/)
934. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.quickaccesspopup.com" width="16"> Quick Access Popup](https://www.quickaccesspopup.com/)
935. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> QuickLook](https://github.com/QL-Win/QuickLook/releases/latest) [138/2,981/248] Bring macOS “Quick Look” feature to Windows.
936. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=download.racket-lang.org" width="16"> Racket](https://download.racket-lang.org/)
937. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.raidrive.com" width="16"> RaiDrive](https://www.raidrive.com/download/) :hand:
938. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Rainmeter](https://github.com/rainmeter/rainmeter/releases/latest) [165/1,713/388] Desktop customization tool for Windows.
939. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Rambox](https://github.com/ramboxapp/community-edition/releases/latest) [158/4,401/510] Free and Open Source messaging and emailing app that combines common web applications into one.
940. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Ramme](https://github.com/terkelg/ramme/releases/latest) [134/3,026/356] Unofficial Instagram Desktop App.
941. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.rapidee.com" width="16"> Rapid Environment Editor](https://www.rapidee.com/en/download)
942. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Raven](https://github.com/mrgodhani/raven-reader/releases/latest) [39/1,008/104] 📖 Simple RSS Reader app made using electron and vue.js
943. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Rclone](https://github.com/ncw/rclone/releases/latest) [425/13,200/1,040] "rsync for cloud storage" - Google Drive, Amazon Drive, S3, Dropbox, Backblaze B2, One Drive, Swift, Hubic, Cloudfiles, Google Cloud Storage, Yandex Files
944. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> React-Proto](https://github.com/React-Proto/react-proto/releases/latest) [53/2,069/93] :art: React application prototyping tool for developers and designers. 
945. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Reacto](https://github.com/eveningkid/reacto/releases/latest) [41/838/51] A sweet IDE for React.js.
946. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.conceptworld.com" width="16"> RecentX](https://www.conceptworld.com/RecentX/RevisionHistory) :money_with_wings:
947. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.redcrab-software.com" width="16"> RedCrab](https://www.redcrab-software.com/en/RedCrab/Updates)
948. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=registry-finder.com" width="16"> Registry Finder](http://registry-finder.com/)
949. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.torchsoft.com" width="16"> Registry Workshop](http://www.torchsoft.com/en/download.html) :money_with_wings:
950. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.hoverdesk.net" width="16"> RegSeeker](http://www.hoverdesk.net/download.php) [Freemium]
951. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.remouse.com" width="16"> ReMouse](https://www.remouse.com/downloads.html) [Free Personal]
952. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=resonic.at" width="16"> Resonic](https://resonic.at/download)
953. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.angusj.com" width="16"> Resource Hacker](http://www.angusj.com/resourcehacker/)
954. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.restuner.com" width="16"> Resource Tuner](http://www.restuner.com/news-history.htm) :money_with_wings:
955. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=rbsoft.org" width="16"> Right Click Enhancer](https://rbsoft.org/downloads/right-click-enhancer/rce-changelog.html) [Free Personal]
956. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> RocketChat](https://github.com/RocketChat/Rocket.Chat.Electron/releases/latest) [104/660/312] Official  OSX, Windows, and Linux Desktop Clients for Rocket.Chat 
957. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> RubyInstaller](https://github.com/oneclick/rubyinstaller2/releases/latest) [46/257/96] MSYS2 based RubyInstaller for Windows.
958. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=rufus.ie" width="16"> Rufus](https://rufus.ie/en_IE.html)
959. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> RunAny](https://github.com/hui-Zz/RunAny/releases/latest) [21/223/30] 【RunAny】一劳永逸的快速启动、多功能菜单、批量搜索、短语输出、热键映射、外接脚本.
960. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Rutracker proxy](https://github.com/RutrackerOrg/rutracker-proxy/releases/latest) [65/563/48] rutracker proxy based on electron.
961. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Sabaki](https://github.com/SabakiHQ/Sabaki/releases/latest) [62/827/142] An elegant Go board and SGF editor for a more civilized age.
962. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Sandman](https://github.com/alexanderepstein/Sandman/releases/latest) [20/497/26] An Application Built With Late Night Developers In Mind
963. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.zdsoft.com" width="16"> Screen Recorder](https://www.zdsoft.com/downloads.html)
964. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ScreenToGif](https://github.com/NickeManarin/ScreenToGif/releases/latest) [276/6,304/717] 🎬 ScreenToGif allows you to record a selected area of your screen, edit and save it as a gif or video.
965. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> shadowsocks-magic](https://github.com/ihciah/go-shadowsocks-magic/releases/latest) [6/133/12] A shadowsocks implementation in golang with Multi-connection Acceleration
966. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> shadowsocks-qt5](https://github.com/shadowsocks/shadowsocks-qt5/releases/latest) :hand: [436/6,139/1,937] A cross-platform shadowsocks GUI client.
967. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> shadowsocks](https://github.com/shadowsocks/shadowsocks-windows/releases) [2,348/34,276/11,858] If you want to keep a secret, you must also hide it from yourself.
968. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> shadowsocksr-csharp](https://github.com/shadowsocksrr/shadowsocksr-csharp/releases) [488/5,131/2,206] Contribute to  development by creating an account on GitHub.
969. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> shadowsocksr-electron](https://github.com/erguotou520/electron-ssr/releases/latest) [194/4,341/921] Shadowsocksr client using electron.
970. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=shareaza.sourceforge.net" width="16"> Shareaza](http://shareaza.sourceforge.net/?id=download)
971. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ShareX](https://github.com/ShareX/ShareX/releases/latest) [465/9,656/1,498] ShareX is a free and open source program that lets you capture or record any area of your screen and share it with a single press of a key. It also allows uploading images, text or other types of files to over 80 supported destinations you can choose from.
972. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=privazer.com" width="16"> Shellbag Analyzer & Cleaner](https://privazer.com/download-shellbag-analyzer-shellbag-cleaner.php)
973. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Shiba](https://github.com/rhysd/Shiba/releases/latest) [25/624/30] Rich markdown live preview app with linter.
974. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=shuax.com" width="16"> Shuax-FireDoge](https://shuax.com/project/firedoge/)
975. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=shuax.com" width="16"> Shuax-GreenChrome](https://shuax.com/project/greenchrome/)
976. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=shuax.com" width="16"> Shuax-MouseInc](https://shuax.com/project/mouseinc/)
977. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.apreltech.com" width="16"> Silent Install Builder](https://www.apreltech.com/SilentInstallBuilder) :money_with_wings:
978. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Simplenote](https://github.com/Automattic/simplenote-electron/releases/latest) [146/2,170/297] A Simplenote React app packaged via Electron for Windows and Linux
979. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=skype.gmw.cn" width="16"> Skype](http://skype.gmw.cn/down/skype-for-windows-desktop.html)
980. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=slack.com" width="16"> Slack](https://slack.com/downloads/windows) [Free Personal]
981. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.syntevo.com" width="16"> SmartGit](https://www.syntevo.com/smartgit/download/) [Freemium]
982. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> SmartTaskbar](https://github.com/ChanpleCai/SmartTaskbar/releases/latest) [9/237/18] A Lightweight Windows Taskbar Enhancement Utility.
983. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=en.smath.com" width="16"> SMath Studio](https://en.smath.com/view/SMathStudio/summary)
984. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> SMPlayer](https://sourceforge.net/projects/smplayer/files/SMPlayer/) Free media player with support for Youtube
985. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.snipaste.com" width="16"> Snipaste](https://www.snipaste.com/download.html)
987. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softany.com" width="16"> Softany/CHM to DOC converter](http://www.softany.com/chm-to-doc/download.htm) :money_with_wings:
988. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softany.com" width="16"> Softany/CHM to PDF converter](http://www.softany.com/chm-to-pdf/download.htm) :money_with_wings:
989. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softany.com" width="16"> Softany/Txt2Htm2Chm](http://www.softany.com/txt2htm2chm/) :money_with_wings:
990. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softany.com" width="16"> Softany/WinCHM Pro](http://www.softany.com/winchm/download.htm) :money_with_wings:
991. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softany.com" width="16"> Softany/WordToHelp](http://www.softany.com/wordtohelp/download.htm) :money_with_wings:
992. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> SoftEtherVPN](https://github.com/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest) :hand: [56/380/139] SoftEther VPN (Stable Edition Repository): Open Cross-platform Multi-protocol VPN Software. This branch is officially managed by Daiyuu Nobori, the owner of SoftEther VPN Project. Pull requests should be sent to the Developer Edition Master Repository on https://github.com/SoftEtherVPN/SoftEtherVPN
994. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/12-Ants](https://www.softwareok.com/?Download=12-Ants)
995. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/AlwaysMouseWheel](https://www.softwareok.com/?Download=AlwaysMouseWheel)
996. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/AutoHideDesktopIcons](https://www.softwareok.com/?Download=AutoHideDesktopIcons)
997. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/AutoHideMouseCursor](https://www.softwareok.com/?Download=AutoHideMouseCursor)
998. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/AutoPowerOptionsOK](https://www.softwareok.com/?Download=AutoPowerOptionsOK)
999. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/BlankAndSecure](https://www.softwareok.com/?Download=BlankAndSecure)
1000. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/ClassicDesktopClock](https://www.softwareok.com/?Download=ClassicDesktopClock)
1001. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/ColorConsole](https://www.softwareok.com/?Download=ColorConsole)
1002. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/CpuFrequenz](https://www.softwareok.com/?Download=CpuFrequenz)
1003. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/Desktop.Calendar.Tray.OK](https://www.softwareok.com/?Download=Desktop.Calendar.Tray.OK)
1004. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/DesktopDigitalClock](https://www.softwareok.com/?Download=DesktopDigitalClock)
1005. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/DesktopNoteOK](https://www.softwareok.com/?Download=DesktopNoteOK)
1006. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/DesktopOK](https://www.softwareok.com/?Download=DesktopOK)
1007. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/DesktopSchneeFree](https://www.softwareok.com/?Download=DesktopSchneeFree)
1008. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/DesktopSnowOK](https://www.softwareok.com/?Download=DesktopSnowOK)
1009. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/DirPrintOK](https://www.softwareok.com/?Download=DirPrintOK)
1010. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/DontSleep](https://www.softwareok.com/?Download=DontSleep)
1011. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/ExperienceIndexOK](https://www.softwareok.com/?Download=ExperienceIndexOK)
1012. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/FavoritenFreund](https://www.softwareok.com/?Download=FavoritenFreund)
1013. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/Find.Same.Images.OK](https://www.softwareok.com/?Download=Find.Same.Images.OK)
1014. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/FontViewOK](https://www.softwareok.com/?Download=FontViewOK)
1015. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/GetWindowText](https://www.softwareok.com/?Download=GetWindowText)
1016. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/IsMyHdOK](https://www.softwareok.com/?Download=IsMyHdOK)
1017. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/IsMyLcdOK](https://www.softwareok.com/?Download=IsMyLcdOK)
1018. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/KeepMouseSpeedOK](https://www.softwareok.com/?Download=KeepMouseSpeedOK)
1019. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/LauschAngriff](https://www.softwareok.com/?Download=LauschAngriff)
1020. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/MagicMouseTrails](https://www.softwareok.com/?Download=MagicMouseTrails)
1021. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/MeinPlatz](https://www.softwareok.com/?Download=MeinPlatz)
1022. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/MultiClipBoardSlots](https://www.softwareok.com/?Download=MultiClipBoardSlots)
1023. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/NewFileTime](https://www.softwareok.com/?Download=NewFileTime)
1024. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/NonCompressibleFiles](https://www.softwareok.com/?Download=NonCompressibleFiles)
1025. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/OneLoupe](https://www.softwareok.com/?Download=OneLoupe)
1026. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/OnlyStopWatch](https://www.softwareok.com/?Download=OnlyStopWatch)
1027. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/PointerStick](https://www.softwareok.com/?Download=PointerStick)
1028. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/ProcessKO](https://www.softwareok.com/?Download=ProcessKO)
1029. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/Q-Dir](https://www.softwareok.com/?Download=Q-Dir)
1030. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/QuickTextPaste](https://www.softwareok.com/?Download=QuickTextPaste)
1031. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/Run-Command](https://www.softwareok.com/?Download=Run-Command)
1032. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/StressMyPC](https://www.softwareok.com/?Download=StressMyPC)
1033. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/TheAeroClock](https://www.softwareok.com/?Download=TheAeroClock)
1034. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/ThisIsMyFile](https://www.softwareok.com/?Download=ThisIsMyFile)
1035. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/TraceRouteOK](https://www.softwareok.com/?Download=TraceRouteOK)
1036. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/WinBin2Iso](https://www.softwareok.com/?Download=WinBin2Iso)
1037. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/WinPing](https://www.softwareok.com/?Download=WinPing)
1038. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/WinScan2PDF](https://www.softwareok.com/?Download=WinScan2PDF)
1039. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softwareok.com" width="16"> SoftwareOK/Zigarettenschachtel-Spruch](https://www.softwareok.com/?Download=Zigarettenschachtel-Spruch)
1040. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sol.gfxile.net" width="16"> SoLoud](http://sol.gfxile.net/soloud/downloads.html)
1042. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/AskAdmin](https://www.sordum.org/7941/)
1043. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Backup Start Menu Layout](https://www.sordum.org/10997/)
1044. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/BlueLife Hosts Editor](https://www.sordum.org/8266/)
1045. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/BlueLife KeyFreeze](https://www.sordum.org/7921/)
1046. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Bluetooth Version finder](https://www.sordum.org/10772/)
1047. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Bpuzzle](https://www.sordum.org/8058/)
1048. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Copy IP](https://www.sordum.org/9201/)
1049. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Defender Control](https://www.sordum.org/9480/)
1050. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Defender Injector](https://www.sordum.org/10636/)
1051. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Desktop.ini Editor](https://www.sordum.org/10084/)
1052. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Dns Angel](https://www.sordum.org/8127/)
1053. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Dns Jumper](https://www.sordum.org/7952/)
1054. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Dns Lock](https://www.sordum.org/9432/)
1055. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Drive Letter Changer](https://www.sordum.org/8501/)
1056. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Easy Context Menu](https://www.sordum.org/7615/)
1057. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Easy Service Optimizer](https://www.sordum.org/8637/)
1058. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Edge Blocker](https://www.sordum.org/9312/)
1059. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Find Prime Numbers](https://www.sordum.org/9207/)
1060. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Firewall App Blocker](https://www.sordum.org/8125/)
1061. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Fix Print Spooler](https://www.sordum.org/9199/)
1062. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Folder Painter](https://www.sordum.org/10124/)
1063. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Hibernate Enable or Disable](https://www.sordum.org/9502/)
1064. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Hide From Uninstall List](https://www.sordum.org/11081/)
1065. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Net Disabler](https://www.sordum.org/9660/)
1066. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Ntfs Drive Protection](https://www.sordum.org/8117/)
1067. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/PowerRun](https://www.sordum.org/9416/)
1068. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Qemu Simple Boot](https://www.sordum.org/7763/)
1069. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Ratool](https://www.sordum.org/8104/)
1070. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Rebuild Shell Icon Cache](https://www.sordum.org/9194/)
1071. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Reduce Memory](https://www.sordum.org/9197/)
1072. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Reg Converter](https://www.sordum.org/8478/)
1073. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Registry Key Jumper](https://www.sordum.org/8110/)
1074. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/ReIcon](https://www.sordum.org/8366/)
1075. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Reset Data Usage](https://www.sordum.org/9817/)
1076. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Restart Explorer](https://www.sordum.org/9192/)
1077. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Router Default Password](https://www.sordum.org/10411/)
1078. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/RunAsTool](https://www.sordum.org/8727/)
1079. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/SendTo Menu Editor](https://www.sordum.org/10830/)
1080. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Show Desktop Icons](https://www.sordum.org/9341/)
1081. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Show Disk Partition Style](https://www.sordum.org/9307/)
1082. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Shut Down Windows](https://www.sordum.org/9205/)
1083. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Simple Run Blocker](https://www.sordum.org/8486/)
1084. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Simple VHD  Manager](https://www.sordum.org/8705/)
1085. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Sordum Monitor Off](https://www.sordum.org/10104/)
1086. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Sordum Random Password Generator](https://www.sordum.org/10946/)
1087. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Streams Remover](https://www.sordum.org/11263/)
1088. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Temp Cleaner](https://www.sordum.org/9190/)
1089. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Tunnel Adapter Microsoft 6to4 Adapter Remover](https://www.sordum.org/6423/)
1090. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Update Time](https://www.sordum.org/9203/)
1091. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/VHD For Context Menu](https://www.sordum.org/9209/)
1092. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/WebCam On-Off](https://www.sordum.org/8585/)
1093. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Win10 Settings Blocker](https://www.sordum.org/11128/)
1094. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Windows TopMost Control](https://www.sordum.org/9182/)
1095. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sordum.org" width="16"> Sordum/Windows Update Blocker](https://www.sordum.org/9470/)
1096. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> soundnode-app](https://github.com/Soundnode/soundnode-app/releases/latest) [167/4,379/604] Soundnode App is the Soundcloud for desktop. Built with Electron, Angular.js and Soundcloud API.
1097. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sourcetreeapp.com" width="16"> SourceTree](https://www.sourcetreeapp.com/)
1098. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> SpaceRadar](https://github.com/zz85/space-radar/releases/latest) [24/873/58] Disk And Memory Space Visualization App built with Electron & d3.js
1099. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.uderzo.it" width="16"> SpaceSniffer](http://www.uderzo.it/main_products/space_sniffer/download_alt.html)
1100. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=speedcrunch.org" width="16"> SpeedCrunch](http://speedcrunch.org/download.html)
1101. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.crystalidea.com" width="16"> SpeedyFox](https://www.crystalidea.com/speedyfox)
1102. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softpedia.com" width="16"> Spreaker Studio](https://www.softpedia.com/get/IPOD-TOOLS/Podcast/Spreaker-Studio.shtml) [Free Personal] Free Download Spreaker Studio - Record, edit and broadcast podcasts, as well as get detailed analytic information to measure their popularity with t...
1103. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Sqlectron](https://github.com/sqlectron/sqlectron-gui/releases/latest) [85/2,588/284] UNMAINTAINED - SEE BELOW. A simple and lightweight SQL client desktop with cross database and platform support.
1104. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sqlite.org" width="16"> SQLite](https://sqlite.org/download.html)
1105. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Standard Notes](https://github.com/standardnotes/desktop/releases/latest) [28/560/54] A simple and private notes app. Mac, PC, & Linux app | https://standardnotes.org
1106. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=biblprog.com" width="16"> Steam](https://biblprog.com/en/steam/download/)
1107. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=strawberryperl.com" width="16"> Strawberry Perl](http://strawberryperl.com/releases.html)
1108. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.stremio.com" width="16"> Stremio](https://www.stremio.com/downloads) [Freemium]
1109. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> stretchly](https://github.com/hovancik/stretchly/releases/latest) [29/844/136] break time reminder app.
1110. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sublimetext.com" width="16"> Sublime Text](http://www.sublimetext.com/3) [Free Personal]
1111. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.sumatrapdfreader.org" width="16"> SumatraPDF](https://www.sumatrapdfreader.org/sumatra.js)
1112. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> SwitchHosts](https://github.com/oldj/SwitchHosts/releases/latest) [320/6,615/875] Switch hosts quickly!
1113. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.syncfolders.elementfx.com" width="16"> SyncFolders](http://www.syncfolders.elementfx.com/download.html)
1115. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/AccessChk](https://docs.microsoft.com/zh-cn/sysinternals/downloads/accesschk)
1116. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/AccessEnum](https://docs.microsoft.com/zh-cn/sysinternals/downloads/accessenum)
1117. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Active Directory Explorer](https://docs.microsoft.com/zh-cn/sysinternals/downloads/adexplorer)
1118. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/AdRestore](https://docs.microsoft.com/zh-cn/sysinternals/downloads/adrestore)
1119. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Autologon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/autologon)
1120. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Autoruns](https://docs.microsoft.com/zh-cn/sysinternals/downloads/autoruns)
1121. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/BgInfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/bginfo)
1122. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/BlueScreen](https://docs.microsoft.com/zh-cn/sysinternals/downloads/bluescreen)
1123. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/CacheSet](https://docs.microsoft.com/zh-cn/sysinternals/downloads/cacheset)
1124. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/ClockRes](https://docs.microsoft.com/zh-cn/sysinternals/downloads/clockres)
1125. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Contig](https://docs.microsoft.com/zh-cn/sysinternals/downloads/contig)
1126. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Coreinfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/coreinfo)
1127. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Ctrl2Cap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ctrl2cap)
1128. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/DebugView](https://docs.microsoft.com/zh-cn/sysinternals/downloads/debugview)
1129. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Desktops](https://docs.microsoft.com/zh-cn/sysinternals/downloads/desktops)
1130. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Disk Usage](https://docs.microsoft.com/zh-cn/sysinternals/downloads/du)
1131. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Disk2vhd](https://docs.microsoft.com/zh-cn/sysinternals/downloads/disk2vhd)
1132. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/DiskExt](https://docs.microsoft.com/zh-cn/sysinternals/downloads/diskext)
1133. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/DiskMon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/diskmon)
1134. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/DiskView](https://docs.microsoft.com/zh-cn/sysinternals/downloads/diskview)
1135. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/EFSDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/efsdump)
1136. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/FindLinks](https://docs.microsoft.com/zh-cn/sysinternals/downloads/findlinks)
1137. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Handle](https://docs.microsoft.com/zh-cn/sysinternals/downloads/handle)
1138. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Hex2dec](https://docs.microsoft.com/zh-cn/sysinternals/downloads/hex2dec)
1139. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Insight for Active Directory](https://docs.microsoft.com/zh-cn/sysinternals/downloads/adinsight)
1140. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Junction](https://docs.microsoft.com/zh-cn/sysinternals/downloads/junction)
1141. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/LDMDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ldmdump)
1142. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/ListDLLs](https://docs.microsoft.com/zh-cn/sysinternals/downloads/listdlls)
1143. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/LiveKd](https://docs.microsoft.com/zh-cn/sysinternals/downloads/livekd)
1144. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/LoadOrder](https://docs.microsoft.com/zh-cn/sysinternals/downloads/loadorder)
1145. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/LogonSessions](https://docs.microsoft.com/zh-cn/sysinternals/downloads/logonsessions)
1146. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/NotMyFault](https://docs.microsoft.com/zh-cn/sysinternals/downloads/notmyfault)
1147. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/NTFSInfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ntfsinfo)
1148. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PageDefrag](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pagedefrag)
1149. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PendMovesand MoveFile](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pendmoves)
1150. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PipeList](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pipelist)
1151. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Portmon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/portmon)
1152. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/ProcDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/procdump)
1153. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Process Explorer](https://docs.microsoft.com/zh-cn/sysinternals/downloads/process-explorer)
1154. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Process Monitor](https://docs.microsoft.com/zh-cn/sysinternals/downloads/procmon)
1155. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsExec](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psexec)
1156. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsFile](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psfile)
1157. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsGetSid](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psgetsid)
1158. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsInfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psinfo)
1159. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsKill](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pskill)
1160. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsList](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pslist)
1161. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsLoggedOn](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psloggedon)
1162. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsLogList](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psloglist)
1163. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsPasswd](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pspasswd)
1164. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsPing](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psping)
1165. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsService](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psservice)
1166. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsShutdown](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psshutdown)
1167. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/PsSuspend](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pssuspend)
1168. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/RAMMap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/rammap)
1169. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/RegDelNull](https://docs.microsoft.com/zh-cn/sysinternals/downloads/regdelnull)
1170. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Registry Usage](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ru)
1171. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/RegJump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/regjump)
1172. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/RootkitRevealer](https://docs.microsoft.com/zh-cn/sysinternals/downloads/rootkit-revealer)
1173. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/SDelete](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sdelete)
1174. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/ShareEnum](https://docs.microsoft.com/zh-cn/sysinternals/downloads/shareenum)
1175. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/ShellRunas](https://docs.microsoft.com/zh-cn/sysinternals/downloads/shellrunas)
1176. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Sigcheck](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sigcheck)
1177. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Streams](https://docs.microsoft.com/zh-cn/sysinternals/downloads/streams)
1178. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Strings](https://docs.microsoft.com/zh-cn/sysinternals/downloads/strings)
1179. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Sync](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sync)
1180. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Sysmon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sysmon)
1181. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/TCPView](https://docs.microsoft.com/zh-cn/sysinternals/downloads/tcpview)
1182. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/VMMap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/vmmap)
1183. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/VolumeID](https://docs.microsoft.com/zh-cn/sysinternals/downloads/volumeid)
1184. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/Whois](https://docs.microsoft.com/zh-cn/sysinternals/downloads/whois)
1185. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/WinObj](https://docs.microsoft.com/zh-cn/sysinternals/downloads/winobj)
1186. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> Sysinternals/ZoomIt](https://docs.microsoft.com/zh-cn/sysinternals/downloads/zoomit)
1187. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=docs.microsoft.com" width="16"> SysinternalsSuite](https://docs.microsoft.com/en-us/sysinternals/downloads/sysinternals-suite)
1188. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=singularlabs.com" width="16"> System Ninja](https://singularlabs.com/software/system-ninja/confirm-download/) [Free Personal]
1189. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> T-Clock](https://github.com/White-Tiger/T-Clock/releases/) [48/459/59] Highly configurable Windows taskbar clock.
1190. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> TablacusExplorer](https://github.com/tablacus/TablacusExplorer/releases/latest) [25/181/38] A tabbed file manager with Add-on support.
1191. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.xdlab.ru" width="16"> TagScanner](https://www.xdlab.ru/en/download.htm)
1192. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> TagSpaces](https://github.com/tagspaces/tagspaces/releases/latest) [Free Personal] [93/1,622/243] TagSpaces is an offline, open source, document manager with tagging support
1193. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.taskade.com" width="16"> Taskade](https://www.taskade.com/downloads)
1194. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.teamspeak.com" width="16"> TeamSpeak](https://www.teamspeak.com/en/downloads/) [Free Personal]
1195. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=community.teamviewer.com" width="16"> TeamViewer](https://community.teamviewer.com/t5/Change-Log-Windows/bd-p/Change_Log_Windows) [Freemium]
1196. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Telegram](https://github.com/telegramdesktop/tdesktop/releases/latest) [636/9,066/2,235] Telegram Desktop messaging app.
1197. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Temps](https://github.com/jackd248/temps/releases/latest) [17/478/61] Simple menubar application based on Electron with actual weather information and forecast.
1198. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=im.qq.com" width="16"> Tencent QQ](https://im.qq.com/pcqq/) :hand:
1199. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=tim.qq.com" width="16"> Tencent TIM](https://tim.qq.com/download.html) :hand:
1200. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Terminus](https://github.com/Eugeny/terminus/releases/latest) [141/5,859/196] A terminal for a more modern age.
1201. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Teseve](https://github.com/teseve/teseve/releases/latest) [9/143/15] A simple static webserver, in an app.
1202. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.cgsecurity.org" width="16"> TestDisk](https://www.cgsecurity.org/wiki/TestDisk_Download)
1203. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=rammichael.com" width="16"> Textify](https://rammichael.com/downloads/textify_setup.exe?changelog)
1204. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> The Silver Searcher](https://github.com/k-takata/the_silver_searcher-win32/releases) [6/85/5] The silver searcher Win32 unofficial daily builds.
1206. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Auburn](http://www.the-sz.com/products/auburn/)
1207. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Bear](http://www.the-sz.com/products/bear/)
1208. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Bedford](http://www.the-sz.com/products/bedford/)
1209. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Bennett](http://www.the-sz.com/products/bennett/)
1210. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Carroll](http://www.the-sz.com/products/carroll/)
1211. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/CDInfo](http://www.the-sz.com/products/cdinfo/)
1212. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/CheckSum](http://www.the-sz.com/products/checksum/)
1213. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Compton](http://www.the-sz.com/products/compton/)
1214. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Conroe](http://www.the-sz.com/products/conroe/)
1215. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/CPUGrabEx](http://www.the-sz.com/products/cpugrabex/)
1216. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Doro](http://www.the-sz.com/products/doro/)
1217. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/FlashBuilder](http://www.the-sz.com/products/flash/)
1218. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Grand](http://www.the-sz.com/products/grand/)
1219. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Homedale](http://www.the-sz.com/products/homedale/)
1220. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Howard](http://www.the-sz.com/products/howard/)
1221. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Malden](http://www.the-sz.com/products/malden/)
1222. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Medford](http://www.the-sz.com/products/medford/)
1223. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Music&VideoDownloader](http://www.the-sz.com/products/lacey/)
1224. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Nassau](http://www.the-sz.com/products/nassau/)
1225. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Netchat](http://www.the-sz.com/products/netchat/)
1226. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Parkdale](http://www.the-sz.com/products/parkdale/)
1227. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/PEPatch](http://www.the-sz.com/products/pe_patch/)
1228. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Pictures on Map](https://www.the-sz.com/products/pictures_on_map/)
1229. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/PortScan](http://www.the-sz.com/products/portscan/)
1230. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Quartz](http://www.the-sz.com/products/quartz/)
1231. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Redwood](http://www.the-sz.com/products/redwood/)
1232. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/RequestTrace](http://www.the-sz.com/products/rt/)
1233. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Richmond](http://www.the-sz.com/products/richmond/)
1234. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Rimhill](http://www.the-sz.com/products/rimhillex/)
1235. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Royal](http://www.the-sz.com/products/royal/)
1236. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Seaside](http://www.the-sz.com/products/seaside/)
1237. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Sherwood](http://www.the-sz.com/products/sherwood/)
1238. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/SkypeFocusFix](http://www.the-sz.com/products/skypefocusfix/)
1239. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Spencer](http://www.the-sz.com/products/spencer/)
1240. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/SpyEx](http://www.the-sz.com/products/spyex/)
1241. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Stanley](http://www.the-sz.com/products/stanley/)
1242. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Temple](http://www.the-sz.com/products/temple/)
1243. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/VisualCVS](http://www.the-sz.com/products/visualcvs/)
1244. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/Yale](http://www.the-sz.com/products/yale/)
1245. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.the-sz.com" width="16"> the-sz/York](http://www.the-sz.com/products/york/)
1246. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.tixati.com" width="16"> Tixati](https://www.tixati.com/download/windows64.html)
1247. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Toby](https://github.com/frankhale/toby/releases/latest) [8/121/15] A YouTube player for the desktop.
1248. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Tockler](https://github.com/MayGo/tockler/releases/latest) [12/159/27] Application that tracks your time by monitoring your active windows (only titles) and idle time.
1249. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=abstractspoon.weebly.com" width="16"> ToDoList](https://abstractspoon.weebly.com/)
1250. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> todometer](https://github.com/cassidoo/todometer/releases/latest) [36/772/91] A meter-based to-do list.
1251. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Tomboy](https://github.com/tomboy-notes/tomboy-ng/releases/latest) [13/57/8] Next generation of Tomboy.
1252. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Topsi Project Manager](https://github.com/Physiix/topsi-project-manager/releases/) [41/1,023/67] A Desktop Kanban board app.
1253. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.torproject.org" width="16"> Tor Browser](https://www.torproject.org/download/download-easy.html.en) :airplane:
1254. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=tortoisegit.org" width="16"> TortoiseGit](https://tortoisegit.org/download/)
1255. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=tortoisesvn.net" width="16"> TortoiseSVN](https://tortoisesvn.net/downloads.html)
1256. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Toshocat](https://github.com/tofuness/Toshocat/releases/latest) [21/152/11] Anime and Manga list app for desktop.
1257. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ghisler.com" width="16"> Total Commander](https://www.ghisler.com/download.htm) [Free Personal]
1258. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.martau.com" width="16"> Total Uninstall](https://www.martau.com/uninstaller-download.php) :money_with_wings:
1259. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=touchpad-blocker.com" width="16"> Touchpad Blocker](https://touchpad-blocker.com)
1260. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.git-tower.com" width="16"> Tower](https://www.git-tower.com/release-notes/windows) :money_with_wings:
1261. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> traccar](https://github.com/traccar/traccar/releases/latest) [232/1,696/1,236] Traccar GPS Tracking System.
1262. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> TrafficMonitor](https://github.com/zhongyang219/TrafficMonitor/releases/latest) [121/3,398/441] 这是一个用于显示当前网速、CPU及内存利用率的桌面悬浮窗软件，并支持任务栏显示，支持更换皮肤。.
1263. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Transmission](https://github.com/transmission/transmission/releases/latest) [142/2,618/479] Official Transmission BitTorrent client repository
1264. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Traymond](https://github.com/fcFn/traymond/releases/latest) [12/122/7] A simple Windows app for minimizing windows to tray icons
1265. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Trendy](https://github.com/rhysd/Trendy/releases/latest) [7/162/7] Menubar app to keep you in the loop of GitHub trends :octocat:
1266. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Tribler](https://github.com/Tribler/tribler/releases/latest) [157/2,881/348] Privacy enhanced BitTorrent client with P2P content discovery
1267. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.tunnelbear.com" width="16"> TunnelBear](https://www.tunnelbear.com/core/getVersionHistory?platform=pc) [Free Personal] :airplane:
1268. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Turtl](https://github.com/turtl/desktop/releases/latest) [33/453/28] Turtl's desktop app.
1269. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Tusk](https://github.com/klaussinani/tusk/releases/latest) [75/2,000/131] 🐘 Refined Evernote desktop app.
1270. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.filehorse.com" width="16"> Twitch](https://www.filehorse.com/download-twitch-desktop-app/download/) [Free Personal] :hand:
1271. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softpedia.com" width="16"> Typetalk](https://www.softpedia.com/get/Internet/Chat/Instant-Messaging/Typetalk.shtml) [Free Personal] Free Download Typetalk - Efficiently collaborate with your team members from a secure and distraction-free environment with the help of this streaml...
1272. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=vaemendis.net" width="16"> Ubooquity](http://vaemendis.net/ubooquity/static2/download)
1273. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Udeler](https://github.com/FaisalUmair/udemy-downloader-gui/releases/latest) [151/1,713/435] A desktop application for downloading Udemy Courses
1274. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ueli](https://github.com/oliverschwendener/ueli/releases/latest) [22/319/33] This is a keystroke launcher for Windows and macOS.
1275. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=ugetdm.com" width="16"> uGet](https://ugetdm.com/downloads/windows/)
1276. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.ultraiso.com" width="16"> UltraISO](https://www.ultraiso.com/download.html)
1277. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=wujieliulan.com" width="16"> ultraSurf](http://wujieliulan.com/) :airplane:
1278. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Uncolored](https://github.com/n457/Uncolored/releases/latest) [38/648/42] (Un)colored — Next generation desktop rich content editor that saves documents with themes. HTML & Markdown compatible. For Windows, OS X & Linux. — http://n457.github.io/Uncolored/
1279. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> UNetbootin](https://github.com/unetbootin/unetbootin/releases/latest) [73/1,083/177] UNetbootin installs Linux/BSD distributions to a partition or USB drive
1280. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Universal Extractor 2](https://github.com/Bioruebe/UniExtract2/releases/latest) [100/581/84] Universal Extractor 2 is an unofficial updated and extended version of the original UniExtract by Jared Breland. It brings several hundred changes including community-wanted ones such as a batch mode, auto-updater and scan-only-functionality.
1281. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=forum.oszone.net" width="16"> Universal Extractor mod by koros aka ya158](http://forum.oszone.net/thread-295084.html) :hand:
1282. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=x-diesel.com" width="16"> Unreal Commander](https://x-diesel.com/?download) [Free Personal]
1283. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softpedia.com" width="16"> UpdateStar](https://www.softpedia.com/get/System/System-Miscellaneous/UpdateStar.shtml) [Free Personal] Free Download UpdateStar Freeware Edition - Modern-looking application which enables you to quickly scan the contents of your computer, so as to inf...
1284. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> upx](https://github.com/upx/upx/releases/latest) [181/3,464/418] UPX - the Ultimate Packer for eXecutables.
1285. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=resource.u-tools.cn" width="16"> uTools](https://resource.u-tools.cn/version/latest.yml)
1286. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=blog.utorrent.com" width="16"> uTorrent](http://blog.utorrent.com/releases/windows/) [Free Personal]
1287. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> v2ray](https://github.com/v2ray/v2ray-core/releases/latest) [873/14,348/3,119] A platform for building proxies to bypass network restrictions.
1288. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> v2rayN](https://github.com/2dust/v2rayN/releases/latest) [181/2,519/694] Contribute to  development by creating an account on GitHub.
1289. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> V2RayW](https://github.com/Cenmrev/V2RayW/releases) [57/689/167] GUI for v2ray-core on Windows.
1290. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> VcXsrv](https://sourceforge.net/projects/vcxsrv/files/) Windows X-server based on the xorg git sources (like xming or cygwin's xwin), but compiled with Visual C++ 2012 Express Edition. Source code can…
1291. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=velocity.silverlakesoftware.com" width="16"> Velocity](https://velocity.silverlakesoftware.com/) [Free Personal]
1292. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> VerySleepy](https://github.com/VerySleepy/verysleepy/releases/latest) [45/504/60] Very Sleepy, a polling CPU profiler.
1293. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Video Download Manager](https://github.com/ingbyr/VDM/releases/latest) [96/1,519/252] GUI for command-line video downloader (youtube-dl annie)
1294. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.videoder.com" width="16"> Videoder](https://www.videoder.com/download/videoder-for-windows?arch=64)
1295. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Visual Studio Code](https://github.com/Microsoft/vscode/releases) [2,684/71,030/9,445] Visual Studio Code.
1296. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.videolan.org" width="16"> VLC Media Player](https://www.videolan.org/vlc/download-windows.html)
1297. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Vmd](https://github.com/yoshuawuyts/vmd/releases/latest) [15/987/90] :pray: preview markdown files.
1298. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> VNote](https://github.com/tamlok/vnote/releases/latest) [191/3,927/389] A note-taking application that knows programmers and Markdown better.
1299. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=irzyxa.blogspot.com" width="16"> Volume2](https://irzyxa.blogspot.com/p/downloads.html)
1300. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> VOX](https://github.com/fresk-nc/VOX/releases/latest) [10/162/22] Audio Player powered by Electron.
1301. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.vpngate.net" width="16"> VPN Gate](https://www.vpngate.net/cn/download.aspx) :airplane: :hand:
1302. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> VTerm](https://github.com/vterm/vterm/releases/latest) [7/43/9] :fire: Extensible terminal emulator written with the web languages of the future. Today.
1303. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> vuetron](https://github.com/vuetwo/vuetron/releases/latest) [11/485/18] A tool for testing and debugging your Vue + Vuex applications. 是一個可以幫助您 Vue.js 的項目測試及偵錯的工具, 也同時支持 Vuex及 Vue-Router.
1304. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> wagon](https://github.com/laravel-dojo/wagon/releases/latest) [26/181/19] 免安裝可攜的 Laravel 開發環境.
1305. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> waifu2x-caffe](https://github.com/lltcggie/waifu2x-caffe/releases/latest) [241/2,861/385] waifu2xのCaffe版.
1306. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> waifu2x-DeadSix27](https://github.com/DeadSix27/waifu2x-converter-cpp/releases/latest) [23/253/143] Improved fork of Waifu2X C++ using OpenCL and OpenCV
1307. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Wavebox](https://github.com/wavebox/waveboxapp/releases/latest) [40/984/132] Wavebox lets you bring all your web communication tools together for faster, smarter working. Gmail, Outlook, Office 365, Slack, Trello & 1000's more
1308. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=rime.im" width="16"> Weasel](https://rime.im/download/)
1309. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.cyotek.com" width="16"> WebCopy](https://www.cyotek.com/cyotek-webcopy/downloads)
1310. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> WebTorrent](https://github.com/webtorrent/webtorrent-desktop/releases/latest) [255/6,022/693] ❤️ Streaming torrent app for Mac, Windows, and Linux
1311. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=work.weixin.qq.com" width="16"> WeChat Work](https://work.weixin.qq.com/)
1312. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=pc.weixin.qq.com" width="16"> WeChat](https://pc.weixin.qq.com/?t=win_weixin)
1313. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> weweChat](https://github.com/trazyn/weweChat/releases/latest) [155/4,235/536] 💬 Unofficial WeChat client built with React, MobX and Electron.
1314. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Wexond](https://github.com/wexond/wexond/releases/latest) [52/852/71] An extensible web browser with beautiful and minimalistic UI and many innovative features
1315. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> WGestures](https://github.com/yingDev/WGestures/releases/latest) [49/623/121] Modern mouse gestures for Windows. (C#).
1316. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=eternallybored.org" width="16"> wget](https://eternallybored.org/misc/wget/)
1317. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.softpedia.com" width="16"> WhatsApp](https://www.softpedia.com/get/Internet/Chat/Instant-Messaging/WhatsApp.shtml) Free Download WhatsApp for PC - Keep in touch with your phone contacts in a broad variety of ways by sending them text messages, audio or video reco...
1318. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> WhatsDesktop](https://github.com/mawie81/whatsdesktop/releases/latest) [11/233/36] Unofficial WhatsApp app.
1319. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> WikidPad](https://github.com/WikidPad/WikidPad/releases/) [22/79/24] WikidPad is a single user desktop wiki.
1320. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.winamp.com" width="16"> Winamp](http://www.winamp.com/) [Free Personal]
1321. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> WinAuth](https://github.com/winauth/winauth/releases) [77/914/139] Authenticator on Windows for Battle.net / Steam / Guild Wars 2 / Glyph / Runescape / SWTOR / Bitcoin and digital currency exchanges
1322. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=wincdemu.sysprogs.org" width="16"> WinCDEmu Portable](http://wincdemu.sysprogs.org/portable/)
1323. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=windirstat.net" width="16"> WinDirStat](https://windirstat.net/download.html)
1324. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kls-soft.com" width="16"> Windows System Control Center](http://www.kls-soft.com/wscc/downloads.php) [Freemium]
1325. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=s3.amazonaws.com" width="16"> Winds](https://s3.amazonaws.com/winds-2.0-releases/latest.html)
1326. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.filehorse.com" width="16"> Windscribe](https://www.filehorse.com/download-windscribe/download/) [Free Personal]
1327. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.x-ways.net" width="16"> WinHex](http://www.x-ways.net/winhex/) :money_with_wings:
1328. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=winmerge.org" width="16"> WinMerge](http://winmerge.org/downloads/)
1329. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=msfn.org" width="16"> WinNTSetup](https://msfn.org/board/topic/149612-winntsetup/)
1330. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.rarlab.com" width="16"> WinRAR](https://www.rarlab.com/download.htm) [Free Personal]
1331. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=winscp.net" width="16"> WinSCP](https://winscp.net/eng/download.php)
1332. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> winyl](https://github.com/winyl-player/winyl/releases) [9/59/0] Winyl's main repository.
1333. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Wire](https://github.com/wireapp/wire-desktop/releases) [73/775/171] :computer: Wire for desktop.
1335. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Anti Malware](https://www.wisecleaner.com/wise-anti-malware.html)
1336. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Auto Shutdown](https://www.wisecleaner.com/wise-auto-shutdown.html)
1337. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Care 365](https://www.wisecleaner.com/wise-care-365.html) [Free Personal]
1338. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Data Recovery](https://www.wisecleaner.com/wise-data-recovery.html)
1339. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Disk Cleaner](https://www.wisecleaner.com/wise-disk-cleaner.html)
1340. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Duplicate Finder](https://www.wisecleaner.com/wise-duplicate-finder.html)
1341. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Folder Hider Pro](https://www.wisecleaner.com/wise-folder-hider-pro.html)
1342. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Force Deleter](https://www.wisecleaner.com/wise-force-deleter.html)
1343. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Game Booster](https://www.wisecleaner.com/wise-game-booster.html)
1344. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Hotkey](https://www.wisecleaner.com/wise-hotkey.html)
1345. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise JetSearch](https://www.wisecleaner.com/wise-jetsearch.html)
1346. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Memory Optimizer](https://www.wisecleaner.com/wise-memory-optimizer.html)
1347. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise PC 1stAid](https://www.wisecleaner.com/wise-pc-1staid.html)
1348. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Plugin Manager](https://www.wisecleaner.com/wise-plugin-manager.html)
1349. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Program Uninstaller](https://www.wisecleaner.com/wise-program-uninstaller.html)
1350. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Registry Cleaner](https://www.wisecleaner.com/wise-registry-cleaner.html)
1351. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Reminder](https://www.wisecleaner.com/wise-reminder.html)
1352. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise System Monitor](https://www.wisecleaner.com/wise-system-monitor.html)
1353. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wisecleaner.com" width="16"> Wise/Wise Windows Key Finder](https://www.wisecleaner.com/wise-windows-key-finder.html)
1354. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> WiX Toolset](https://github.com/wixtoolset/wix3/releases/latest) [144/821/347] WiX Toolset v3.x.
1355. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=antibody-software.com" width="16"> WizFile](https://antibody-software.com/web/software/software/wizfile-finds-your-files-fast/)
1356. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=antibody-software.com" width="16"> WizKey](https://antibody-software.com/web/software/software/wizkey-makes-it-easy-to-type-accented-and-other-special-unicode-characters/) :money_with_wings:
1357. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=antibody-software.com" width="16"> WizMouse](https://antibody-software.com/web/software/software/wizmouse-makes-your-mouse-wheel-work-on-the-window-under-the-mouse/)
1358. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=antibody-software.com" width="16"> WizTree](https://antibody-software.com/web/software/software/wiztree-finds-the-files-and-folders-using-the-most-disk-space-on-your-hard-drive/)
1359. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> WordPress.com](https://github.com/Automattic/wp-desktop/releases/latest) [175/684/231] WordPress.com for Desktop.
1360. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Wox](https://github.com/Wox-launcher/Wox/releases) [507/12,455/1,256] Launcher for Windows, an alternative to Alfred and Launchy.
1361. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> wsltty](https://github.com/mintty/wsltty/releases/latest) [63/1,751/48] Mintty as a terminal for Bash on Ubuntu on Windows / WSL
1362. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> wxHexEditor](https://sourceforge.net/projects/wxhexeditor/files/wxHexEditor/) wxHexEditor is another Hex Editor, build because of there is no good hex editor for Linux system, specially for big files. It supports files up to…
1363. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.highrez.co.uk" width="16"> X-Mouse Button Control](https://www.highrez.co.uk/downloads/xmbc_changelog.htm)
1364. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> x64dbg](https://github.com/x64dbg/x64dbg/releases/latest) [3,308/33,672/944] An open-source x64/x32 debugger for windows.
1365. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.apachefriends.org" width="16"> XAMPP](https://www.apachefriends.org/index.html)
1366. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> XCEL](https://github.com/o2team/xcel/releases/latest) [25/497/74] 一个基于 Electron 和 Vue 的 Excel 数据过滤工具——凹凸实验室出品 https://aotu.io/notes/2016/11/15/xcel/
1367. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=sourceforge.net" width="16"> Xlideit Image Viewer](https://sourceforge.net/projects/xlideit/files) A lightweight image viewer with basic image processing
1368. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.un4seen.com" width="16"> XMPlay](http://www.un4seen.com/xmplay.html)
1369. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.xnview.com" width="16"> XnConvert](https://www.xnview.com/en/xnconvert/)
1370. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.xnview.com" width="16"> XnRetro](https://www.xnview.com/en/xnretro/)
1371. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.xnview.com" width="16"> XnSketch](https://www.xnview.com/en/xnsketch/)
1372. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.xnview.com" width="16"> XnView](https://www.xnview.com/en/xnview/) [Freemium]
1373. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.xnview.com" width="16"> XnViewMP](https://www.xnview.com/en/xnviewmp/) [Freemium]
1374. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=xdman.sourceforge.net" width="16"> Xtreme Download Manager](http://xdman.sourceforge.net/)
1375. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> XX-Net](https://github.com/XX-net/XX-Net/blob/master/code/default/download.md) a web proxy tool. Contribute to XX-net/XX-Net development by creating an account on GitHub.
1376. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.yacreader.com" width="16"> YACReader](http://www.yacreader.com/downloads)
1377. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> YakYak](https://github.com/yakyak/yakyak/releases/latest) [127/3,630/314] Desktop chat client for Google Hangouts.
1378. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=browser.yandex.com" width="16"> Yandex](https://browser.yandex.com/)
1380. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pcclean.io" width="16"> YL Computing/Coin Balance Tracker](http://www.pcclean.io/coin-balance-tracker/) :money_with_wings:
1381. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pcclean.io" width="16"> YL Computing/Dr.Folder](http://www.pcclean.io/dr-folder/download/) :money_with_wings:
1382. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pcclean.io" width="16"> YL Computing/Email Excavator](http://www.pcclean.io/email-excavator/download/) :money_with_wings:
1383. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pcclean.io" width="16"> YL Computing/My Faster Game](http://www.pcclean.io/my-faster-game/download/) :money_with_wings:
1384. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pcclean.io" width="16"> YL Computing/Perfect Hotkey](http://www.pcclean.io/perfect-hotkey/download/) :money_with_wings:
1385. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pcclean.io" width="16"> YL Computing/Process Checker](http://www.pcclean.io/process-checker/) :money_with_wings:
1386. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pcclean.io" width="16"> YL Computing/ScanMyReg](http://www.pcclean.io/scanmyreg/download/) :money_with_wings:
1387. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pcclean.io" width="16"> YL Computing/WinUtilities Pro](http://www.pcclean.io/winutilities-pro/download/) :money_with_wings:
1388. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pcclean.io" width="16"> YL Computing/WinUtilities](http://www.pcclean.io/winutilities-free/download/)
1389. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Yosoro](https://github.com/IceEnd/Yosoro/releases/latest) [69/1,340/185] :shaved_ice:Beautiful Markdown NoteBook Desktop App. 🏖
1390. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> youtube-dl-gui](https://github.com/MrS0m30n3/youtube-dl-gui/releases/latest) [193/2,966/451] A cross platform front-end GUI of the popular youtube-dl written in wxPython.
1391. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> youtube-dl](https://github.com/ytdl-org/youtube-dl/releases/latest) [1,694/48,077/8,337] Command-line program to download videos from YouTube.com and other video sites
1392. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pendrivelinux.com" width="16"> YUMI-UEFI](https://www.pendrivelinux.com/yumi-multiboot-usb-creator/)
1393. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.pendrivelinux.com" width="16"> YUMI](https://www.pendrivelinux.com/yumi-multiboot-usb-creator/)
1394. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=app.rrysapp.com" width="16"> YYetsShare](http://app.rrysapp.com/)
1395. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> Zazu](https://github.com/tinytacoteam/zazu/releases/latest) [62/1,765/125] :rocket: A fully extensible and open source launcher for hackers, creators and dabblers.
1396. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> zeal](https://github.com/zealdocs/zeal/releases/latest) [219/6,656/526] Offline documentation browser inspired by Dash.
1397. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.filehorse.com" width="16"> ZenMate](https://www.filehorse.com/download-zenmate-vpn/download/)
1398. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> ZeroNet](https://github.com/HelloZeroNet/ZeroNet/releases/latest) [856/13,423/1,744] ZeroNet - Decentralized websites using Bitcoin crypto and BitTorrent network
1399. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.zerotier.com" width="16"> ZeroTier One](https://www.zerotier.com/download.shtml) [Free Personal]
1400. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=zim.glump.net" width="16"> Zim](https://zim.glump.net/windows/)
1401. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.wiz.cn" width="16"> 为知笔记](http://www.wiz.cn/downloads-windows.html) :money_with_wings:
1402. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.crsky.com" width="16"> 冰点文库下载器](https://www.crsky.com/soft/25711.html)
1403. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=www.kami233.com" width="16"> 神剪辑](http://www.kami233.com/download/)
1404. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> 繁化姬](https://github.com/James1201/Fanhuaji-GUI-Release/releases/latest) [5/38/2] Contribute to  development by creating an account on GitHub.
1405. [<img src="https://besticon-demo.herokuapp.com/icon?size=16..32..40&url=github.com" width="16"> 鱼声音乐](https://github.com/AnyListen/YaVipCore/releases/latest) [18/251/87] Net Core Music Interface.

</details>

### Special Software
#### 特别的软件

##### Special Installer
###### 特殊的安装方式(作为参考)

1. [AIMP](software/AIMP.js)
2. [AutoHotkey](software/AutoHotkey.js)
3. [Bandisoft Bandizip](software/Bandisoft%20Bandizip.js)
4. [Bandisoft Honeyview](software/Bandisoft%20Honeyview.js)
5. [CocosCreator](software/CocosCreator.js)
6. [Cygwin](software/Cygwin.js)
7. [Evernote](software/Evernote.js)
8. [FastCopy](software/FastCopy.js)
9. [Fork](software/Fork.js)
10. [GIMP](software/GIMP.js)
11. [IObit/Driver Booster](software/IObit/Driver%20Booster.js)
12. [MinGW-w64](software/MinGW-w64.js)
13. [Python](software/Python.js)
14. [Python2](software/Python2.js)
15. [SmartGit](software/SmartGit.js)
16. [uTorrent](software/uTorrent.js)
17. [Weasel](software/Weasel.js)


##### Without Download
###### 缺失下载

1. [Enigma Virtual Box unpacker](software/Enigma%20Virtual%20Box%20unpacker.js)
2. [shadowsocks-qt5](software/shadowsocks-qt5.js)
3. [Universal Extractor mod by koros aka ya158](software/Universal%20Extractor%20mod%20by%20koros%20aka%20ya158.js)


##### Without Installer
###### 缺失安装方式

1. [Abricotine](software/Abricotine.js)
2. [Cloudevo](software/Cloudevo.js)
3. [FreeFileSync](software/FreeFileSync.js)
4. [Internet Download Manager](software/Internet%20Download%20Manager.js)
5. [NeoSmart/Windows 10 Rollback Utility](software/NeoSmart/Windows%2010%20Rollback%20Utility.js)
6. [RaiDrive](software/RaiDrive.js)
7. [SoftEtherVPN](software/SoftEtherVPN.js)
8. [Tencent QQ](software/Tencent%20QQ.js)
9. [Tencent TIM](software/Tencent%20TIM.js)
10. [Twitch](software/Twitch.js)
11. [VPN Gate](software/VPN%20Gate.js)


##### Extractable Software
###### 可以解包的软件

1. 以下软件的安装包使用 [Advanced Installer](https://www.advancedinstaller.com/) 打包
  可以使用参数 `/extract <path>` 来提取，查看[更多信息](https://www.advancedinstaller.com/user-guide/exe-setup-file.html)

    `RaiDrive`
