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

1. git clone
2. 从[这里](https://github.com/dodying/softwareUpdateManager/releases/tag/plugins)下载 **plugins.7z**，并解压到 **plugins** 下
3. 复制一份`config.default.js`，按其中注释修改并存为`config.js`

##### 其他说明

1. 以下软件，如果`通常版(installer)`与`便携版(portable)`功能相同则一般以绿色版优先(如果安装版的包小许多，则可能以安装版优先)，同时64位优先
2. 大多软件都支持自动安装
3. 带 :money_with_wings: 的为**商业软件** (包括Freemium与Free Persion)， 带 :airplane: 的需**番羽土墙**， 带 :hand: 的需**手动安装**
4. 代理优先级(前提是设置了代理): `config.urlWithoutProxy > config.urlWithProxy > config.useProxy > software.useProxy`
5. 模式优先级: `config.specialMode > config.mode = config.commercialSoftware`
6. 安装方法并没有一一测试，如果自动安装失败，请尝试手动安装


### Command-Line
#### 命令行

* `-help`
* `-makemd`
* `-search keyword`
* `[-profile=name] -list`
* `[-quiet-mode] [-profile=name] [-filter filter_with_comma ] [ -test | -onlycheck | -backup | -install ]`
* `[-quiet-mode] [-profile=name] [ -test | -onlycheck | -backup | -install ] [software_name]`

<details>
  <summary>Command-Line Details</summary>

* node index

   `node index.js`
    检查并更新所有软件
* help

    `node index.js -help`
* makemd

    `node index.js -makemd`
    根据`software`文件夹下的`js`文件创建`README.md`
* search

    `node index.js -search keyword`
    搜索并创建`js`文件
* profile

    `node index.js -profile=profile_name`
    eg: `node index.js -profile=sync`
        ==> 当`config`与`config.profile.sync`中存在相同项时，以`config.profile.sync`优先，同时数据会保存在`data-sync.json`中
* list

    `node index.js -list`
    列出`database.json`中的软件及版本
* quiet-mode

    `node index.js -quiet-mode`
    所有的提问为false或0(第一项)
* filter

    `node index.js -filter filter_with_comma`
    检查并更新匹配的软件(多个匹配条件用`,`相隔) (忽略更新间隔)
* test

    `node index.js -test`
    获取网上所有软件的最新版本号 (忽略更新间隔)
* onlycheck

    `node index.js -onlycheck`
    获取网上软件的最新版本号，并写入`database.json` (忽略更新间隔)
    效果: 忽略本地版本
* backup

    `node index.js -backup`
    获取网上软件的最新版本，并下载安装包 (忽略更新间隔)
* install

    `node index.js -install`
    安装本地最新版本
* software_name

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

1. [1clipboard](http://1clipboard.io/)
2. [7+ Taskbar Tweaker](https://rammichael.com/downloads/7tt_setup.exe?changelog)
3. [7-Zip-CLI](https://www.7-zip.org/download.html)
4. [7-Zip](https://www.7-zip.org/download.html)
5. [ACBF Viewer](https://launchpad.net/acbf/+download)
6. [Actual Title Buttons](https://www.actualtools.com/titlebuttons/) :money_with_wings:
7. [Advanced REST Client](https://github.com/advanced-rest-client/arc-electron/releases/latest)
8. [AIDA64 Engineer](https://www.aida64.co.uk/download) [Free Personal]
9. [AIDA64 Extreme](https://www.aida64.co.uk/download) [Free Personal]
10. [AIMP](http://www.aimp.ru/?do=download&os=windows)
11. [Anki](https://apps.ankiweb.net/)
12. [annie](https://github.com/iawia002/annie/releases/latest)
13. [Any Video Converter](https://www.any-video-converter.com/products/for_video_ultimate/whatnew.php) [Free Personal]
14. [AnyBurn](http://www.anyburn.com/cn/index.htm)
15. [AnyDesk](https://anydesk.com/platforms/windows) [Freemium]
16. [Ao](https://github.com/klaussinani/ao/releases/latest)
17. [APK Messenger](https://apk.ghpym.com/downloads.html)
18. [APK-Info](https://github.com/Enyby/APK-Info/releases/latest)
19. [Arctime](https://arctime.org/download.html) [Free Personal]
20. [aria2-desktop](https://github.com/wapznw/aria2desktop/releases/latest)
21. [aria2](https://github.com/aria2/aria2/releases/latest)
22. [AS SSD Benchmark](https://www.alex-is.de/PHP/fusion/downloads.php?download_id=9)
23. [Atom](https://github.com/atom/atom/releases/latest)
24. [Audacious](https://audacious-media-player.org/download)
25. [Audacity](https://biblprog.com/en/audacity/download/)
26. [AutoHotkey](https://www.autohotkey.com/download/)
27. [AutoIt](https://www.autoitscript.com/site/autoit/downloads/)
28. [Axife](https://www.axife.com/downloads.html) :money_with_wings:
29. [Babun](https://github.com/babun/babun/releases)
30. [BaiduPCS-Go](https://github.com/iikira/BaiduPCS-Go/releases/latest)
31. [balenaEtcher](https://github.com/balena-io/etcher/releases/latest)
32. [Bandisoft Bandizip](https://www.bandisoft.com/bandizip/)
33. [Bandisoft Honeyview](http://www.bandisoft.com/honeyview/)
34. [Beyond Compare](http://scootersoftware.com/download.php?zz=dl4) :money_with_wings:
35. [BiglyBT](https://github.com/BiglySoftware/BiglyBT/releases/latest)
36. [BleachBit](https://www.bleachbit.org/download/windows)
37. [Blender](https://www.blender.org/download/)
38. [Boostnote](https://github.com/BoostIO/boost-releases/releases/latest)
39. [BorderlessGaming](https://github.com/Codeusa/Borderless-Gaming/releases/latest)
40. [Brackets](https://github.com/adobe/brackets/releases/latest)
41. [Brave](https://github.com/brave/brave-browser/releases/latest)
42. [Brook](https://github.com/txthinking/brook/releases/latest)
43. [Bulk Crap Uninstaller](https://github.com/Klocman/Bulk-Crap-Uninstaller/releases/latest)
44. [Bulk Image Downloader](https://bulkimagedownloader.com/) :money_with_wings:
45. [Calibre](https://github.com/kovidgoyal/calibre/releases/latest)
46. [CCEnhancer](https://singularlabs.com/software/ccenhancer/download-ccenhancer/)
47. [CentBrowser](https://www.centbrowser.cn/history.html)
48. [CerebroApp](https://github.com/KELiON/cerebro/releases/latest)
49. [Championify](https://github.com/dustinblackman/Championify/releases/latest)
50. [CherryTree](https://github.com/giuspen/cherrytree/releases)
51. [ChromeUpdateSharp](https://csharp.love/chrome-update-tool.html)
52. [CintaNotes](http://cintanotes.com/download/) [Free Personal]
53. [CLaunch](http://hp.vector.co.jp/authors/VA018351/claunch.html)
54. [Clementine](https://github.com/clementine-player/Clementine/releases/latest)
55. [clink](https://github.com/mridgers/clink/releases/latest)
56. [cloud-torrent](https://github.com/jpillora/cloud-torrent/releases/latest)
57. [Cloudevo](https://www.evorim.com/en/cloudevo) [Free Personal] :hand:
58. [Cmder Mini](https://github.com/cmderdev/cmder/releases/latest)
59. [ComicRack](http://comicrack.cyolito.com/downloads)
60. [ComicTagger](https://github.com/davide-romanini/comictagger/releases)
61. [ConEmu](https://github.com/Maximus5/ConEmu/releases/latest)
62. [Cool Reader](https://sourceforge.net/projects/crengine/files/)
63. [CopyQ](https://github.com/hluk/CopyQ/releases/latest)
64. [CopyTranslator](https://github.com/CopyTranslator/CopyTranslator/releases/latest)
65. [cow](https://github.com/cyfdecyf/cow/releases/latest)
66. [CPUID CPU-Z](https://www.cpuid.com/softwares/cpu-z.html)
67. [CPUID HWMonitor PRO](https://www.cpuid.com/softwares/hwmonitor-pro.html) :money_with_wings:
68. [CPUID HWMonitor](https://www.cpuid.com/softwares/hwmonitor.html)
69. [CPUID Perfmonitor2](https://www.cpuid.com/softwares/perfmonitor-2.html)
70. [Crypto-Notepad](https://github.com/Crypto-Notepad/Crypto-Notepad/releases/latest)
71. [CrystalDiskInfo](https://crystalmark.info/en/download/)
72. [CrystalDiskMark](https://crystalmark.info/en/download/)
73. [Cygwin](http://mirrors.kernel.org/sourceware/cygwin/x86_64/)
74. [DB Browser for SQLite](https://github.com/sqlitebrowser/sqlitebrowser/releases/latest)
75. [DBeaver](https://dbeaver.io/download/) [Free Personal]
76. [Deluge](https://dev.deluge-torrent.org/wiki/ReleaseNotes)
77. [Detect it Easy](https://github.com/horsicq/DIE-engine/releases/latest)
78. [DevDocs](https://github.com/egoist/devdocs-desktop/releases/latest)
79. [Diffinity](http://truehumandesign.se/s_diffinity.php)
80. [Discord](https://www.filehorse.com/download-discord/download/) [Free Personal]
81. [DiskGenius](http://www.eassos.com/download.php) [Free Personal]
82. [Dism++](http://www.chuyu.me/zh-Hans/index.html)
83. [DisplayFusion](https://www.displayfusion.com/ChangeLog/) [Free Personal]
84. [Ditto](https://ditto-cp.sourceforge.io/)
85. [DocFetcher](https://sourceforge.net/projects/docfetcher/files)
86. [Dopamine](https://www.digimezzo.com/content/software/dopamine/)
87. [Dropbox](https://biblprog.com/en/dropbox/download/)
88. [Duplicate Cleaner](https://www.duplicatecleaner.com/index.html) [Free Personal]
89. [duplicati](https://github.com/duplicati/duplicati/releases)
90. [DynVPN-CLI](https://dynvpn.com/download/)
91. [DynVPN](https://dynvpn.com/download/)
92. [EagleGet](http://www.eagleget.com/download-eagleget-portable/)
93. [Ebook Reader](https://icecreamapps.com/Ebook-Reader/) [Free Personal]
94. [Elephant](https://github.com/jusu/Elephant/releases/latest)
95. [EMDB](http://www.emdb.eu/)
96. [Enigma Virtual Box unpacker](https://lifeinhex.com/tag/enigma-virtual-box/) :hand:
97. [Enigma Virtual Box](https://enigmaprotector.com/en/downloads/changelogenigmavb.html)
98. [Evernote](https://evernote.com/intl/zh-cn/download) :hand:
99. [Everything](https://www.voidtools.com/downloads/)
100. [Executor](http://www.1space.dk/executor/downloadlinks.html)
101. [ExtremeCopy](http://www.easersoft.com/product.html) :money_with_wings:
102. [f.lux](https://www.filehorse.com/download-flux/download/)
103. [FastCopy-M](https://github.com/Mapaler/FastCopy-M/releases/latest)
104. [FastCopy](https://fastcopy.jp/)
105. [FastStone Capture](http://www.faststone.org/FSCapturerDownload.htm) :money_with_wings:
106. [FastStone Image Viewer](http://www.faststone.org/FSViewerDownload.htm) [Freemium]
107. [FastStone MaxView](http://www.faststone.org/FSMaxViewDownload.htm) :money_with_wings:
108. [FastStone Photo Resizer](http://www.faststone.org/FSResizerDownload.htm) [Freemium]
109. [ffmpeg](https://ffmpeg.zeranoe.com/builds/)
110. [Fiddler Web Debugger](https://www.majorgeeks.com/mg/getmirror/fiddler,1.html)
111. [FileUploader](http://z-o-o-m.eu/down.htm)
112. [FileZilla Server](https://filezilla-project.org/download.php?type=server)
113. [FileZilla](https://filezilla-project.org/download.php?type=client)
114. [firefly-proxy](https://github.com/yinghuocho/firefly-proxy/releases/latest)
115. [Flamory](https://filehippo.com/zh/download_flamory/) [Freemium]
116. [Foobar2000](http://www.foobar2000.org/download)
117. [Fopnu](https://www.fopnu.com/download/windows64.html)
118. [Fork](https://git-fork.com/releasenoteswin)
119. [Foxit Reader](https://biblprog.com/en/foxit_reader/download/) [Freemium]
120. [freac](https://github.com/enzo1982/freac/releases/latest)
121. [Free Alarm Clock](http://freealarmclocksoftware.com/) [Free Personal]
122. [Free Download Manager](https://www.freedownloadmanager.org/download.htm)
123. [FreeCAD](https://github.com/FreeCAD/FreeCAD/releases/latest)
124. [FreeCommander](https://freecommander.com/en/downloads/) [Free Personal]
125. [FreeFileSync](https://freefilesync.org/download.php) [Free Personal] :hand:
126. [FreeGate](https://www.softpedia.com/get/Network-Tools/Misc-Networking-Tools/Freegate.shtml) :airplane:
127. [Freenet](https://github.com/freenet/fred/releases//latest)
128. [FrostWire](https://github.com/frostwire/frostwire/releases)
129. [fzf](https://github.com/junegunn/fzf-bin/releases/latest)
130. [gallery-dl](https://github.com/mikf/gallery-dl/releases/latest)
131. [Geany](https://www.geany.org/Download/Releases)
132. [gedit](http://ftp.gnome.org/pub/GNOME/binaries/win64/gedit/)
133. [GifCam](https://en.softonic.com/download/gifcam/windows/post-download)
134. [Gifsicle](https://eternallybored.org/misc/gifsicle/)
135. [GIMP](https://www.gimp.org/downloads/)
136. [Git Extensions](https://github.com/gitextensions/gitextensions/releases)
137. [Git](https://github.com/git-for-windows/git/releases/latest)
138. [GitHub](https://central.github.com/deployments/desktop/desktop/changelog.json)
139. [GitKraken](https://www.gitkraken.com/download) [Freemium]
140. [GitNote](https://github.com/zhaopengme/gitnote/releases/latest)
142. [Glarysoft/Absolute Uninstaller](https://www.glarysoft.com/absolute-uninstaller/)
143. [Glarysoft/Disk SpeedUp](https://www.glarysoft.com/disk-speedup/)
144. [Glarysoft/Glary Disk Cleaner](https://www.glarysoft.com/disk-cleaner/)
145. [Glarysoft/Glary Disk Explorer](https://www.glarysoft.com/disk-explorer/)
146. [Glarysoft/Glary Duplicate Cleaner](https://www.glarysoft.com/duplicate-cleaner/)
147. [Glarysoft/Glary Tracks Eraser](https://www.glarysoft.com/tracks-eraser/)
148. [Glarysoft/Glary Undelete](https://www.glarysoft.com/glary-undelete/)
149. [Glarysoft/Glary Utilities Pro](https://www.glarysoft.com/glary-utilities-pro/) :money_with_wings:
150. [Glarysoft/Glary Utilities](https://www.glarysoft.com/glary-utilities/)
151. [Glarysoft/Malware Hunter](https://www.glarysoft.com/malware-hunter/) :money_with_wings:
152. [Glarysoft/Quick Search](https://www.glarysoft.com/quick-search/)
153. [Glarysoft/Quick Startup](https://www.glarysoft.com/quick-startup/)
154. [Glarysoft/Registry Repair](https://www.glarysoft.com/registry-repair/)
155. [Glarysoft/Software Update Pro](https://www.glarysoft.com/software-update/) :money_with_wings:
156. [Glarysoft/Software Update](https://www.glarysoft.com/software-update/)
157. [glimpses](https://getglimpses.com/)
158. [GnuPG](https://www.gnupg.org/download/index.html)
159. [goflyway](https://github.com/coyove/goflyway/releases)
160. [golang](https://golang.org/dl/)
161. [Google Chrome](https://api.pzhacm.org/iivb/cu.json)
162. [Google Drive](https://biblprog.com/en/google_drive/download/)
163. [Gpg4win](https://gpg4win.org/download.html)
164. [GPU-Z](https://www.techpowerup.com/download/techpowerup-gpu-z/)
165. [Grammarly](https://www.filehorse.com/download-grammarly/)
166. [gVim](https://github.com/vim/vim-win32-installer/releases/latest)
167. [Hain](https://github.com/hainproject/hain/releases/latest)
168. [HandBrake](https://handbrake.fr/downloads.php)
169. [Harmony](https://github.com/vincelwt/harmony/releases/latest)
170. [HDDScan](http://hddscan.com/)
171. [HFS](http://www.rejetto.com/hfs/?f=dl)
172. [HiddeX](http://dejavu.narod.ru/hiddex.html)
173. [Hide.me](https://hide.me/en/software/windows) [Free Personal]
174. [HostsMan](https://www.majorgeeks.com/mg/getmirror/hostsman,1.html)
175. [Hot Alarm Clock](https://hotalarmclock.com/download/) [Free Personal]
176. [HotspotShield](https://www.filehorse.com/download-hotspot-shield/download/) [Free Personal]
177. [Hourglass](https://github.com/dziemborowicz/hourglass/releases/latest)
178. [HTTrack](http://www.httrack.com/page/2/en/index.html)
179. [HxD](https://mh-nexus.de/en/downloads.php?product=HxD20)
180. [ILSpy](https://github.com/icsharpcode/ILSpy/releases/latest)
181. [ImageMagick](https://imagemagick.org/script/download.php)
182. [Inkscape](https://inkscape.org/release/)
183. [Inno Setup Unpacker](https://sourceforge.net/projects/innounp/files/innounp/)
184. [Inno Setup](http://www.jrsoftware.org/isdl.php)
185. [innoextract](https://github.com/dscharrer/innoextract/releases/latest)
186. [InnoExtractor](http://www.havysoft.cl/descargar.html)
187. [Insomnia](https://github.com/getinsomnia/insomnia/releases/latest) [Free Personal]
188. [IntelliJ IDEA Community](https://data.services.jetbrains.com/products/releases?code=IIC&latest=true&type=release)
189. [IntelliJ IDEA Ultimate](https://data.services.jetbrains.com/products/releases?code=IIU&latest=true&type=release) :money_with_wings:
190. [Internet Download Accelerator](https://www.westbyte.com/ida/index.phtml?page=download) [Freemium]
191. [Internet Download Manager](http://www.internetdownloadmanager.com/) :money_with_wings: :hand:
200. [IObit/Advanced SystemCare](https://www.majorgeeks.com/mg/getmirror/advanced_systemcare,1.html)
201. [IObit/Driver Booster](https://www.majorgeeks.com/mg/getmirror/iobit_driver_booster,1.html)
202. [IObit/IObit Game Booster](https://www.majorgeeks.com/mg/getmirror/iobit_game_booster,1.html)
203. [IObit/IObit Malware Fighter](https://www.majorgeeks.com/mg/getmirror/iobit_malware_fighter,1.html)
204. [IObit/IObit Toolbox](https://www.majorgeeks.com/mg/getmirror/iobit_toolbox,1.html)
205. [IObit/IObit Undelete](https://www.majorgeeks.com/mg/getmirror/iobit_undelete,1.html)
206. [IObit/IObit Uninstaller](https://www.majorgeeks.com/mg/getmirror/iobit_uninstaller,1.html)
207. [IObit/IObit Unlocker](https://www.majorgeeks.com/mg/getmirror/iobit_unlocker,1.html)
208. [IObit/Protected Folder](https://www.majorgeeks.com/mg/getmirror/iobit_protected_folder,1.html)
209. [IObit/Random Password Generator](https://www.majorgeeks.com/mg/getmirror/random_password_generator,1.html)
210. [IObit/Smart Defrag](https://www.majorgeeks.com/mg/getmirror/iobit_smartdefrag,1.html)
211. [IObit/Start Menu 8](https://www.majorgeeks.com/mg/getmirror/start_menu_8,1.html)
212. [IObit/WinMetro](https://www.majorgeeks.com/mg/getmirror/winmetro,1.html)
213. [IP雷达](http://www.ipneed.com/main/download.html)
214. [ISx](https://github.com/lifenjoiner/ISx/releases/latest)
215. [JiJiDownForWPF](http://l.acesheep.com/bili/re.php?callback=?)
216. [Joplin](https://github.com/laurent22/joplin/releases/latest)
217. [K-Lite Codec Pack Basic](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_basic,1.html)
218. [K-Lite Codec Pack Full](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_full,1.html)
219. [K-Lite Codec Pack Standard](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_standard,1.html)
220. [K-Lite Codec Pack Update](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_update,1.html)
222. [KC Softwares/ApHeMo](https://www.kcsoftwares.com/?download) :money_with_wings:
223. [KC Softwares/Audiograil](https://www.kcsoftwares.com/?download) :money_with_wings:
224. [KC Softwares/AVIToolbox](https://www.kcsoftwares.com/?download) :money_with_wings:
225. [KC Softwares/BATExpert](https://www.kcsoftwares.com/?download)
226. [KC Softwares/dot11Expert](https://www.kcsoftwares.com/?download) :money_with_wings:
227. [KC Softwares/DUMo](https://www.kcsoftwares.com/?download) :money_with_wings:
228. [KC Softwares/HDDExpert](https://www.kcsoftwares.com/?download)
229. [KC Softwares/IDPhotoStudio](https://www.kcsoftwares.com/?download)
230. [KC Softwares/Ignition](https://www.kcsoftwares.com/?download)
231. [KC Softwares/K-ML](https://www.kcsoftwares.com/?download) :money_with_wings:
232. [KC Softwares/KCleaner](https://www.kcsoftwares.com/?download) [Free Personal]
233. [KC Softwares/KFK](https://www.kcsoftwares.com/?download)
234. [KC Softwares/MassCert](https://www.kcsoftwares.com/?download)
235. [KC Softwares/PhotoToFilm](https://www.kcsoftwares.com/?download) :money_with_wings:
236. [KC Softwares/PortExpert](https://www.kcsoftwares.com/?download)
237. [KC Softwares/RAMExpert](https://www.kcsoftwares.com/?download)
238. [KC Softwares/Startup Sentinel](https://www.kcsoftwares.com/?download)
239. [KC Softwares/SUMo](https://www.kcsoftwares.com/?download) [Free Personal]
240. [KC Softwares/Vampix](https://www.kcsoftwares.com/?download)
241. [KC Softwares/VideoInspector](https://www.kcsoftwares.com/?download)
242. [KC Softwares/Zer0](https://www.kcsoftwares.com/?download)
244. [KDE/Amarok](https://community.kde.org/Amarok/GettingStarted/Download/Windows)
245. [KDE/digiKam](https://mirrors.shu.edu.cn/kde/ftp/stable/digikam/?C=N&O=D)
246. [KDE/Falkon](https://www.falkon.org/)
247. [KDE/Kate](https://mirrors.shu.edu.cn/kde/ftp/stable/kate/?C=N&O=D)
248. [KDE/KDevelop](https://www.kdevelop.org/download)
249. [KDE/KDiff3](https://sourceforge.net/projects/kdiff3/files/)
250. [KDE/KEXI](https://mirrors.shu.edu.cn/kde/ftp/stable/kexi/win64/)
251. [KDE/KMyMoney](https://mirrors.shu.edu.cn/kde/ftp/stable/kmymoney/latest/win64/)
252. [KDE/Krita](https://krita.org/en/download/krita-desktop/)
253. [KDE/Marble](https://marble.kde.org/install.php)
254. [KDE/Umbrello](https://mirrors.shu.edu.cn/kde/ftp/stable/umbrello/latest/win64/)
255. [KeePass](https://keepass.info/download.html)
256. [KeeWeb](https://github.com/keeweb/keeweb/releases/latest)
257. [KenPlayer](http://www.chken.com/KenPlayer.html)
258. [KeyNote NF](https://github.com/dpradov/keynote-nf/releases/latest)
259. [Keypirinha](https://github.com/Keypirinha/Keypirinha/releases/latest)
260. [Kinza](https://www.kinza.jp/en/download/thankyou/windows_x64/)
261. [KiTTY](https://www.softpedia.com/get/Network-Tools/Telnet-SSH-Clients/9bis-KiTTY.shtml)
262. [KMPlayer](https://www.majorgeeks.com/mg/getmirror/kmplayer,1.html)
263. [Kodi](https://kodi.tv/download/849)
264. [Koofr](https://koofr.eu/desktop-apps/) [Free Personal]
265. [LabelPlus](https://github.com/LabelPlus/LabelPlus/releases/latest)
266. [Lantern](https://www.softpedia.com/get/Internet/Servers/Proxy-Servers/Lantern.shtml)
267. [Last.fm Scrobbler](https://www.last.fm/about/trackmymusic)
268. [launch4j](https://sourceforge.net/projects/launch4j/files/)
269. [Leanote](http://app.leanote.com/) [Free Personal]
270. [Lepton](https://github.com/hackjutsu/Lepton/releases/latest)
271. [LibreCAD](https://github.com/LibreCAD/LibreCAD/releases/latest)
272. [LibreOffice](https://www.libreoffice.org/download/download/)
273. [LICEcap](https://www.cockos.com/licecap/)
274. [Light Alloy](http://light-alloy.verona.im/download/)
275. [lightsocks](https://github.com/gwuhaolin/lightsocks/releases/latest)
276. [Listary](https://www.listary.com/download) [Free Personal]
277. [LMMS](https://github.com/LMMS/lmms/releases/latest)
278. [Locale-Emulator](https://github.com/xupefei/Locale-Emulator/releases/latest)
279. [LogMeIn Hamachi](https://www.filehorse.com/download-logmein-hamachi/download/) [Free Personal]
280. [Lua for Windows](https://github.com/rjpcomputing/luaforwindows/releases/latest)
281. [lynx](https://lynx.invisible-island.net/release/breakout/CHANGES)
282. [MadVR](http://madvr.com/)
283. [MassTube](http://www.havysoft.cl/descargar.html) [Free Personal]
284. [Maxthon](http://www.maxthon.cn/mx5/changelog/)
285. [MDB Viewer Plus](http://www.alexnolan.net/software/mdbplus.xml)
286. [MediaInfo-CLI](https://mediaarea.net/en/MediaInfo/Download/Windows)
287. [MediaInfo-GUI](https://mediaarea.net/en/MediaInfo/Download/Windows)
288. [MEGAcmd](https://raw.githubusercontent.com/meganz/MEGAcmd/master/build/megacmd/megacmd.changes)
289. [megacmd@t3rm1n4l](https://github.com/t3rm1n4l/megacmd/releases/latest)
290. [MegaDownloader](https://www.softpedia.com/get/Internet/Download-Managers/MegaDownloader.shtml)
291. [Megatools](https://megatools.megous.com/)
292. [MeGUI](https://sourceforge.net/projects/megui/files)
293. [Meld](http://meldmerge.org/)
294. [MemReduct](https://github.com/henrypp/memreduct/releases/latest)
295. [Mercurial](https://www.mercurial-scm.org/wiki/Download)
296. [Messenger](https://github.com/aluxian/Messenger-for-Desktop/releases/latest)
297. [MinGit](https://github.com/git-for-windows/git/releases/latest)
298. [MinGW-w64](https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/)
299. [MiniTool Partition Wizard](https://www.partitionwizard.com/upgrade-history.html) [Free Personal]
300. [MiniTool Power Data Recovery](https://www.minitool.com/data-recovery-software/upgrade-history.html) [Free Personal]
301. [MiniTool ShadowMaker](https://www.minitool.com/backup/upgrade-history.html) [Free Personal]
302. [MiTec EXE Explorer](http://www.mitec.cz/index.html)
303. [MiTec Task Manager DeLuxe](http://www.mitec.cz/Data/XML/data_tmxvh.xml)
304. [Mixxx](https://mixxx.org/download/)
305. [MKVToolNix](https://mkvtoolnix.download/doc/NEWS.md)
306. [MobaXterm](https://mobaxterm.mobatek.net/download-home-edition.html) [Free Personal]
307. [Motrix](https://github.com/agalwood/Motrix/releases)
309. [Mozilla/Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/notes/)
310. [Mozilla/Firefox Nightly](https://www.mozilla.org/en-US/firefox/nightly/notes/)
311. [Mozilla/Firefox](https://www.mozilla.org/en-US/firefox/latest/releasenotes/)
312. [Mozilla/SeaMonkey](https://www.seamonkey-project.org/releases/)
313. [Mozilla/Thunderbird](https://www.thunderbird.net/notes/)
314. [Mp3tag](https://www.mp3tag.de/en/download.html)
315. [MPC-BE](https://sourceforge.net/projects/mpcbe/files/)
316. [MPC-HC](https://mpc-hc.org/downloads/)
317. [MPlayer](http://oss.netfarm.it/mplayer/)
318. [mps-youtube](https://github.com/mps-youtube/mps-youtube/releases/latest)
319. [mpv](https://mpv.srsfckn.biz/)
320. [mRemoteNG](https://github.com/mRemoteNG/mRemoteNG/releases)
321. [msys2](https://www.msys2.org/)
322. [Mullvad](https://github.com/mullvad/mullvadvpn-app/releases/latest) [Free Personal]
323. [MusicBee](https://www.getmusicbee.com/downloads/) [Freemium]
324. [MusicBrainz Picard](https://picard.musicbrainz.org/downloads/)
325. [mypaint](https://github.com/mypaint/mypaint/releases/latest)
326. [NConvert](https://www.xnview.com/en/nconvert/) [Freemium]
327. [Neard](https://github.com/neard/neard/releases/latest)
329. [NeoSmart/CHMOD-Win](https://neosmart.net/Software/Changelog/4)
330. [NeoSmart/Easy USB Creator](https://neosmart.net/Software/Changelog/21) [Freemium]
331. [NeoSmart/Easy Window Switcher](https://neosmart.net/Software/Changelog/26) [Freemium]
332. [NeoSmart/EasyBCD](https://neosmart.net/Software/Changelog/1) [Freemium]
333. [NeoSmart/iReboot](https://neosmart.net/Software/Changelog/11) [Freemium]
334. [NeoSmart/LastPass to 1Password Conversion Utility](https://neosmart.net/Software/Changelog/28)
335. [NeoSmart/ln-win](https://neosmart.net/Software/Changelog/16)
336. [NeoSmart/NST Downloader](https://neosmart.net/Software/Changelog/15)
337. [NeoSmart/RunInBash](https://neosmart.net/Software/Changelog/27)
338. [NeoSmart/TimeTweaker](https://neosmart.net/Software/Changelog/5)
339. [NeoSmart/ToolTipFixer](https://neosmart.net/Software/Changelog/10)
340. [NeoSmart/TweakUI](https://neosmart.net/Software/Changelog/6)
341. [NeoSmart/uptime](https://neosmart.net/Software/Changelog/29)
342. [NeoSmart/Windows 10 Rollback Utility](https://neosmart.net/Software/Changelog/23) :hand:
343. [NeoSmart/Windows OEM Product Key Tool](https://neosmart.net/Software/Changelog/22)
344. [NetBeans](https://netbeans.apache.org/download/index.html)
345. [Nextcloud](https://nextcloud.com/install/)
346. [Nimbus Note](https://nimbusweb.me/nimbus-note-windows.php) [Free Personal]
348. [NirSoft/Access PassView](https://www.nirsoft.net/utils/accesspv.html)
349. [NirSoft/ActiveX Compatibility Manager](https://www.nirsoft.net/utils/acm.html)
350. [NirSoft/ActiveXHelper](https://www.nirsoft.net/utils/axhelper.html)
351. [NirSoft/AdapterWatch](https://www.nirsoft.net/utils/awatch.html)
352. [NirSoft/AddrView](https://www.nirsoft.net/utils/addrview.html)
353. [NirSoft/AdvancedRun](https://www.nirsoft.net/utils/advanced_run.html)
354. [NirSoft/AllThreadsView](https://www.nirsoft.net/utils/all_threads_view.html)
355. [NirSoft/AlternateStreamView](https://www.nirsoft.net/utils/alternate_data_streams.html)
356. [NirSoft/AltStreamDump](https://www.nirsoft.net/utils/alternate_stream_dump.html)
357. [NirSoft/AppAudioConfig](https://www.nirsoft.net/utils/app_audio_config.html)
358. [NirSoft/AppCompatibilityView](https://www.nirsoft.net/utils/app_compatibility_view.html)
359. [NirSoft/AppCrashView](https://www.nirsoft.net/utils/app_crash_view.html)
360. [NirSoft/AppNetworkCounter](https://www.nirsoft.net/utils/app_network_counter.html)
361. [NirSoft/AppReadWriteCounter](https://www.nirsoft.net/utils/app_read_write_counter.html)
362. [NirSoft/AsterWin IE](https://www.nirsoft.net/utils/asterie.html)
363. [NirSoft/AtNow](https://www.nirsoft.net/utils/atnow.html)
364. [NirSoft/BatteryInfoView](https://www.nirsoft.net/utils/battery_information_view.html)
365. [NirSoft/BlueScreenView](https://www.nirsoft.net/utils/blue_screen_view.html)
366. [NirSoft/BluetoothCL](https://www.nirsoft.net/utils/bluetoothcl.html)
367. [NirSoft/BluetoothLogView](https://www.nirsoft.net/utils/bluetooth_log_view.html)
368. [NirSoft/BluetoothView](https://www.nirsoft.net/utils/bluetooth_viewer.html)
369. [NirSoft/BrowserAddonsView](https://www.nirsoft.net/utils/web_browser_addons_view.html)
370. [NirSoft/BrowsingHistoryView](https://www.nirsoft.net/utils/browsing_history_view.html)
371. [NirSoft/BulkFileChanger](https://www.nirsoft.net/utils/bulk_file_changer.html)
372. [NirSoft/BulletsPassView](https://www.nirsoft.net/utils/bullets_password_view.html)
373. [NirSoft/ChromeCacheView](https://www.nirsoft.net/utils/chrome_cache_view.html)
374. [NirSoft/ChromeCookiesView](https://www.nirsoft.net/utils/chrome_cookies_view.html)
375. [NirSoft/ChromeHistoryView](https://www.nirsoft.net/utils/chrome_history_view.html)
376. [NirSoft/ChromePass](https://www.nirsoft.net/utils/chromepass.html)
377. [NirSoft/CleanAfterMe](https://www.nirsoft.net/utils/clean_after_me.html)
378. [NirSoft/Clipboardic](https://www.nirsoft.net/utils/clipboardic.html)
379. [NirSoft/Content Advisor Password Remover](https://www.nirsoft.net/utils/conadvpass.html)
380. [NirSoft/ControlMyMonitor](https://www.nirsoft.net/utils/control_my_monitor.html)
381. [NirSoft/CountryTraceRoute](https://www.nirsoft.net/utils/country_traceroute.html)
382. [NirSoft/CredentialsFileView](https://www.nirsoft.net/utils/credentials_file_view.html)
383. [NirSoft/CSVFileView](https://www.nirsoft.net/utils/csv_file_view.html)
384. [NirSoft/CurrPorts](https://www.nirsoft.net/utils/cports.html)
385. [NirSoft/CurrProcess](https://www.nirsoft.net/utils/cprocess.html)
386. [NirSoft/CustomExplorerToolbar](https://www.nirsoft.net/utils/custom_explorer_toolbar.html)
387. [NirSoft/CustomizeIE](https://www.nirsoft.net/utils/ctie.html)
388. [NirSoft/DataProtectionDecryptor](https://www.nirsoft.net/utils/dpapi_data_decryptor.html)
389. [NirSoft/DeviceIOView](https://www.nirsoft.net/utils/device_io_view.html)
390. [NirSoft/DevManView](https://www.nirsoft.net/utils/device_manager_view.html)
391. [NirSoft/Dialupass](https://www.nirsoft.net/utils/dialupass.html)
392. [NirSoft/DiskCountersView](https://www.nirsoft.net/utils/disk_counters_view.html)
393. [NirSoft/DiskSmartView](https://www.nirsoft.net/utils/disk_smart_view.html)
394. [NirSoft/DLL Export Viewer](https://www.nirsoft.net/utils/dll_export_viewer.html)
395. [NirSoft/DNSDataView](https://www.nirsoft.net/utils/dns_records_viewer.html)
396. [NirSoft/DNSQuerySniffer](https://www.nirsoft.net/utils/dns_query_sniffer.html)
397. [NirSoft/DomainHostingView](https://www.nirsoft.net/utils/domain_hosting_view.html)
398. [NirSoft/DotNetResourcesExtract](https://www.nirsoft.net/utils/dot_net_resources_extract.html)
399. [NirSoft/DownTester](https://www.nirsoft.net/utils/download_speed_tester.html)
400. [NirSoft/DriveLetterView](https://www.nirsoft.net/utils/drive_letter_view.html)
401. [NirSoft/DriverView](https://www.nirsoft.net/utils/driverview.html)
402. [NirSoft/DumpEDID](https://www.nirsoft.net/utils/dump_edid.html)
403. [NirSoft/EdgeCookiesView](https://www.nirsoft.net/utils/edge_cookies_view.html)
404. [NirSoft/EncryptedRegView](https://www.nirsoft.net/utils/encrypted_registry_view.html)
405. [NirSoft/Enterprise Manager PassView](https://www.nirsoft.net/utils/empv.html)
406. [NirSoft/ESEDatabaseView](https://www.nirsoft.net/utils/ese_database_view.html)
407. [NirSoft/EventLogChannelsView](https://www.nirsoft.net/utils/event_log_channels_view.html)
408. [NirSoft/EventLogSourcesView](https://www.nirsoft.net/utils/event_log_sources_view.html)
409. [NirSoft/ExecutedProgramsList](https://www.nirsoft.net/utils/executed_programs_list.html)
410. [NirSoft/ExeInfo](https://www.nirsoft.net/utils/exeinfo.html)
411. [NirSoft/ExifDataView](https://www.nirsoft.net/utils/exif_data_view.html)
412. [NirSoft/FastResolver](https://www.nirsoft.net/utils/fastresolver.html)
413. [NirSoft/FavoritesView](https://www.nirsoft.net/utils/faview.html)
414. [NirSoft/FBCacheView](https://www.nirsoft.net/utils/facebook_cache_viewer.html)
415. [NirSoft/FileAccessErrorView](https://www.nirsoft.net/utils/file_access_error_view.html)
416. [NirSoft/FileActivityWatch](https://www.nirsoft.net/utils/file_activity_watch.html)
417. [NirSoft/FileTypesMan](https://www.nirsoft.net/utils/file_types_manager.html)
418. [NirSoft/FirefoxDownloadsView](https://www.nirsoft.net/utils/firefox_downloads_view.html)
419. [NirSoft/FlashCookiesView](https://www.nirsoft.net/utils/flash_cookies_view.html)
420. [NirSoft/FolderChangesView](https://www.nirsoft.net/utils/folder_changes_view.html)
421. [NirSoft/FoldersReport](https://www.nirsoft.net/utils/folrep.html)
422. [NirSoft/FolderTimeUpdate](https://www.nirsoft.net/utils/folder_time_update.html)
423. [NirSoft/FullEventLogView](https://www.nirsoft.net/utils/full_event_log_view.html)
424. [NirSoft/GACView](https://www.nirsoft.net/dot_net_tools/gac_viewer.html)
425. [NirSoft/GDIView](https://www.nirsoft.net/utils/gdi_handles.html)
426. [NirSoft/GUIPropView](https://www.nirsoft.net/utils/gui_prop_view.html)
427. [NirSoft/HandleCountersView](https://www.nirsoft.net/utils/handle_counters_view.html)
428. [NirSoft/HashMyFiles](https://www.nirsoft.net/utils/hash_my_files.html)
429. [NirSoft/HeapMemView](https://www.nirsoft.net/utils/heap_memory_view.html)
430. [NirSoft/HostedNetworkStarter](https://www.nirsoft.net/utils/wifi_hotspot_starter.html)
431. [NirSoft/HotKeysList](https://www.nirsoft.net/utils/hot_keys_list.html)
432. [NirSoft/HTMLAsText](https://www.nirsoft.net/utils/htmlastext.html)
433. [NirSoft/HtmlDocEdit](https://www.nirsoft.net/utils/html_doc_edit.html)
434. [NirSoft/HTTPNetworkSniffer](https://www.nirsoft.net/utils/http_network_sniffer.html)
435. [NirSoft/IconsExtract](https://www.nirsoft.net/utils/iconsext.html)
436. [NirSoft/IE PassView](https://www.nirsoft.net/utils/internet_explorer_password.html)
437. [NirSoft/IECacheView](https://www.nirsoft.net/utils/ie_cache_viewer.html)
438. [NirSoft/IECompo](https://www.nirsoft.net/utils/iecompo.html)
439. [NirSoft/IECookiesView](https://www.nirsoft.net/utils/iecookies.html)
440. [NirSoft/IEDesignMode](https://www.nirsoft.net/utils/ie_design_mode.html)
441. [NirSoft/IEHistoryView](https://www.nirsoft.net/utils/iehv.html)
442. [NirSoft/ImageCacheViewer](https://www.nirsoft.net/utils/image_cache_viewer.html)
443. [NirSoft/InjectedDLL](https://www.nirsoft.net/utils/injected_dll.html)
444. [NirSoft/InsideClipboard](https://www.nirsoft.net/utils/inside_clipboard.html)
445. [NirSoft/InstalledCodec](https://www.nirsoft.net/utils/installed_codec.html)
446. [NirSoft/InstalledDriversList](https://www.nirsoft.net/utils/installed_drivers_list.html)
447. [NirSoft/InstalledPackagesView](https://www.nirsoft.net/utils/installed_packages_view.html)
448. [NirSoft/IPInfoOffline](https://www.nirsoft.net/utils/ip_country_info_offline.html)
449. [NirSoft/IPNetInfo](https://www.nirsoft.net/utils/ipnetinfo.html)
450. [NirSoft/JavaScript Animator Express](https://www.nirsoft.net/utils/jsae.html)
451. [NirSoft/JumpListsView](https://www.nirsoft.net/utils/jump_lists_view.html)
452. [NirSoft/KeyboardStateView](https://www.nirsoft.net/utils/keyboard_state_view.html)
453. [NirSoft/LastActivityView](https://www.nirsoft.net/utils/computer_activity_view.html)
454. [NirSoft/LiveContactsView](https://www.nirsoft.net/utils/live_messenger_contacts.html)
455. [NirSoft/LiveTcpUdpWatch](https://www.nirsoft.net/utils/live_tcp_udp_watch.html)
456. [NirSoft/LoadedDllsView](https://www.nirsoft.net/utils/loaded_dll_view.html)
457. [NirSoft/LSASecretsDump](https://www.nirsoft.net/utils/lsa_secrets_dump.html)
458. [NirSoft/LSASecretsView](https://www.nirsoft.net/utils/lsa_secrets_view.html)
459. [NirSoft/MACAddressView](https://www.nirsoft.net/utils/mac_address_lookup_find.html)
460. [NirSoft/Mail PassView](https://www.nirsoft.net/utils/mailpv.html)
461. [NirSoft/MessenPass](https://www.nirsoft.net/utils/mspass.html)
462. [NirSoft/MetarWeather](https://www.nirsoft.net/utils/mweather.html)
463. [NirSoft/MIMEView](https://www.nirsoft.net/utils/mimeview.html)
464. [NirSoft/MMCSnapInsView](https://www.nirsoft.net/utils/mmc_snapins_view.html)
465. [NirSoft/MonitorInfoView](https://www.nirsoft.net/utils/monitor_info_view.html)
466. [NirSoft/MUICacheView](https://www.nirsoft.net/utils/muicache_view.html)
467. [NirSoft/MultiMonitorTool](https://www.nirsoft.net/utils/multi_monitor_tool.html)
468. [NirSoft/MyEventViewer](https://www.nirsoft.net/utils/my_event_viewer.html)
469. [NirSoft/MyLastSearch](https://www.nirsoft.net/utils/my_last_search.html)
470. [NirSoft/MZCacheView](https://www.nirsoft.net/utils/mozilla_cache_viewer.html)
471. [NirSoft/MZCookiesView](https://www.nirsoft.net/utils/mzcv.html)
472. [NirSoft/MZHistoryView](https://www.nirsoft.net/utils/mozilla_history_view.html)
473. [NirSoft/NetBScanner](https://www.nirsoft.net/utils/netbios_scanner.html)
474. [NirSoft/NetConnectChoose](https://www.nirsoft.net/utils/net_connect_choose.html)
475. [NirSoft/NetResView](https://www.nirsoft.net/utils/netresview.html)
476. [NirSoft/NetRouteView](https://www.nirsoft.net/utils/network_route_view.html)
477. [NirSoft/Network Password Recovery](https://www.nirsoft.net/utils/network_password_recovery.html)
478. [NirSoft/NetworkConnectLog](https://www.nirsoft.net/utils/network_connect_log.html)
479. [NirSoft/NetworkCountersWatch](https://www.nirsoft.net/utils/network_counters_watch.html)
480. [NirSoft/NetworkInterfacesView](https://www.nirsoft.net/utils/network_interfaces.html)
481. [NirSoft/NetworkLatencyView](https://www.nirsoft.net/utils/network_latency_view.html)
482. [NirSoft/NetworkOpenedFiles](https://www.nirsoft.net/utils/network_opened_files.html)
483. [NirSoft/NetworkTrafficView](https://www.nirsoft.net/utils/network_traffic_view.html)
484. [NirSoft/NetworkUsageView](https://www.nirsoft.net/utils/network_usage_view.html)
485. [NirSoft/NirCmd-CLI](https://www.nirsoft.net/utils/nircmd.html)
486. [NirSoft/NirCmd](https://www.nirsoft.net/utils/nircmd.html)
487. [NirSoft/NirExt](https://www.nirsoft.net/utils/nirext.html)
488. [NirSoft/NK2Edit](https://www.nirsoft.net/utils/outlook_nk2_edit.html)
489. [NirSoft/NTFSLinksView](https://www.nirsoft.net/utils/ntfs_links_view.html)
490. [NirSoft/OfficeIns](https://www.nirsoft.net/utils/officeins.html)
491. [NirSoft/OfflineRegistryFinder](https://www.nirsoft.net/utils/offline_registry_finder.html)
492. [NirSoft/OfflineRegistryView](https://www.nirsoft.net/utils/offline_registry_view.html)
493. [NirSoft/OpenedFilesView](https://www.nirsoft.net/utils/opened_files_view.html)
494. [NirSoft/OpenSaveFilesView](https://www.nirsoft.net/utils/open_save_files_view.html)
495. [NirSoft/OpenWithView](https://www.nirsoft.net/utils/open_with_view.html)
496. [NirSoft/OperaCacheView](https://www.nirsoft.net/utils/opera_cache_view.html)
497. [NirSoft/OperaPassView](https://www.nirsoft.net/utils/opera_password_recovery.html)
498. [NirSoft/OutlookAddressBookView](https://www.nirsoft.net/utils/outlook_address_book_view.html)
499. [NirSoft/OutlookAttachView](https://www.nirsoft.net/utils/outlook_attachment.html)
500. [NirSoft/OutlookStatView](https://www.nirsoft.net/utils/outlook_statistics.html)
501. [NirSoft/Password Security Scanner](https://www.nirsoft.net/utils/password_security_scanner.html)
502. [NirSoft/PasswordFox](https://www.nirsoft.net/utils/passwordfox.html)
503. [NirSoft/pcANYWHERE Hosts Scanner](https://www.nirsoft.net/utils/pcanyscan.html)
504. [NirSoft/PCAnywhere PassView](https://www.nirsoft.net/utils/pcanypass.html)
505. [NirSoft/PingInfoView](https://www.nirsoft.net/utils/multiple_ping_tool.html)
506. [NirSoft/PreviousFilesRecovery](https://www.nirsoft.net/utils/previous_files_recovery.html)
507. [NirSoft/ProcessActivityView](https://www.nirsoft.net/utils/process_activity_view.html)
508. [NirSoft/ProcessTCPSummary](https://www.nirsoft.net/utils/process_tcp_summary.html)
509. [NirSoft/ProcessThreadsView](https://www.nirsoft.net/utils/process_threads_view.html)
510. [NirSoft/ProduKey](https://www.nirsoft.net/utils/product_cd_key_viewer.html)
511. [NirSoft/Protected Storage PassView](https://www.nirsoft.net/utils/pspv.html)
512. [NirSoft/PstPassword](https://www.nirsoft.net/utils/pst_password.html)
513. [NirSoft/QuickSetDNS](https://www.nirsoft.net/utils/quick_set_dns.html)
514. [NirSoft/RecentFilesView](https://www.nirsoft.net/utils/recent_files_view.html)
515. [NirSoft/RegDllView](https://www.nirsoft.net/utils/registered_dll_view.html)
516. [NirSoft/RegFileExport](https://www.nirsoft.net/utils/registry_file_offline_export.html)
517. [NirSoft/RegFromApp](https://www.nirsoft.net/utils/reg_file_from_application.html)
518. [NirSoft/RegistryChangesView](https://www.nirsoft.net/utils/registry_changes_view.html)
519. [NirSoft/RegScanner](https://www.nirsoft.net/utils/regscanner.html)
520. [NirSoft/Remote Desktop PassView](https://www.nirsoft.net/utils/remote_desktop_password.html)
521. [NirSoft/ResourcesExtract](https://www.nirsoft.net/utils/resources_extract.html)
522. [NirSoft/RouterPassView](https://www.nirsoft.net/utils/router_password_recovery.html)
523. [NirSoft/RTMPDumpHelper](https://www.nirsoft.net/utils/rtmp_dump_helper.html)
524. [NirSoft/RunAsDate](https://www.nirsoft.net/utils/run_as_date.html)
525. [NirSoft/RunFromProcess](https://www.nirsoft.net/utils/run_from_process.html)
526. [NirSoft/SafariCacheView](https://www.nirsoft.net/utils/safari_cache_view.html)
527. [NirSoft/SafariHistoryView](https://www.nirsoft.net/utils/safari_history_view.html)
528. [NirSoft/SearchFilterView](https://www.nirsoft.net/utils/search_filter_view.html)
529. [NirSoft/SearchMyFiles](https://www.nirsoft.net/utils/search_my_files.html)
530. [NirSoft/SecuritySoftView](https://www.nirsoft.net/utils/security_software_view.html)
531. [NirSoft/SeqDownload](https://www.nirsoft.net/utils/seqdownload.html)
532. [NirSoft/ServiWin](https://www.nirsoft.net/utils/serviwin.html)
533. [NirSoft/ShadowCopyView](https://www.nirsoft.net/utils/shadow_copy_view.html)
534. [NirSoft/ShellBagsView](https://www.nirsoft.net/utils/shell_bags_view.html)
535. [NirSoft/ShellExView](https://www.nirsoft.net/utils/shexview.html)
536. [NirSoft/ShellMenuNew](https://www.nirsoft.net/utils/shell_menu_new.html)
537. [NirSoft/ShellMenuView](https://www.nirsoft.net/utils/shell_menu_view.html)
538. [NirSoft/ShortcutsMan](https://www.nirsoft.net/utils/shman.html)
539. [NirSoft/SimpleProgramDebugger](https://www.nirsoft.net/utils/simple_program_debugger.html)
540. [NirSoft/SimpleWMIView](https://www.nirsoft.net/utils/simple_wmi_view.html)
541. [NirSoft/SiteShoter](https://www.nirsoft.net/utils/web_site_screenshot.html)
542. [NirSoft/SkypeContactsView](https://www.nirsoft.net/utils/skype_contacts_view.html)
543. [NirSoft/SkypeLogView](https://www.nirsoft.net/utils/skype_log_view.html)
544. [NirSoft/SmartSniff](https://www.nirsoft.net/utils/smsniff.html)
545. [NirSoft/SniffPass](https://www.nirsoft.net/utils/password_sniffer.html)
546. [NirSoft/SocketSniff](https://www.nirsoft.net/utils/socket_sniffer.html)
547. [NirSoft/SoundVolumeView](https://www.nirsoft.net/utils/sound_volume_view.html)
548. [NirSoft/SpecialFoldersView](https://www.nirsoft.net/utils/special_folders_view.html)
549. [NirSoft/StartBlueScreen](https://www.nirsoft.net/utils/start_blue_screen.html)
550. [NirSoft/SysExporter](https://www.nirsoft.net/utils/sysexp.html)
551. [NirSoft/TableTextCompare](https://www.nirsoft.net/utils/csv_file_comparison.html)
552. [NirSoft/TagsReport](https://www.nirsoft.net/utils/tagsrep.html)
553. [NirSoft/TaskSchedulerView](https://www.nirsoft.net/utils/task_scheduler_view.html)
554. [NirSoft/TcpLogView](https://www.nirsoft.net/utils/tcp_log_view.html)
555. [NirSoft/TimeZonesView](https://www.nirsoft.net/utils/time_zones_view.html)
556. [NirSoft/TurnedOnTimesView](https://www.nirsoft.net/utils/computer_turned_on_times.html)
557. [NirSoft/TurnFlash](https://www.nirsoft.net/utils/tflash.html)
558. [NirSoft/TurnFlash2](https://www.nirsoft.net/utils/tflash2.html)
559. [NirSoft/UninstallView](https://www.nirsoft.net/utils/uninstall_view.html)
560. [NirSoft/URLProtocolView](https://www.nirsoft.net/utils/url_protocol_view.html)
561. [NirSoft/URLStringGrabber](https://www.nirsoft.net/utils/url_string_grabber.html)
562. [NirSoft/USBDeview](https://www.nirsoft.net/utils/usb_devices_view.html)
563. [NirSoft/USBLogView](https://www.nirsoft.net/utils/usb_log_view.html)
564. [NirSoft/UserAssistView](https://www.nirsoft.net/utils/userassist_view.html)
565. [NirSoft/UserProfilesView](https://www.nirsoft.net/utils/user_profiles_view.html)
566. [NirSoft/VaultPasswordView](https://www.nirsoft.net/utils/vault_password_view.html)
567. [NirSoft/VideoCacheView](https://www.nirsoft.net/utils/video_cache_view.html)
568. [NirSoft/VNCPassView](https://www.nirsoft.net/utils/vnc_password.html)
569. [NirSoft/Volumouse](https://www.nirsoft.net/utils/volumouse.html)
570. [NirSoft/WakeMeOnLan](https://www.nirsoft.net/utils/wake_on_lan.html)
571. [NirSoft/WebBrowserPassView](https://www.nirsoft.net/utils/web_browser_password.html)
572. [NirSoft/WebCacheImageInfo](https://www.nirsoft.net/utils/web_cache_image_info.html)
573. [NirSoft/WebCamImageSave](https://www.nirsoft.net/utils/web_cam_image_capture.html)
574. [NirSoft/WebCookiesSniffer](https://www.nirsoft.net/utils/web_cookies_sniffer.html)
575. [NirSoft/WebSiteSniffer](https://www.nirsoft.net/utils/web_site_sniffer.html)
576. [NirSoft/WebVideoCap](https://www.nirsoft.net/utils/web_video_capture.html)
577. [NirSoft/WhatInStartup](https://www.nirsoft.net/utils/what_run_in_startup.html)
578. [NirSoft/WhatIsHang](https://www.nirsoft.net/utils/what_is_hang.html)
579. [NirSoft/WhoisCL](https://www.nirsoft.net/utils/whoiscl.html)
580. [NirSoft/WhoIsConnectedSniffer](https://www.nirsoft.net/utils/who_is_connected_sniffer.html)
581. [NirSoft/WhoisThisDomain](https://www.nirsoft.net/utils/whois_this_domain.html)
582. [NirSoft/WhosIP](https://www.nirsoft.net/utils/whosip.html)
583. [NirSoft/WifiChannelMonitor](https://www.nirsoft.net/utils/wifi_channel_monitor.html)
584. [NirSoft/WifiHistoryView](https://www.nirsoft.net/utils/wifi_history_view.html)
585. [NirSoft/WifiInfoView](https://www.nirsoft.net/utils/wifi_information_view.html)
586. [NirSoft/Win9x PassView](https://www.nirsoft.net/utils/win9xpv.html)
587. [NirSoft/WinCrashReport](https://www.nirsoft.net/utils/application_crash_report.html)
588. [NirSoft/WinExplorer](https://www.nirsoft.net/utils/winexp.html)
589. [NirSoft/WinFontsView](https://www.nirsoft.net/utils/windows_fonts_viewer.html)
590. [NirSoft/WinLister](https://www.nirsoft.net/utils/winlister.html)
591. [NirSoft/WinLogOnView](https://www.nirsoft.net/utils/windows_log_on_times_view.html)
592. [NirSoft/WinPrefetchView](https://www.nirsoft.net/utils/win_prefetch_view.html)
593. [NirSoft/WinsockServicesView](https://www.nirsoft.net/utils/winsock_service_providers.html)
594. [NirSoft/WinUpdatesList](https://www.nirsoft.net/utils/wul.html)
595. [NirSoft/Wireless Network Watcher](https://www.nirsoft.net/utils/wireless_network_watcher.html)
596. [NirSoft/WirelessConnectionInfo](https://www.nirsoft.net/utils/wireless_connection_information.html)
597. [NirSoft/WirelessKeyView](https://www.nirsoft.net/utils/wireless_key.html)
598. [NirSoft/WirelessNetConsole](https://www.nirsoft.net/utils/wireless_net_console.html)
599. [NirSoft/WirelessNetView](https://www.nirsoft.net/utils/wireless_network_view.html)
600. [NirSoft/ZipInstaller](https://www.nirsoft.net/utils/zipinst.html)
601. [NixNote](https://sourceforge.net/projects/nevernote/files)
602. [Nodejs-LTS](https://nodejs.org/en/download/)
603. [Nodejs](https://nodejs.org/en/download/current/)
604. [notepad++](https://notepad-plus-plus.org/download/)
605. [notepad2-mod](https://github.com/XhmikosR/notepad2-mod/releases/latest)
606. [Notezilla](https://www.conceptworld.com/Notezilla/Portable) :money_with_wings:
607. [Notion](https://www.notion.so/desktop) [Free Personal]
609. [NTWind/Alt-Tab Terminator](https://www.ntwind.com/software/alttabter.html)
610. [NTWind/Bad Application](https://www.ntwind.com/software/utilities/badapp.html)
611. [NTWind/Close All](https://www.ntwind.com/software/utilities/close-all.html)
612. [NTWind/Hidden Start](https://www.ntwind.com/software/hstart.html) :money_with_wings:
613. [NTWind/Sticky Previews](https://www.ntwind.com/software/sticky-previews.html) :money_with_wings:
614. [NTWind/Visual Subst](https://www.ntwind.com/software/utilities/visual-subst.html)
615. [NTWind/WinCam](https://www.ntwind.com/software/wincam.html) :money_with_wings:
616. [NTWind/WindowSpace](https://www.ntwind.com/software/windowspace.html) :money_with_wings:
617. [NTWind/WinSnap](https://www.ntwind.com/software/winsnap.html) :money_with_wings:
618. [odrive Sync](https://forum.odrive.com/c/release-notes) [Free Personal]
619. [ODrive](https://github.com/liberodark/ODrive/releases/latest)
620. [Office Tool Plus](https://mirrors.yuntu.ca/office-tool/)
621. [OnTopReplica](https://github.com/LorenzCK/OnTopReplica/releases/latest)
622. [Open Broadcaster Software](https://obsproject.com/download)
623. [OpenShot](https://github.com/OpenShot/openshot-qt/releases/latest)
624. [OpenVPN](https://openvpn.net/community-downloads/) :airplane:
625. [Opera](https://biblprog.com/en/opera/download/)
626. [Outlook Google Calendar Sync](https://github.com/phw198/OutlookGoogleCalendarSync/releases/latest)
627. [Paint.NET](https://www.dotpdn.com/downloads/pdn.html)
628. [Pale Moon](https://www.palemoon.org/)
629. [PasteEx](https://github.com/huiyadanli/PasteEx/releases/latest)
630. [PeaZip](https://github.com/giorgiotani/PeaZip/releases/latest)
631. [Persepolis Download Manager](https://github.com/persepolisdm/persepolis/releases/latest)
632. [pestudio](https://www.winitor.com/binaries.html)
633. [PicGo](https://github.com/Molunerfinn/PicGo/releases/latest)
634. [PicoTorrent](https://github.com/picotorrent/picotorrent/releases/latest)
635. [PicPick](https://picpick.app/zh/download) [Freemium]
636. [Pidgin](https://www.pidgin.im/)
637. [Piggydb](https://sourceforge.net/projects/piggydb/files/)
638. [PiP-Tool](https://github.com/LionelJouin/PiP-Tool/releases/latest)
640. [Piriform/CCleaner](https://www.ccleaner.com/ccleaner/download) [Free Personal]
641. [Piriform/Defraggler](https://www.ccleaner.com/defraggler/download) [Freemium]
642. [Piriform/Recuva](https://www.ccleaner.com/recuva/download) [Free Personal]
643. [Piriform/Speccy](https://www.ccleaner.com/speccy/download) [Free Personal]
644. [PixivUtil2](https://github.com/Nandaka/PixivUtil2/releases/latest)
645. [PlayTime](http://www.dcmembers.com/skwire/download/playtime/)
646. [PlexMediaPlayer](https://plex.tv/api/downloads/3.json)
647. [PlexMediaServer](https://plex.tv/api/downloads/1.json)
648. [PNotes](https://pnotes.sourceforge.io/index.php?page=5)
649. [PNotes.NET](https://pnotes.sourceforge.io/index.php?page=5)
650. [Postman](https://dl.pstmn.io/api/version/notes?channel=stable) [Free Personal]
651. [PotPlayer](https://potplayer.daum.net/)
652. [Private Tunnel](https://www.privatetunnel.com/apps/) [Free Personal]
653. [PrivaZer](https://privazer.com/download.php)
654. [ProtonVPN](https://protonvpn.com/download/win-update.json) [Free Personal] :airplane:
655. [Proxifier](https://www.proxifier.com/) :money_with_wings:
656. [Psiphon](https://www.filehorse.com/download-psiphon/download/)
657. [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
658. [PyScripter](https://sourceforge.net/projects/pyscripter/files/)
659. [Python](https://www.python.org/downloads/windows/)
660. [Python2](https://www.python.org/downloads/windows/)
661. [Q-Dir](http://www.softwareok.com/?seite=Freeware/Q-Dir/History)
662. [qBittorrent](https://www.qbittorrent.org/download.php)
663. [QOwnNotes](https://www.qownnotes.org/installation)
664. [QQ](https://im.qq.com/pcqq/) :hand:
665. [QTranslate](https://quest-app.appspot.com/)
666. [Quick Access Popup](https://www.quickaccesspopup.com/)
667. [QuickLook](https://github.com/QL-Win/QuickLook/releases/latest)
668. [RaiDrive](https://www.raidrive.com/download/) :hand:
669. [Rapid Environment Editor](https://www.rapidee.com/en/download)
670. [Rclone](https://github.com/ncw/rclone/releases/latest)
671. [RecentX](https://www.conceptworld.com/RecentX/RevisionHistory) :money_with_wings:
672. [Registry Workshop](http://www.torchsoft.com/en/download.html) :money_with_wings:
673. [RegSeeker](http://www.hoverdesk.net/download.php) [Freemium]
674. [ReMouse](https://www.remouse.com/downloads.html) [Free Personal]
675. [Resonic](https://resonic.at/download)
676. [Resource Hacker](http://www.angusj.com/resourcehacker/)
677. [Resource Tuner](http://www.restuner.com/news-history.htm) :money_with_wings:
678. [Right Click Enhancer](https://rbsoft.org/downloads/right-click-enhancer/rce-changelog.html) [Free Personal]
679. [Rocket.Chat](https://github.com/RocketChat/Rocket.Chat.Electron/releases/latest)
680. [Rufus](https://rufus.ie/en_IE.html)
681. [RunAny](https://github.com/hui-Zz/RunAny/releases/latest)
682. [ScreenToGif](https://github.com/NickeManarin/ScreenToGif/releases/latest)
683. [shadowsocks-magic](https://github.com/ihciah/go-shadowsocks-magic/releases/latest)
684. [shadowsocks-qt5](https://github.com/shadowsocks/shadowsocks-qt5/releases/latest) :hand:
685. [shadowsocks](https://github.com/shadowsocks/shadowsocks-windows/releases)
686. [shadowsocksr-csharp](https://github.com/shadowsocksrr/shadowsocksr-csharp/releases)
687. [shadowsocksr-electron](https://github.com/erguotou520/electron-ssr/releases/latest)
688. [Shareaza](http://shareaza.sourceforge.net/?id=download)
689. [ShareX](https://github.com/ShareX/ShareX/releases/latest)
690. [Shellbag Analyzer & Cleaner](https://privazer.com/download-shellbag-analyzer-shellbag-cleaner.php)
691. [Shuax-FireDoge](https://shuax.com/project/firedoge/)
692. [Shuax-GreenChrome](https://shuax.com/project/greenchrome/)
693. [Shuax-MouseInc](https://shuax.com/project/mouseinc/)
694. [Simplenote](https://github.com/Automattic/simplenote-electron/releases/latest)
695. [Skype](http://skype.gmw.cn/down/skype-for-windows-desktop.html)
696. [Slack](https://slack.com/downloads/windows) [Free Personal]
697. [SmartGit](https://www.syntevo.com/smartgit/download/) [Freemium]
698. [SMath Studio](https://en.smath.com/view/SMathStudio/summary)
699. [SMPlayer](https://sourceforge.net/projects/smplayer/files/SMPlayer/)
700. [Snipaste](https://www.snipaste.com/download.html)
701. [SoftEtherVPN](https://github.com/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest) :hand:
702. [SoLoud](http://sol.gfxile.net/soloud/downloads.html)
704. [Sordum/AskAdmin](https://www.sordum.org/7941/)
705. [Sordum/Backup Start Menu Layout](https://www.sordum.org/10997/)
706. [Sordum/BlueLife Hosts Editor](https://www.sordum.org/8266/)
707. [Sordum/BlueLife KeyFreeze](https://www.sordum.org/7921/)
708. [Sordum/Bluetooth Version finder](https://www.sordum.org/10772/)
709. [Sordum/Bpuzzle](https://www.sordum.org/8058/)
710. [Sordum/Copy IP](https://www.sordum.org/9201/)
711. [Sordum/Defender Control](https://www.sordum.org/9480/)
712. [Sordum/Defender Injector](https://www.sordum.org/10636/)
713. [Sordum/Desktop.ini Editor](https://www.sordum.org/10084/)
714. [Sordum/Dns Angel](https://www.sordum.org/8127/)
715. [Sordum/Dns Jumper](https://www.sordum.org/7952/)
716. [Sordum/Dns Lock](https://www.sordum.org/9432/)
717. [Sordum/Drive Letter Changer](https://www.sordum.org/8501/)
718. [Sordum/Easy Context Menu](https://www.sordum.org/7615/)
719. [Sordum/Easy Service Optimizer](https://www.sordum.org/8637/)
720. [Sordum/Edge Blocker](https://www.sordum.org/9312/)
721. [Sordum/Find Prime Numbers](https://www.sordum.org/9207/)
722. [Sordum/Firewall App Blocker](https://www.sordum.org/8125/)
723. [Sordum/Fix Print Spooler](https://www.sordum.org/9199/)
724. [Sordum/Folder Painter](https://www.sordum.org/10124/)
725. [Sordum/Hibernate Enable or Disable](https://www.sordum.org/9502/)
726. [Sordum/Hide From Uninstall List](https://www.sordum.org/11081/)
727. [Sordum/Net Disabler](https://www.sordum.org/9660/)
728. [Sordum/Ntfs Drive Protection](https://www.sordum.org/8117/)
729. [Sordum/PowerRun](https://www.sordum.org/9416/)
730. [Sordum/Qemu Simple Boot](https://www.sordum.org/7763/)
731. [Sordum/Ratool](https://www.sordum.org/8104/)
732. [Sordum/Rebuild Shell Icon Cache](https://www.sordum.org/9194/)
733. [Sordum/Reduce Memory](https://www.sordum.org/9197/)
734. [Sordum/Reg Converter](https://www.sordum.org/8478/)
735. [Sordum/Registry Key Jumper](https://www.sordum.org/8110/)
736. [Sordum/ReIcon](https://www.sordum.org/8366/)
737. [Sordum/Reset Data Usage](https://www.sordum.org/9817/)
738. [Sordum/Restart Explorer](https://www.sordum.org/9192/)
739. [Sordum/Router Default Password](https://www.sordum.org/10411/)
740. [Sordum/RunAsTool](https://www.sordum.org/8727/)
741. [Sordum/SendTo Menu Editor](https://www.sordum.org/10830/)
742. [Sordum/Show Desktop Icons](https://www.sordum.org/9341/)
743. [Sordum/Show Disk Partition Style](https://www.sordum.org/9307/)
744. [Sordum/Shut Down Windows](https://www.sordum.org/9205/)
745. [Sordum/Simple Run Blocker](https://www.sordum.org/8486/)
746. [Sordum/Simple VHD  Manager](https://www.sordum.org/8705/)
747. [Sordum/Sordum Monitor Off](https://www.sordum.org/10104/)
748. [Sordum/Sordum Random Password Generator](https://www.sordum.org/10946/)
749. [Sordum/Streams Remover](https://www.sordum.org/11263/)
750. [Sordum/Temp Cleaner](https://www.sordum.org/9190/)
751. [Sordum/Tunnel Adapter Microsoft 6to4 Adapter Remover](https://www.sordum.org/6423/)
752. [Sordum/Update Time](https://www.sordum.org/9203/)
753. [Sordum/VHD For Context Menu](https://www.sordum.org/9209/)
754. [Sordum/WebCam On-Off](https://www.sordum.org/8585/)
755. [Sordum/Win10 Settings Blocker](https://www.sordum.org/11128/)
756. [Sordum/Windows TopMost Control](https://www.sordum.org/9182/)
757. [Sordum/Windows Update Blocker](https://www.sordum.org/9470/)
758. [SourceTree](https://www.sourcetreeapp.com/)
759. [SpaceSniffer](http://www.uderzo.it/main_products/space_sniffer/download_alt.html)
760. [SpeedCrunch](http://speedcrunch.org/download.html)
761. [SpeedyFox](https://www.crystalidea.com/speedyfox)
762. [SQLite](https://sqlite.org/download.html)
763. [Standard Notes](https://github.com/standardnotes/desktop/releases/latest)
764. [Steam](https://biblprog.com/en/steam/download/)
765. [Stremio](https://www.stremio.com/downloads) [Freemium]
766. [Sublime Text](http://www.sublimetext.com/3) [Free Personal]
767. [Sumatra PDF](https://www.sumatrapdfreader.org/sumatra.js)
769. [Sysinternals/AccessChk](https://docs.microsoft.com/zh-cn/sysinternals/downloads/accesschk)
770. [Sysinternals/AccessEnum](https://docs.microsoft.com/zh-cn/sysinternals/downloads/accessenum)
771. [Sysinternals/Active Directory Explorer](https://docs.microsoft.com/zh-cn/sysinternals/downloads/adexplorer)
772. [Sysinternals/AdRestore](https://docs.microsoft.com/zh-cn/sysinternals/downloads/adrestore)
773. [Sysinternals/Autologon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/autologon)
774. [Sysinternals/Autoruns](https://docs.microsoft.com/zh-cn/sysinternals/downloads/autoruns)
775. [Sysinternals/BgInfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/bginfo)
776. [Sysinternals/BlueScreen](https://docs.microsoft.com/zh-cn/sysinternals/downloads/bluescreen)
777. [Sysinternals/CacheSet](https://docs.microsoft.com/zh-cn/sysinternals/downloads/cacheset)
778. [Sysinternals/ClockRes](https://docs.microsoft.com/zh-cn/sysinternals/downloads/clockres)
779. [Sysinternals/Contig](https://docs.microsoft.com/zh-cn/sysinternals/downloads/contig)
780. [Sysinternals/Coreinfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/coreinfo)
781. [Sysinternals/Ctrl2Cap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ctrl2cap)
782. [Sysinternals/DebugView](https://docs.microsoft.com/zh-cn/sysinternals/downloads/debugview)
783. [Sysinternals/Desktops](https://docs.microsoft.com/zh-cn/sysinternals/downloads/desktops)
784. [Sysinternals/Disk Usage](https://docs.microsoft.com/zh-cn/sysinternals/downloads/du)
785. [Sysinternals/Disk2vhd](https://docs.microsoft.com/zh-cn/sysinternals/downloads/disk2vhd)
786. [Sysinternals/DiskExt](https://docs.microsoft.com/zh-cn/sysinternals/downloads/diskext)
787. [Sysinternals/DiskMon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/diskmon)
788. [Sysinternals/DiskView](https://docs.microsoft.com/zh-cn/sysinternals/downloads/diskview)
789. [Sysinternals/EFSDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/efsdump)
790. [Sysinternals/FindLinks](https://docs.microsoft.com/zh-cn/sysinternals/downloads/findlinks)
791. [Sysinternals/Handle](https://docs.microsoft.com/zh-cn/sysinternals/downloads/handle)
792. [Sysinternals/Hex2dec](https://docs.microsoft.com/zh-cn/sysinternals/downloads/hex2dec)
793. [Sysinternals/Insight for Active Directory](https://docs.microsoft.com/zh-cn/sysinternals/downloads/adinsight)
794. [Sysinternals/Junction](https://docs.microsoft.com/zh-cn/sysinternals/downloads/junction)
795. [Sysinternals/LDMDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ldmdump)
796. [Sysinternals/ListDLLs](https://docs.microsoft.com/zh-cn/sysinternals/downloads/listdlls)
797. [Sysinternals/LiveKd](https://docs.microsoft.com/zh-cn/sysinternals/downloads/livekd)
798. [Sysinternals/LoadOrder](https://docs.microsoft.com/zh-cn/sysinternals/downloads/loadorder)
799. [Sysinternals/LogonSessions](https://docs.microsoft.com/zh-cn/sysinternals/downloads/logonsessions)
800. [Sysinternals/NotMyFault](https://docs.microsoft.com/zh-cn/sysinternals/downloads/notmyfault)
801. [Sysinternals/NTFSInfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ntfsinfo)
802. [Sysinternals/PageDefrag](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pagedefrag)
803. [Sysinternals/PendMovesand MoveFile](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pendmoves)
804. [Sysinternals/PipeList](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pipelist)
805. [Sysinternals/Portmon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/portmon)
806. [Sysinternals/ProcDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/procdump)
807. [Sysinternals/Process Explorer](https://docs.microsoft.com/zh-cn/sysinternals/downloads/process-explorer)
808. [Sysinternals/Process Monitor](https://docs.microsoft.com/zh-cn/sysinternals/downloads/procmon)
809. [Sysinternals/PsExec](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psexec)
810. [Sysinternals/PsFile](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psfile)
811. [Sysinternals/PsGetSid](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psgetsid)
812. [Sysinternals/PsInfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psinfo)
813. [Sysinternals/PsKill](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pskill)
814. [Sysinternals/PsList](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pslist)
815. [Sysinternals/PsLoggedOn](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psloggedon)
816. [Sysinternals/PsLogList](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psloglist)
817. [Sysinternals/PsPasswd](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pspasswd)
818. [Sysinternals/PsPing](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psping)
819. [Sysinternals/PsService](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psservice)
820. [Sysinternals/PsShutdown](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psshutdown)
821. [Sysinternals/PsSuspend](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pssuspend)
822. [Sysinternals/RAMMap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/rammap)
823. [Sysinternals/RegDelNull](https://docs.microsoft.com/zh-cn/sysinternals/downloads/regdelnull)
824. [Sysinternals/Registry Usage](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ru)
825. [Sysinternals/RegJump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/regjump)
826. [Sysinternals/RootkitRevealer](https://docs.microsoft.com/zh-cn/sysinternals/downloads/rootkit-revealer)
827. [Sysinternals/SDelete](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sdelete)
828. [Sysinternals/ShareEnum](https://docs.microsoft.com/zh-cn/sysinternals/downloads/shareenum)
829. [Sysinternals/ShellRunas](https://docs.microsoft.com/zh-cn/sysinternals/downloads/shellrunas)
830. [Sysinternals/Sigcheck](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sigcheck)
831. [Sysinternals/Streams](https://docs.microsoft.com/zh-cn/sysinternals/downloads/streams)
832. [Sysinternals/Strings](https://docs.microsoft.com/zh-cn/sysinternals/downloads/strings)
833. [Sysinternals/Sync](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sync)
834. [Sysinternals/Sysmon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sysmon)
835. [Sysinternals/TCPView](https://docs.microsoft.com/zh-cn/sysinternals/downloads/tcpview)
836. [Sysinternals/VMMap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/vmmap)
837. [Sysinternals/VolumeID](https://docs.microsoft.com/zh-cn/sysinternals/downloads/volumeid)
838. [Sysinternals/Whois](https://docs.microsoft.com/zh-cn/sysinternals/downloads/whois)
839. [Sysinternals/WinObj](https://docs.microsoft.com/zh-cn/sysinternals/downloads/winobj)
840. [Sysinternals/ZoomIt](https://docs.microsoft.com/zh-cn/sysinternals/downloads/zoomit)
841. [SysinternalsSuite](https://docs.microsoft.com/en-us/sysinternals/downloads/sysinternals-suite)
842. [System Ninja](https://singularlabs.com/software/system-ninja/confirm-download/) [Free Personal]
843. [TablacusExplorer](https://github.com/tablacus/TablacusExplorer/releases/latest)
844. [TagScanner](https://www.xdlab.ru/en/download.htm)
845. [TagSpaces](https://github.com/tagspaces/tagspaces/releases/latest) [Free Personal]
846. [Taskade](https://www.taskade.com/downloads)
847. [TeamSpeak](https://www.teamspeak.com/en/downloads/) [Free Personal]
848. [TeamViewer](https://community.teamviewer.com/t5/Change-Log-Windows/bd-p/Change_Log_Windows) [Freemium]
849. [Telegram](https://github.com/telegramdesktop/tdesktop/releases/latest)
850. [TestDisk](https://www.cgsecurity.org/wiki/TestDisk_Download)
851. [Textify](https://rammichael.com/downloads/textify_setup.exe?changelog)
852. [The Silver Searcher](https://github.com/k-takata/the_silver_searcher-win32/releases)
853. [TIM](https://tim.qq.com/download.html)
854. [Tixati](https://www.tixati.com/download/windows64.html)
855. [Tomboy](https://github.com/tomboy-notes/tomboy-ng/releases/latest)
856. [Tor Browser](https://www.torproject.org/download/download-easy.html.en) :airplane:
857. [TortoiseGit](https://tortoisegit.org/download/)
858. [TortoiseSVN](https://tortoisesvn.net/downloads.html)
859. [Total Commander](https://www.ghisler.com/download.htm) [Free Personal]
860. [Total Uninstall](https://www.martau.com/uninstaller-download.php) :money_with_wings:
861. [Touchpad Blocker](https://touchpad-blocker.com)
862. [Tower](https://www.git-tower.com/release-notes/windows) :money_with_wings:
863. [traccar](https://github.com/traccar/traccar/releases/latest)
864. [TrafficMonitor](https://github.com/zhongyang219/TrafficMonitor/releases/latest)
865. [Transmission](https://github.com/transmission/transmission/releases/latest)
866. [Traymond](https://github.com/fcFn/traymond/releases/latest)
867. [Tribler](https://github.com/Tribler/tribler/releases/latest)
868. [TunnelBear](https://www.tunnelbear.com/core/getVersionHistory?platform=pc) [Free Personal] :airplane:
869. [Turtl](https://github.com/turtl/desktop/releases/latest)
870. [Twitch](https://www.filehorse.com/download-twitch-desktop-app/download/) [Free Personal] :hand:
871. [Ubooquity](http://vaemendis.net/ubooquity/static2/download)
872. [ueli](https://github.com/oliverschwendener/ueli/releases/latest)
873. [uGet](https://ugetdm.com/downloads/windows/)
874. [UltraISO](https://www.ultraiso.com/download.html)
875. [ultraSurf](http://wujieliulan.com/) :airplane:
876. [Uncolored](https://github.com/n457/Uncolored/releases/latest)
877. [UNetbootin](https://github.com/unetbootin/unetbootin/releases/latest)
878. [Universal Extractor 2](https://github.com/Bioruebe/UniExtract2/releases/latest)
879. [Universal Extractor mod by koros aka ya158](http://forum.oszone.net/thread-295084.html) :hand:
880. [Unreal Commander](https://x-diesel.com/?download) [Free Personal]
881. [upx](https://github.com/upx/upx/releases/latest)
882. [uTools](https://u.tools/download.html)
883. [uTorrent](http://blog.utorrent.com/releases/windows/) [Free Personal] :hand:
884. [v2ray](https://github.com/v2ray/v2ray-core/releases/latest)
885. [v2rayN](https://github.com/2dust/v2rayN/releases/latest)
886. [V2RayW](https://github.com/Cenmrev/V2RayW/releases)
887. [VcXsrv](https://sourceforge.net/projects/vcxsrv/files/)
888. [Velocity](https://velocity.silverlakesoftware.com/) [Free Personal]
889. [VerySleepy](https://github.com/VerySleepy/verysleepy/releases/latest)
890. [Video Download Manager](https://github.com/ingbyr/VDM/releases/latest)
891. [Visual Studio Code](https://github.com/Microsoft/vscode/releases)
892. [VLC Media Player](https://www.videolan.org/vlc/download-windows.html)
893. [VNote](https://github.com/tamlok/vnote/releases/latest)
894. [Volume2](https://irzyxa.blogspot.com/p/downloads.html)
895. [VPN Gate](https://www.vpngate.net/cn/download.aspx) :airplane:
896. [wagon](https://github.com/laravel-dojo/wagon/releases/latest)
897. [WebCopy](https://www.cyotek.com/cyotek-webcopy/downloads)
898. [WebTorrent](https://github.com/webtorrent/webtorrent-desktop/releases/latest)
899. [WeChat Work](https://work.weixin.qq.com/) :hand:
900. [WeChat](https://weixin.qq.com/cgi-bin/readtemplate?t=win_weixin) :hand:
901. [WGestures](https://github.com/yingDev/WGestures/releases/latest)
902. [wget](https://eternallybored.org/misc/wget/)
903. [WikidPad](https://github.com/WikidPad/WikidPad/releases/)
904. [Winamp](http://www.winamp.com/) [Free Personal]
905. [WinAuth](https://github.com/winauth/winauth/releases)
906. [WinCDEmu Portable](http://wincdemu.sysprogs.org/portable/)
907. [WinDirStat](https://windirstat.net/download.html)
908. [Windows System Control Center](http://www.kls-soft.com/wscc/downloads.php) [Freemium]
909. [Windscribe](https://www.filehorse.com/download-windscribe/download/) [Free Personal]
910. [WinHex](http://www.x-ways.net/winhex/) :money_with_wings:
911. [WinMerge](http://winmerge.org/downloads/)
912. [WinNTSetup](https://msfn.org/board/topic/149612-winntsetup/)
913. [WinRAR](https://www.rarlab.com/download.htm) [Free Personal]
914. [WinSCP](https://winscp.net/eng/download.php)
915. [winyl](https://github.com/winyl-player/winyl/releases)
917. [Wise/Wise Anti Malware](https://www.wisecleaner.com/wise-anti-malware.html)
918. [Wise/Wise Auto Shutdown](https://www.wisecleaner.com/wise-auto-shutdown.html)
919. [Wise/Wise Care 365](https://www.wisecleaner.com/wise-care-365.html) [Free Personal]
920. [Wise/Wise Data Recovery](https://www.wisecleaner.com/wise-data-recovery.html)
921. [Wise/Wise Disk Cleaner](https://www.wisecleaner.com/wise-disk-cleaner.html)
922. [Wise/Wise Duplicate Finder](https://www.wisecleaner.com/wise-duplicate-finder.html)
923. [Wise/Wise Folder Hider Pro](https://www.wisecleaner.com/wise-folder-hider-pro.html)
924. [Wise/Wise Force Deleter](https://www.wisecleaner.com/wise-force-deleter.html)
925. [Wise/Wise Game Booster](https://www.wisecleaner.com/wise-game-booster.html)
926. [Wise/Wise Hotkey](https://www.wisecleaner.com/wise-hotkey.html)
927. [Wise/Wise JetSearch](https://www.wisecleaner.com/wise-jetsearch.html)
928. [Wise/Wise Memory Optimizer](https://www.wisecleaner.com/wise-memory-optimizer.html)
929. [Wise/Wise PC 1stAid](https://www.wisecleaner.com/wise-pc-1staid.html)
930. [Wise/Wise Plugin Manager](https://www.wisecleaner.com/wise-plugin-manager.html)
931. [Wise/Wise Program Uninstaller](https://www.wisecleaner.com/wise-program-uninstaller.html)
932. [Wise/Wise Registry Cleaner](https://www.wisecleaner.com/wise-registry-cleaner.html)
933. [Wise/Wise Reminder](https://www.wisecleaner.com/wise-reminder.html)
934. [Wise/Wise System Monitor](https://www.wisecleaner.com/wise-system-monitor.html)
935. [Wise/Wise Windows Key Finder](https://www.wisecleaner.com/wise-windows-key-finder.html)
936. [WiX Toolset](https://github.com/wixtoolset/wix3/releases/latest)
937. [WizFile](https://antibody-software.com/web/software/software/wizfile-finds-your-files-fast/)
938. [WizKey](https://antibody-software.com/web/software/software/wizkey-makes-it-easy-to-type-accented-and-other-special-unicode-characters/) :money_with_wings:
939. [WizMouse](https://antibody-software.com/web/software/software/wizmouse-makes-your-mouse-wheel-work-on-the-window-under-the-mouse/)
940. [WizTree](https://antibody-software.com/web/software/software/wiztree-finds-the-files-and-folders-using-the-most-disk-space-on-your-hard-drive/)
941. [WordPress.com](https://github.com/Automattic/wp-desktop/releases/latest)
942. [Wox](https://github.com/Wox-launcher/Wox/releases)
943. [wxHexEditor](https://sourceforge.net/projects/wxhexeditor/files/)
944. [x64dbg](https://github.com/x64dbg/x64dbg/releases/latest)
945. [XAMPP](https://www.apachefriends.org/index.html) :hand:
946. [Xlideit Image Viewer](https://sourceforge.net/projects/xlideit/files)
947. [XMPlay](http://www.un4seen.com/xmplay.html)
948. [XnConvert](https://www.xnview.com/en/xnconvert/)
949. [XnRetro](https://www.xnview.com/en/xnretro/)
950. [XnSketch](https://www.xnview.com/en/xnsketch/)
951. [XnView](https://www.xnview.com/en/xnview/) [Freemium]
952. [XnViewMP](https://www.xnview.com/en/xnviewmp/) [Freemium]
953. [Xtreme Download Manager](http://xdman.sourceforge.net/)
954. [XX-Net](https://github.com/XX-net/XX-Net/blob/master/code/default/download.md)
955. [YACReader](http://www.yacreader.com/downloads)
956. [Yandex Browser](https://browser.yandex.com/)
957. [Yosoro](https://github.com/IceEnd/Yosoro/releases/latest)
958. [youtube-dl-gui](https://github.com/MrS0m30n3/youtube-dl-gui/releases/latest)
959. [youtube-dl](https://github.com/rg3/youtube-dl/releases/latest)
960. [YUMI-UEFI](https://www.pendrivelinux.com/yumi-multiboot-usb-creator/)
961. [YUMI](https://www.pendrivelinux.com/yumi-multiboot-usb-creator/)
962. [Zazu](https://github.com/tinytacoteam/zazu/releases/latest)
963. [zeal](https://github.com/zealdocs/zeal/releases/latest)
964. [ZenMate](https://www.filehorse.com/download-zenmate-vpn/download/)
965. [ZeroNet](https://github.com/HelloZeroNet/ZeroNet/releases/latest)
966. [ZeroTier One](https://www.zerotier.com/download.shtml) [Free Personal]
967. [Zim](https://zim.glump.net/windows/)
968. [为知笔记](http://www.wiz.cn/downloads-windows.html) :money_with_wings:
969. [冰点文库下载器](http://www.bingdian001.com/?p=30) :hand:
970. [繁化姬](https://github.com/James1201/Fanhuaji-GUI-Release/releases/latest)

</details>

### Special Software
#### 特别的软件

##### Special Installer
###### 特殊的安装方式(作为参考)

1. [AIMP](software/AIMP.js)
2. [Bandisoft Bandizip](software/Bandisoft%20Bandizip.js)
3. [Bandisoft Honeyview](software/Bandisoft%20Honeyview.js)
4. [Calibre](software/Calibre.js)
5. [Cygwin](software/Cygwin.js)
6. [FastCopy](software/FastCopy.js)
7. [GIMP](software/GIMP.js)
8. [Python](software/Python.js)
9. [Python2](software/Python2.js)
10. [TIM](software/TIM.js)


##### Without Download
###### 缺失下载

1. [Enigma Virtual Box unpacker](software/Enigma%20Virtual%20Box%20unpacker.js)
2. [shadowsocks-qt5](software/shadowsocks-qt5.js)
3. [Universal Extractor mod by koros aka ya158](software/Universal%20Extractor%20mod%20by%20koros%20aka%20ya158.js)
4. [冰点文库下载器](software/%E5%86%B0%E7%82%B9%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8.js)


##### Without Installer
###### 缺失安装方式

1. [Cloudevo](software/Cloudevo.js)
2. [Evernote](software/Evernote.js)
3. [FreeFileSync](software/FreeFileSync.js)
4. [Internet Download Manager](software/Internet%20Download%20Manager.js)
5. [NeoSmart/Windows 10 Rollback Utility](software/NeoSmart/Windows%2010%20Rollback%20Utility.js)
6. [QQ](software/QQ.js)
7. [RaiDrive](software/RaiDrive.js)
8. [SoftEtherVPN](software/SoftEtherVPN.js)
9. [Twitch](software/Twitch.js)
10. [uTorrent](software/uTorrent.js)
11. [WeChat Work](software/WeChat%20Work.js)
12. [WeChat](software/WeChat.js)
13. [XAMPP](software/XAMPP.js)


##### Extractable Software
###### 可以解包的软件

1. 以下软件的安装包使用 [Advanced Installer](https://www.advancedinstaller.com/) 打包
  可以使用参数 `/extract <path>` 来提取，查看[更多信息](https://www.advancedinstaller.com/user-guide/exe-setup-file.html)

    `RaiDrive`

2. `Evernote` 是使用MSI打包的, 你可以从 `%temp%\Evernote.msi` 获得安装包
