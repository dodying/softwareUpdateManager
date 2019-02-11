<!-- TOC -->

- [SoftwareUpdateManager](#softwareupdatemanager)
  - [软件更新管理器](#软件更新管理器)
    - [Usage](#usage)
      - [使用说明](#使用说明)
    - [Software Example](#software-example)
      - [软件示例](#软件示例)
    - [Priority of Some Config](#priority-of-some-config)
      - [一些设置的优先级](#一些设置的优先级)
    - [Note](#note)
      - [说明](#说明)
    - [Supported Software](#supported-software)
      - [支持的软件](#支持的软件)

<!-- /TOC -->

# SoftwareUpdateManager
## 软件更新管理器

### Usage
#### 使用说明

0. 使用前，请先复制一份`config.js`，并按其中注释修改
1. `node index.js 7z AIMP`
  检查并更新这些软件(多个软件用`空格`间隔) (忽略更新间隔)
2. `node index.js -filter abc`
  检查并更新路径匹配的软件(多个匹配条件用`,`相隔) (忽略更新间隔)
3. `node index.js -onlycheck`
  获取网上软件的最新版本号，并写入`database.json` (忽略更新间隔)
  效果: 忽略当前最新版本
4. `node index.js -list`
  列出`database.json`中的软件及版本
5. `node index.js -makemd`
  根据`software`文件夹下的`js`文件创建`README.md`


### Software Example
#### 软件示例

请参照`software\Telegram.js`
```js
'use strict'

let data = {
  // ?commercial: true/false,
  // ?useProxy: true/false,
  useProxy: true,
  url: 'https://github.com/telegramdesktop/tdesktop/releases/latest',
  version: {
    selector: '.release-header a'
    // attr:
    // 1. text or omitted => text()
    // 2. html => html()
    // 3. other => attr(other)
    //
    // ?match:
    // 1. omitted => /([\d.]+)/[1]
    // 2. /other/ => /other/[1]
    // ---
    // or func: async (res, $) => { return version }
  },
  /**
   * download:
   * omitted => open url
   */
  download: {
    // --- mode 0
    // selector: 'a:contains("Download Portable Zip 64-bit")',
    // attr: 'href',
    // match: '', // omitted => /(.*)/[1]
    // --- mode 1
    // plain: 'url/to/download'
    //   you can use variables with {}
    //   defined variables:
    //     version: the latest version
    // --- mode 2
    // func: async (res, $) => { return url }
    selector: 'a[href$=".zip"]:has(small.text-gray)',
    attr: 'href',
    // ?output:
    // save to which
    // if start with .(dot), it'll be named as software + output
    // or omitted: software + extension according to download url
    output: 'Telegram.zip' // this is same as '.zip' or omitted
  },
  /**
   * omitted => install manually
   * install: async function(output, iPath)
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
}
module.exports = data

```

### Priority of Some Config
#### 一些设置的优先级

1. 代理优先级(前提是设置了代理): `config.urlWithoutProxy > config.urlWithProxy > config.useProxy > software.useProxy`
2. 模式优先级: `config.specialMode > config.mode = config.commercialSoftware`


### Note
#### 说明

1. 以下软件，如果`通常版(installer)`与`便携版(portable)`功能相同则一般以绿色版优先，同时64位优先
2. 大多软件都支持自动安装
3. 带 :moneybag: 的为**商业软件**， 带 :airplane: 的需**番羽土墙**， 带 :hand: 的需**手动安装**
4. 这些站点默认视作 :airplane: : [SourceForge](https://sourceforge.net), [Github](https://github.com)

### Supported Software
#### 支持的软件

1. [7+ Taskbar Tweaker](https://rammichael.com/downloads/7tt_setup.exe?changelog) :airplane:
2. [7-Zip](https://www.7-zip.org/download.html)
3. [Actual Title Buttons](https://www.actualtools.com/titlebuttons/) :moneybag: :airplane:
4. [AIMP](http://www.aimp.ru/?do=download) :airplane:
5. [Anki](https://apps.ankiweb.net/) :airplane:
6. [annie](https://github.com/iawia002/annie/releases/latest) :airplane:
7. [Any Video Converter Ultimate](https://www.any-video-converter.com/products/for_video_ultimate/whatnew.php) :moneybag: :airplane:
8. [AnyDesk](https://anydesk.com/platforms/windows) :moneybag:
9. [aria2](https://github.com/aria2/aria2/releases/latest) :airplane:
10. [AutoHotkey](https://www.autohotkey.com/download/)
11. [AutoIt](https://www.autoitscript.com/site/autoit/downloads/)
12. [Bandizip](https://www.bandisoft.com/bandizip/)
13. [Beyond Compare](http://scootersoftware.com/download.php?zz=dl4) :moneybag:
14. [BiglyBT](https://github.com/BiglySoftware/BiglyBT/releases/latest) :airplane: :hand:
15. [Brook Tools](https://softs.loan/?dir=%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91/PC/Brook/Brook%20Tools)
16. [Brook](https://github.com/txthinking/brook/releases/latest) :airplane:
17. [Calibre](https://github.com/kovidgoyal/calibre/releases/latest) :airplane:
18. [CentBrowser](https://www.centbrowser.cn/history.html)
19. [Chrome](https://api.shuax.com/tools/getchrome) :airplane:
20. [ChromeUpdateSharp](https://csharp.love/chrome-update-tool.html)
21. [CLaunch](http://hp.vector.co.jp/authors/VA018351/claunch.html) :airplane:
22. [Cmder Mini](https://github.com/cmderdev/cmder/releases/latest) :airplane:
23. [ComicRack](http://comicrack.cyolito.com/downloads) :airplane:
24. [CopyQ](https://github.com/hluk/CopyQ/releases/latest) :airplane:
25. [cow](https://github.com/cyfdecyf/cow/releases/latest) :airplane:
26. [DB Browser for SQLite](https://github.com/sqlitebrowser/sqlitebrowser/releases/latest) :airplane:
27. [DevDocs Desktop](https://github.com/egoist/devdocs-desktop/releases/latest) :airplane:
28. [DiskGenius](http://www.eassos.com/download.php) :moneybag:
29. [Dism++](http://www.chuyu.me/zh-Hans/index.html)
30. [DisplayFusion](https://www.displayfusion.com/ChangeLog/) :moneybag: :airplane:
31. [DocFetcher](https://sourceforge.net/projects/docfetcher/files) :airplane:
32. [Dopamine](https://www.digimezzo.com/content/software/dopamine/) :airplane:
33. [Eric's Movie Database](http://www.emdb.eu/)
34. [Evernote](https://evernote.com/intl/zh-cn/download) :hand:
35. [Everything](https://www.voidtools.com/downloads/)
36. [ExtremeCopy](http://www.easersoft.com/product.html) :moneybag: :airplane:
37. [FastCopy-M](https://github.com/Mapaler/FastCopy-M/releases/latest) :airplane:
38. [FastCopy](https://fastcopy.jp/)
39. [ffmpeg](https://ffmpeg.zeranoe.com/builds/) :airplane:
40. [FileUploader](http://z-o-o-m.eu/down.htm) :airplane:
41. [firefly-proxy](https://github.com/yinghuocho/firefly-proxy/releases/latest) :airplane:
42. [FreeFileSync](https://freefilesync.org/download.php)
43. [FreeGate](https://github.com/freegate-release/website/) :airplane:
44. [GifCam](http://blog.bahraniapps.com/gifcam/) :airplane:
45. [Git for Windows Portable](https://github.com/git-for-windows/git/releases/latest) :airplane:
46. [Goflyway Tools](https://softs.loan/?dir=%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91/PC/GoFlyway/Goflyway%20Tools)
47. [goflyway](https://github.com/coyove/goflyway/releases) :airplane:
48. [golang](https://golang.org/dl/) :airplane:
49. [Honeyview](http://www.bandisoft.com/honeyview/)
50. [Hourglass](https://github.com/dziemborowicz/hourglass/releases/latest) :airplane:
51. [ImageMagick](http://www.imagemagick.org/script/download.php#windows)
52. [Inno Setup Unpacker](https://sourceforge.net/projects/innounp/files/innounp/) :airplane:
53. [Inno Setup](http://www.jrsoftware.org/isdl.php)
54. [Internet Download Manager](http://www.internetdownloadmanager.com/) :moneybag: :hand:
56. [JiJiDownForWPF](http://l.acesheep.com/bili/re.php?callback=?)
57. [LabelPlus](https://github.com/LabelPlus/LabelPlus/releases/latest) :airplane:
58. [launch4j](https://sourceforge.net/projects/launch4j/files/) :airplane:
59. [Lepton](https://github.com/hackjutsu/Lepton/releases/latest) :airplane:
60. [LICEcap](https://www.cockos.com/licecap/)
61. [MDB Viewer Plus](http://www.alexnolan.net/software/mdbplus.xml)
62. [MediaInfo-CLI](https://mediaarea.net/en/MediaInfo/Download/Windows)
63. [MediaInfo-GUI](https://mediaarea.net/en/MediaInfo/Download/Windows)
64. [MeGUI](https://sourceforge.net/projects/megui/files) :airplane:
65. [MemReduct](https://github.com/henrypp/memreduct/releases/latest)
66. [MiTec EXE Explorer](http://www.mitec.cz/index.html)
67. [MiTec Task Manager DeLuxe](http://www.mitec.cz/Data/XML/data_tmxvh.xml)
68. [MPC-BE](https://sourceforge.net/projects/mpcbe/files/) :airplane:
69. [MPC-HC](https://mpc-hc.org/downloads/)
70. [Nodejs-LTS](https://nodejs.org/en/download/)
71. [Nodejs](https://nodejs.org/en/download/current/)
72. [notepad++](https://notepad-plus-plus.org/download/) :airplane:
73. [notepad2-mod](https://github.com/XhmikosR/notepad2-mod/releases/latest) :airplane:
74. [nTurn](https://www.ntrun.com/) :hand:
75. [Office Tool Plus](https://otp.landian.la/zh-cn/)
76. [OnTopReplica](https://github.com/LorenzCK/OnTopReplica/releases/latest) :airplane:
77. [PicGo](https://github.com/Molunerfinn/PicGo/releases/latest) :airplane:
78. [PicPick](https://picpick.app/zh/download) :airplane:
79. [Piriform CCleaner](https://www.ccleaner.com/ccleaner/download) :moneybag:
80. [Piriform Defraggler](https://www.ccleaner.com/defraggler/download) :moneybag:
81. [Piriform Recuva](https://www.ccleaner.com/recuva/download) :moneybag:
82. [Piriform Speccy](https://www.ccleaner.com/speccy/download) :moneybag:
83. [PlayTime](http://www.dcmembers.com/skwire/download/playtime/) :airplane:
84. [PotPlayer](https://potplayer.daum.net/)
85. [qBittorrent](https://www.qbittorrent.org/download.php) :airplane:
86. [QTranslate](https://quest-app.appspot.com/) :airplane:
87. [Rapid Environment Editor](https://www.rapidee.com/en/download) :airplane:
88. [Registry Workshop](http://www.torchsoft.com/en/download.html) :moneybag:
89. [Resource Hacker](http://www.angusj.com/resourcehacker/)
90. [Resource Tuner](http://www.restuner.com/news-history.htm) :moneybag: :airplane:
91. [Right Click Enhancer Professional](https://rbsoft.org/downloads/right-click-enhancer/rce-professional-changelog.html) :moneybag: :airplane:
92. [Rufus](https://rufus.akeo.ie/)
93. [ScreenToGif](https://github.com/NickeManarin/ScreenToGif/releases/latest) :airplane:
94. [shadowsocks-qt5](https://github.com/shadowsocks/shadowsocks-qt5/releases/latest) :airplane: :hand:
95. [shadowsocks](https://github.com/shadowsocks/shadowsocks-windows/releases/latest) :airplane:
96. [shadowsocksr-csharp](https://github.com/shadowsocksrr/shadowsocksr-csharp/releases) :airplane:
97. [shadowsocksr-electron](https://github.com/erguotou520/electron-ssr/releases/latest) :airplane:
98. [ShareX](https://github.com/ShareX/ShareX/releases/latest) :airplane:
99. [SmartGit](https://www.syntevo.com/smartgit/download/) :moneybag:
100. [Sordum BlueLife KeyFreeze](https://www.sordum.org/7921/)
101. [Sordum Defender Injector](https://www.sordum.org/10636/)
102. [Sordum Desktop.ini Editor](https://www.sordum.org/10084/)
103. [Sordum Dns Jumper](https://www.sordum.org/7952/)
104. [Sordum Drive Letter Changer](https://www.sordum.org/8501/)
105. [Sordum Firewall App Blocker](https://www.sordum.org/8125/)
106. [Sordum Folder Painter](https://www.sordum.org/10124/)
107. [Sordum Reduce Memory](https://www.sordum.org/9197/)
108. [Sordum Reg Converter](https://www.sordum.org/8478/)
109. [Sordum Simple Run Blocker](https://www.sordum.org/8486/)
110. [Sordum Windows Update Blocker](https://www.sordum.org/9470/)
111. [SpeedCrunch](http://speedcrunch.org/download.html)
112. [SpeedyFox](https://www.crystalidea.com/speedyfox)
113. [Telegram](https://github.com/telegramdesktop/tdesktop/releases/latest) :airplane:
114. [Textify](https://rammichael.com/downloads/textify_setup.exe?changelog) :airplane:
115. [Tor Browser](https://www.torproject.org/download/download-easy.html.en) :airplane:
116. [Total Commander](https://www.ghisler.com/download.htm) :moneybag: :airplane:
117. [Total Uninstall](https://www.martau.com/uninstaller-download.php) :moneybag: :airplane:
118. [TrafficMonitor](https://github.com/zhongyang219/TrafficMonitor/releases/latest) :airplane:
119. [Transmission](https://github.com/transmission/transmission/releases/latest) :airplane:
120. [Traymond](https://github.com/fcFn/traymond/releases/latest) :airplane:
121. [ultraSurf](http://wujieliulan.com/) :airplane:
122. [Universal Extractor 2](https://github.com/Bioruebe/UniExtract2/releases/latest) :airplane:
123. [Unreal Commander](https://x-diesel.com/?download)
124. [uTorrent](http://blog.utorrent.com/releases/windows/) :moneybag: :hand:
125. [v2ray](https://github.com/v2ray/v2ray-core/releases/latest) :airplane:
126. [v2rayN](https://github.com/2dust/v2rayN/releases/latest) :airplane:
127. [Velocity](https://velocity.silverlakesoftware.com/) :moneybag:
128. [Video Download Manager](https://github.com/ingbyr/VDM/releases/latest) :airplane:
129. [Visual Studio Code](https://github.com/Microsoft/vscode/releases)
130. [Volume2](https://irzyxa.blogspot.com/p/downloads.html) :airplane:
131. [WGestures](https://github.com/yingDev/WGestures/releases/latest) :airplane:
132. [WinCDEmu Portable](http://wincdemu.sysprogs.org/portable/)
133. [Windows System Control Center](http://www.kls-soft.com/wscc/downloads.php) :airplane:
134. [WinHex](http://www.x-ways.net/winhex/) :moneybag:
135. [Xlideit Image Viewer](https://sourceforge.net/projects/xlideit/files) :airplane:
136. [XX-Net](https://github.com/XX-net/XX-Net/blob/master/code/default/download.md) :airplane:
137. [Yosoro](https://github.com/IceEnd/Yosoro/releases/latest) :airplane:
138. [zeal](https://zealdocs.org/download.html) :airplane:
139. [ZeroNet](https://github.com/HelloZeroNet/ZeroNet/releases/latest) :airplane:
140. [冰点文库下载器](http://www.bingdian001.com/?p=30) :hand:
141. [繁化姬](https://github.com/James1201/Fanhuaji-GUI-Release/releases/latest) :airplane:

