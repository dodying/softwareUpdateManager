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


### Command-Line
#### 命令行

* `-makemd`
* `-help`
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

* [ ] 支持同一软件的不同版本
* [ ] 从 [FileHorse.com](http://www.filehorse.com/) 等网站搜索并生成相应js
* [ ] 自动检查安装包类型并安装

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
  url: 'https://github.com/telegramdesktop/tdesktop/releases/latest',
  // ?preferPath: 'preferPath',
  version: {
    selector: '.muted-link.css-truncate'
    // ?attr:
    // 1. text or omitted => text()
    // 2. html => html()
    // 3. other => attr(other)
    //
    // ?match:
    // 1. omitted => /(\d+[\d.]+\d+)/[1]
    // 2. /other/ => /other/[1]
    // ---
    // or func: async (res, $, req, cheerio) => { return version }
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
    // func: async (res, $, req, cheerio) => { return url }

    // ?output:
    // save to which extension, format: '.ext'
    // eg: output='.zip', it'll be named as 'Telegram-version.zip'
    // or omitted: extension according to download url
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
19. [aria2](https://github.com/aria2/aria2/releases/latest)
20. [AS SSD Benchmark](https://www.alex-is.de/PHP/fusion/downloads.php?download_id=9)
21. [Atom](https://github.com/atom/atom/releases/latest)
22. [Audacious](https://audacious-media-player.org/download)
23. [Audacity](https://biblprog.com/en/audacity/download/)
24. [AutoHotkey](https://www.autohotkey.com/download/)
25. [AutoIt](https://www.autoitscript.com/site/autoit/downloads/)
26. [Axife](https://www.axife.com/downloads.html) :money_with_wings:
27. [Babun](https://github.com/babun/babun/releases)
28. [BaiduPCS-Go](https://github.com/iikira/BaiduPCS-Go/releases/latest)
29. [balenaEtcher](https://github.com/balena-io/etcher/releases/latest)
30. [Bandisoft Bandizip](https://www.bandisoft.com/bandizip/)
31. [Bandisoft Honeyview](http://www.bandisoft.com/honeyview/)
32. [Beyond Compare](http://scootersoftware.com/download.php?zz=dl4) :money_with_wings:
33. [BiglyBT](https://github.com/BiglySoftware/BiglyBT/releases/latest)
34. [BleachBit](https://www.bleachbit.org/download/windows)
35. [Blender](https://www.blender.org/download/)
36. [Boostnote](https://github.com/BoostIO/boost-releases/releases/latest)
37. [BorderlessGaming](https://github.com/Codeusa/Borderless-Gaming/releases/latest)
38. [Brackets](https://github.com/adobe/brackets/releases/latest)
39. [Brave](https://github.com/brave/brave-browser/releases/latest)
40. [Brook](https://github.com/txthinking/brook/releases/latest)
41. [Bulk Crap Uninstaller](https://github.com/Klocman/Bulk-Crap-Uninstaller/releases/latest)
42. [Bulk Image Downloader](https://bulkimagedownloader.com/) :money_with_wings:
43. [Calibre](https://github.com/kovidgoyal/calibre/releases/latest)
44. [CCEnhancer](https://singularlabs.com/software/ccenhancer/download-ccenhancer/)
45. [CentBrowser](https://www.centbrowser.cn/history.html)
46. [CerebroApp](https://github.com/KELiON/cerebro/releases/latest)
47. [Championify](https://github.com/dustinblackman/Championify/releases/latest)
48. [CherryTree](https://github.com/giuspen/cherrytree/releases)
49. [ChromeUpdateSharp](https://csharp.love/chrome-update-tool.html)
50. [CintaNotes](http://cintanotes.com/download/) [Free Personal]
51. [CLaunch](http://hp.vector.co.jp/authors/VA018351/claunch.html)
52. [Clementine](https://github.com/clementine-player/Clementine/releases/latest)
53. [cloud-torrent](https://github.com/jpillora/cloud-torrent/releases/latest)
54. [Cloudevo](https://www.evorim.com/en/cloudevo) [Free Personal] :hand:
55. [Cmder Mini](https://github.com/cmderdev/cmder/releases/latest)
56. [ComicRack](http://comicrack.cyolito.com/downloads)
57. [ComicTagger](https://github.com/davide-romanini/comictagger/releases)
58. [ConEmu](https://github.com/Maximus5/ConEmu/releases/latest)
59. [CopyQ](https://github.com/hluk/CopyQ/releases/latest)
60. [CopyTranslator](https://github.com/elliottzheng/CopyTranslator/releases/latest)
61. [cow](https://github.com/cyfdecyf/cow/releases/latest)
62. [CPUID CPU-Z](https://www.cpuid.com/softwares/cpu-z.html)
63. [CPUID HWMonitor PRO](https://www.cpuid.com/softwares/hwmonitor-pro.html) :money_with_wings:
64. [CPUID HWMonitor](https://www.cpuid.com/softwares/hwmonitor.html)
65. [CPUID Perfmonitor2](https://www.cpuid.com/softwares/perfmonitor-2.html)
66. [Crypto-Notepad](https://github.com/Crypto-Notepad/Crypto-Notepad/releases/latest)
67. [CrystalDiskInfo](https://crystalmark.info/en/download/)
68. [CrystalDiskMark](https://crystalmark.info/en/download/)
69. [Cygwin](http://mirrors.kernel.org/sourceware/cygwin/x86_64/)
70. [DB Browser for SQLite](https://github.com/sqlitebrowser/sqlitebrowser/releases/latest)
71. [DBeaver](https://dbeaver.io/download/) [Free Personal]
72. [Deluge](https://dev.deluge-torrent.org/wiki/ReleaseNotes)
73. [DevDocs](https://github.com/egoist/devdocs-desktop/releases/latest)
74. [Diffinity](http://truehumandesign.se/s_diffinity.php)
75. [Discord](https://www.filehorse.com/download-discord/download/) [Free Personal]
76. [DiskGenius](http://www.eassos.com/download.php) [Free Personal]
77. [Dism++](http://www.chuyu.me/zh-Hans/index.html)
78. [DisplayFusion](https://www.displayfusion.com/ChangeLog/) [Free Personal]
79. [Ditto](https://ditto-cp.sourceforge.io/)
80. [DocFetcher](https://sourceforge.net/projects/docfetcher/files)
81. [Dopamine](https://www.digimezzo.com/content/software/dopamine/)
82. [Dropbox](https://biblprog.com/en/dropbox/download/)
83. [Duplicate Cleaner](https://www.duplicatecleaner.com/index.html) [Free Personal]
84. [duplicati](https://github.com/duplicati/duplicati/releases)
85. [DynVPN-CLI](https://dynvpn.com/download/)
86. [DynVPN](https://dynvpn.com/download/)
87. [EagleGet](http://www.eagleget.com/download-eagleget-portable/)
88. [Elephant](https://github.com/jusu/Elephant/releases/latest)
89. [EMDB](http://www.emdb.eu/)
90. [Enigma Virtual Box unpacker](https://lifeinhex.com/tag/enigma-virtual-box/) :hand:
91. [Enigma Virtual Box](https://enigmaprotector.com/en/downloads/changelogenigmavb.html)
92. [Evernote](https://evernote.com/intl/zh-cn/download) :hand:
93. [Everything](https://www.voidtools.com/downloads/)
94. [Executor](http://www.1space.dk/executor/downloadlinks.html)
95. [ExtremeCopy](http://www.easersoft.com/product.html) :money_with_wings:
96. [FastCopy-M](https://github.com/Mapaler/FastCopy-M/releases/latest)
97. [FastCopy](https://fastcopy.jp/)
98. [ffmpeg](https://ffmpeg.zeranoe.com/builds/)
99. [Fiddler Web Debugger](https://www.majorgeeks.com/mg/getmirror/fiddler,1.html)
100. [FileUploader](http://z-o-o-m.eu/down.htm)
101. [FileZilla Server](https://filezilla-project.org/download.php?type=server)
102. [FileZilla](https://filezilla-project.org/download.php?type=client)
103. [firefly-proxy](https://github.com/yinghuocho/firefly-proxy/releases/latest)
104. [Flamory](https://filehippo.com/zh/download_flamory/) [Freemium]
105. [Foobar2000](http://www.foobar2000.org/download)
106. [Fopnu](https://www.fopnu.com/download/windows64.html)
107. [Fork](https://git-fork.com/releasenoteswin)
108. [Foxit Reader](https://biblprog.com/en/foxit_reader/download/) [Freemium]
109. [freac](https://github.com/enzo1982/freac/releases/latest)
110. [Free Alarm Clock](http://freealarmclocksoftware.com/) [Free Personal]
111. [Free Download Manager](https://www.freedownloadmanager.org/download.htm)
112. [FreeCAD](https://github.com/FreeCAD/FreeCAD/releases/latest)
113. [FreeCommander](https://freecommander.com/en/downloads/) [Free Personal]
114. [FreeFileSync](https://freefilesync.org/download.php) [Free Personal] :hand:
115. [FreeGate](https://www.filehorse.com/download-freegate/download/) :airplane:
116. [Freenet](https://github.com/freenet/fred/releases//latest)
117. [FrostWire](https://github.com/frostwire/frostwire/releases)
118. [fzf](https://github.com/junegunn/fzf-bin/releases/latest)
119. [Geany](https://www.geany.org/Download/Releases)
120. [gedit](http://ftp.gnome.org/pub/GNOME/binaries/win64/gedit/)
121. [GifCam](https://en.softonic.com/download/gifcam/windows/post-download)
122. [Gifsicle](https://eternallybored.org/misc/gifsicle/)
123. [GIMP](https://www.gimp.org/downloads/)
124. [Git Extensions](https://github.com/gitextensions/gitextensions/releases)
125. [Git](https://github.com/git-for-windows/git/releases/latest)
126. [GitHub](https://central.github.com/deployments/desktop/desktop/changelog.json)
127. [GitKraken](https://www.gitkraken.com/download) [Freemium]
128. [GitNote](https://github.com/zhaopengme/gitnote/releases/latest)
130. [Glarysoft/Absolute Uninstaller](https://www.glarysoft.com/absolute-uninstaller/)
131. [Glarysoft/Disk SpeedUp](https://www.glarysoft.com/disk-speedup/)
132. [Glarysoft/Glary Disk Cleaner](https://www.glarysoft.com/disk-cleaner/)
133. [Glarysoft/Glary Disk Explorer](https://www.glarysoft.com/disk-explorer/)
134. [Glarysoft/Glary Duplicate Cleaner](https://www.glarysoft.com/duplicate-cleaner/)
135. [Glarysoft/Glary Tracks Eraser](https://www.glarysoft.com/tracks-eraser/)
136. [Glarysoft/Glary Undelete](https://www.glarysoft.com/glary-undelete/)
137. [Glarysoft/Glary Utilities Pro](https://www.glarysoft.com/glary-utilities-pro/) :money_with_wings:
138. [Glarysoft/Glary Utilities](https://www.glarysoft.com/glary-utilities/)
139. [Glarysoft/Malware Hunter](https://www.glarysoft.com/malware-hunter/) :money_with_wings:
140. [Glarysoft/Quick Search](https://www.glarysoft.com/quick-search/)
141. [Glarysoft/Quick Startup](https://www.glarysoft.com/quick-startup/)
142. [Glarysoft/Registry Repair](https://www.glarysoft.com/registry-repair/)
143. [Glarysoft/Software Update Pro](https://www.glarysoft.com/software-update/) :money_with_wings:
144. [Glarysoft/Software Update](https://www.glarysoft.com/software-update/)
145. [glimpses](https://getglimpses.com/)
146. [GnuPG](https://www.gnupg.org/download/index.html)
147. [goflyway](https://github.com/coyove/goflyway/releases)
148. [golang](https://golang.org/dl/)
149. [Google Chrome](https://api.pzhacm.org/iivb/cu.json)
150. [Google Drive](https://biblprog.com/en/google_drive/download/)
151. [Gpg4win](https://gpg4win.org/download.html)
152. [GPU-Z](https://www.techpowerup.com/download/techpowerup-gpu-z/)
153. [Grammarly](https://www.filehorse.com/download-grammarly/)
154. [gVim](https://github.com/vim/vim-win32-installer/releases/latest)
155. [Hain](https://github.com/hainproject/hain/releases/latest)
156. [HandBrake](https://handbrake.fr/downloads.php)
157. [Harmony](https://github.com/vincelwt/harmony/releases/latest)
158. [HDDScan](http://hddscan.com/)
159. [HFS](http://www.rejetto.com/hfs/?f=dl)
160. [HiddeX](http://dejavu.narod.ru/hiddex.html)
161. [Hide.me](https://hide.me/en/software/windows) [Free Personal]
162. [HostsMan](https://www.majorgeeks.com/mg/getmirror/hostsman,1.html)
163. [Hot Alarm Clock](https://hotalarmclock.com/download/) [Free Personal]
164. [HotspotShield](https://www.filehorse.com/download-hotspot-shield/download/) [Free Personal]
165. [Hourglass](https://github.com/dziemborowicz/hourglass/releases/latest)
166. [HTTrack](http://www.httrack.com/page/2/en/index.html)
167. [HxD](https://mh-nexus.de/en/downloads.php?product=HxD20)
168. [ILSpy](https://github.com/icsharpcode/ILSpy/releases/latest)
169. [ImageMagick](https://imagemagick.org/script/download.php)
170. [Inkscape](https://inkscape.org/release/)
171. [Inno Setup Unpacker](https://sourceforge.net/projects/innounp/files/innounp/)
172. [Inno Setup](http://www.jrsoftware.org/isdl.php)
173. [innoextract](https://github.com/dscharrer/innoextract/releases/latest)
174. [InnoExtractor](http://www.havysoft.cl/descargar.html)
175. [Insomnia](https://github.com/getinsomnia/insomnia/releases/latest) [Free Personal]
176. [IntelliJ IDEA Community](https://data.services.jetbrains.com/products/releases?code=IIC&latest=true&type=release)
177. [IntelliJ IDEA Ultimate](https://data.services.jetbrains.com/products/releases?code=IIU&latest=true&type=release) :money_with_wings:
178. [Internet Download Accelerator](https://www.westbyte.com/ida/index.phtml?page=download) [Freemium]
179. [Internet Download Manager](http://www.internetdownloadmanager.com/) :money_with_wings: :hand:
189. [IObit/Advanced SystemCare](https://www.majorgeeks.com/mg/getmirror/advanced_systemcare,1.html)
190. [IObit/Driver Booster](https://www.majorgeeks.com/mg/getmirror/iobit_driver_booster,1.html)
191. [IObit/IObit Game Booster](https://www.majorgeeks.com/mg/getmirror/iobit_game_booster,1.html)
192. [IObit/IObit Malware Fighter](https://www.majorgeeks.com/mg/getmirror/iobit_malware_fighter,1.html)
193. [IObit/IObit Toolbox](https://www.majorgeeks.com/mg/getmirror/iobit_toolbox,1.html)
194. [IObit/IObit Undelete](https://www.majorgeeks.com/mg/getmirror/iobit_undelete,1.html)
195. [IObit/IObit Uninstaller](https://www.majorgeeks.com/mg/getmirror/iobit_uninstaller,1.html)
196. [IObit/IObit Unlocker](https://www.majorgeeks.com/mg/getmirror/iobit_unlocker,1.html)
197. [IObit/Protected Folder](https://www.majorgeeks.com/mg/getmirror/iobit_protected_folder,1.html)
198. [IObit/Random Password Generator](https://www.majorgeeks.com/mg/getmirror/random_password_generator,1.html)
199. [IObit/Smart Defrag](https://www.majorgeeks.com/mg/getmirror/iobit_smartdefrag,1.html)
200. [IObit/Start Menu 8](https://www.majorgeeks.com/mg/getmirror/start_menu_8,1.html)
201. [IObit/WinMetro](https://www.majorgeeks.com/mg/getmirror/winmetro,1.html)
202. [IP雷达](http://www.ipneed.com/main/download.html)
203. [ISx](https://github.com/lifenjoiner/ISx/releases/latest)
204. [JiJiDownForWPF](http://l.acesheep.com/bili/re.php?callback=?)
205. [Joplin](https://github.com/laurent22/joplin/releases/latest)
206. [K-Lite Codec Pack Basic](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_basic,1.html)
207. [K-Lite Codec Pack Full](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_full,1.html)
208. [K-Lite Codec Pack Standard](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_standard,1.html)
209. [K-Lite Codec Pack Update](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_update,1.html)
211. [KC Softwares/ApHeMo](https://www.kcsoftwares.com/?download) :money_with_wings:
212. [KC Softwares/Audiograil](https://www.kcsoftwares.com/?download) :money_with_wings:
213. [KC Softwares/AVIToolbox](https://www.kcsoftwares.com/?download) :money_with_wings:
214. [KC Softwares/BATExpert](https://www.kcsoftwares.com/?download)
215. [KC Softwares/dot11Expert](https://www.kcsoftwares.com/?download) :money_with_wings:
216. [KC Softwares/DUMo](https://www.kcsoftwares.com/?download) :money_with_wings:
217. [KC Softwares/HDDExpert](https://www.kcsoftwares.com/?download)
218. [KC Softwares/IDPhotoStudio](https://www.kcsoftwares.com/?download)
219. [KC Softwares/Ignition](https://www.kcsoftwares.com/?download)
220. [KC Softwares/K-ML](https://www.kcsoftwares.com/?download) :money_with_wings:
221. [KC Softwares/KCleaner](https://www.kcsoftwares.com/?download) [Free Personal]
222. [KC Softwares/KFK](https://www.kcsoftwares.com/?download)
223. [KC Softwares/MassCert](https://www.kcsoftwares.com/?download)
224. [KC Softwares/PhotoToFilm](https://www.kcsoftwares.com/?download) :money_with_wings:
225. [KC Softwares/PortExpert](https://www.kcsoftwares.com/?download)
226. [KC Softwares/RAMExpert](https://www.kcsoftwares.com/?download)
227. [KC Softwares/Startup Sentinel](https://www.kcsoftwares.com/?download)
228. [KC Softwares/SUMo](https://www.kcsoftwares.com/?download) [Free Personal]
229. [KC Softwares/Vampix](https://www.kcsoftwares.com/?download)
230. [KC Softwares/VideoInspector](https://www.kcsoftwares.com/?download)
231. [KC Softwares/Zer0](https://www.kcsoftwares.com/?download)
233. [KDE/Amarok](https://community.kde.org/Amarok/GettingStarted/Download/Windows)
234. [KDE/digiKam](https://mirrors.shu.edu.cn/kde/ftp/stable/digikam/?C=N&O=D)
235. [KDE/Falkon](https://www.falkon.org/)
236. [KDE/Kate](https://mirrors.shu.edu.cn/kde/ftp/stable/kate/?C=N&O=D)
237. [KDE/KDevelop](https://www.kdevelop.org/download)
238. [KDE/KDiff3](https://sourceforge.net/projects/kdiff3/files/)
239. [KDE/KEXI](https://mirrors.shu.edu.cn/kde/ftp/stable/kexi/win64/)
240. [KDE/KMyMoney](https://mirrors.shu.edu.cn/kde/ftp/stable/kmymoney/latest/win64/)
241. [KDE/Krita](https://krita.org/en/download/krita-desktop/)
242. [KDE/Marble](https://marble.kde.org/install.php)
243. [KDE/Umbrello](https://mirrors.shu.edu.cn/kde/ftp/stable/umbrello/latest/win64/)
244. [KeePass](https://keepass.info/download.html)
245. [KeeWeb](https://github.com/keeweb/keeweb/releases/latest)
246. [KenPlayer](http://www.chken.com/KenPlayer.html)
247. [KeyNote NF](https://github.com/dpradov/keynote-nf/releases/latest)
248. [Keypirinha](https://github.com/Keypirinha/Keypirinha/releases/latest)
249. [Kinza](https://www.kinza.jp/en/download/thankyou/windows_x64/)
250. [KiTTY](https://www.softpedia.com/get/Network-Tools/Telnet-SSH-Clients/9bis-KiTTY.shtml)
251. [KMPlayer](https://www.majorgeeks.com/mg/getmirror/kmplayer,1.html)
252. [Kodi](https://kodi.tv/download/849)
253. [Koofr](https://koofr.eu/desktop-apps/) [Free Personal]
254. [LabelPlus](https://github.com/LabelPlus/LabelPlus/releases/latest)
255. [Lantern](https://www.softpedia.com/get/Internet/Servers/Proxy-Servers/Lantern.shtml)
256. [Last.fm Scrobbler](https://www.last.fm/about/trackmymusic)
257. [launch4j](https://sourceforge.net/projects/launch4j/files/)
258. [Leanote](http://app.leanote.com/) [Free Personal]
259. [Lepton](https://github.com/hackjutsu/Lepton/releases/latest)
260. [LibreCAD](https://github.com/LibreCAD/LibreCAD/releases/latest)
261. [LibreOffice](https://www.libreoffice.org/download/download/)
262. [LICEcap](https://www.cockos.com/licecap/)
263. [Light Alloy](http://light-alloy.verona.im/download/)
264. [lightsocks](https://github.com/gwuhaolin/lightsocks/releases/latest)
265. [Listary](https://www.listary.com/download) [Free Personal]
266. [LMMS](https://github.com/LMMS/lmms/releases/latest)
267. [Locale-Emulator](https://github.com/xupefei/Locale-Emulator/releases/latest)
268. [LogMeIn Hamachi](https://www.filehorse.com/download-logmein-hamachi/download/) [Free Personal]
269. [Lua for Windows](https://github.com/rjpcomputing/luaforwindows/releases/latest)
270. [lynx](https://lynx.invisible-island.net/release/breakout/CHANGES)
271. [MadVR](http://madvr.com/)
272. [MassTube](http://www.havysoft.cl/descargar.html) [Free Personal]
273. [Maxthon](http://www.maxthon.cn/mx5/changelog/)
274. [MDB Viewer Plus](http://www.alexnolan.net/software/mdbplus.xml)
275. [MediaInfo-CLI](https://mediaarea.net/en/MediaInfo/Download/Windows)
276. [MediaInfo-GUI](https://mediaarea.net/en/MediaInfo/Download/Windows)
277. [MEGAcmd](https://raw.githubusercontent.com/meganz/MEGAcmd/master/build/megacmd/megacmd.changes)
278. [megacmd@t3rm1n4l](https://github.com/t3rm1n4l/megacmd/releases/latest)
279. [Megatools](https://megatools.megous.com/)
280. [MeGUI](https://sourceforge.net/projects/megui/files)
281. [Meld](http://meldmerge.org/)
282. [MemReduct](https://github.com/henrypp/memreduct/releases/latest)
283. [Mercurial](https://www.mercurial-scm.org/wiki/Download)
284. [Messenger](https://github.com/aluxian/Messenger-for-Desktop/releases/latest)
285. [MinGit](https://github.com/git-for-windows/git/releases/latest)
286. [MinGW-w64](https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/)
287. [MiniTool Partition Wizard](https://www.partitionwizard.com/upgrade-history.html) [Free Personal]
288. [MiniTool Power Data Recovery](https://www.minitool.com/data-recovery-software/upgrade-history.html) [Free Personal]
289. [MiniTool ShadowMaker](https://www.minitool.com/backup/upgrade-history.html) [Free Personal]
290. [MiTec EXE Explorer](http://www.mitec.cz/index.html)
291. [MiTec Task Manager DeLuxe](http://www.mitec.cz/Data/XML/data_tmxvh.xml)
292. [Mixxx](https://mixxx.org/download/)
293. [MKVToolNix](https://mkvtoolnix.download/doc/NEWS.md)
294. [MobaXterm](https://mobaxterm.mobatek.net/download-home-edition.html) [Free Personal]
295. [Motrix](https://github.com/agalwood/Motrix/releases)
297. [Mozilla/Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/notes/)
298. [Mozilla/Firefox Nightly](https://www.mozilla.org/en-US/firefox/nightly/notes/)
299. [Mozilla/Firefox](https://www.mozilla.org/en-US/firefox/latest/releasenotes/)
300. [Mozilla/SeaMonkey](https://www.seamonkey-project.org/releases/)
301. [Mozilla/Thunderbird](https://www.thunderbird.net/notes/)
302. [Mp3tag](https://www.mp3tag.de/en/download.html)
303. [MPC-BE](https://sourceforge.net/projects/mpcbe/files/)
304. [MPC-HC](https://mpc-hc.org/downloads/)
305. [MPlayer](http://oss.netfarm.it/mplayer/)
306. [mps-youtube](https://github.com/mps-youtube/mps-youtube/releases/latest)
307. [mpv](https://mpv.srsfckn.biz/)
308. [mRemoteNG](https://github.com/mRemoteNG/mRemoteNG/releases)
309. [msys2](https://www.msys2.org/)
310. [Mullvad](https://github.com/mullvad/mullvadvpn-app/releases/latest) [Free Personal]
311. [MusicBee](https://www.getmusicbee.com/downloads/) [Freemium]
312. [MusicBrainz Picard](https://picard.musicbrainz.org/downloads/)
313. [mypaint](https://github.com/mypaint/mypaint/releases/latest)
314. [NConvert](https://www.xnview.com/en/nconvert/) [Freemium]
315. [Neard](https://github.com/neard/neard/releases/latest)
317. [NeoSmart/CHMOD-Win](https://neosmart.net/Software/Changelog/4)
318. [NeoSmart/Easy USB Creator](https://neosmart.net/Software/Changelog/21) [Freemium]
319. [NeoSmart/Easy Window Switcher](https://neosmart.net/Software/Changelog/26) [Freemium]
320. [NeoSmart/EasyBCD](https://neosmart.net/Software/Changelog/1) [Freemium]
321. [NeoSmart/iReboot](https://neosmart.net/Software/Changelog/11) [Freemium]
322. [NeoSmart/LastPass to 1Password Conversion Utility](https://neosmart.net/Software/Changelog/28)
323. [NeoSmart/ln-win](https://neosmart.net/Software/Changelog/16)
324. [NeoSmart/NST Downloader](https://neosmart.net/Software/Changelog/15)
325. [NeoSmart/RunInBash](https://neosmart.net/Software/Changelog/27)
326. [NeoSmart/TimeTweaker](https://neosmart.net/Software/Changelog/5)
327. [NeoSmart/ToolTipFixer](https://neosmart.net/Software/Changelog/10)
328. [NeoSmart/TweakUI](https://neosmart.net/Software/Changelog/6)
329. [NeoSmart/uptime](https://neosmart.net/Software/Changelog/29)
330. [NeoSmart/Windows 10 Rollback Utility](https://neosmart.net/Software/Changelog/23) :hand:
331. [NeoSmart/Windows OEM Product Key Tool](https://neosmart.net/Software/Changelog/22)
332. [NetBeans](https://netbeans.apache.org/download/index.html)
333. [Nextcloud](https://nextcloud.com/install/)
334. [Nimbus Note](https://nimbusweb.me/nimbus-note-windows.php) [Free Personal]
336. [NirSoft/Access PassView](https://www.nirsoft.net/utils/accesspv.html)
337. [NirSoft/ActiveX Compatibility Manager](https://www.nirsoft.net/utils/acm.html)
338. [NirSoft/ActiveXHelper](https://www.nirsoft.net/utils/axhelper.html)
339. [NirSoft/AdapterWatch](https://www.nirsoft.net/utils/awatch.html)
340. [NirSoft/AddrView](https://www.nirsoft.net/utils/addrview.html)
341. [NirSoft/AdvancedRun](https://www.nirsoft.net/utils/advanced_run.html)
342. [NirSoft/AllThreadsView](https://www.nirsoft.net/utils/all_threads_view.html)
343. [NirSoft/AlternateStreamView](https://www.nirsoft.net/utils/alternate_data_streams.html)
344. [NirSoft/AltStreamDump](https://www.nirsoft.net/utils/alternate_stream_dump.html)
345. [NirSoft/AppAudioConfig](https://www.nirsoft.net/utils/app_audio_config.html)
346. [NirSoft/AppCompatibilityView](https://www.nirsoft.net/utils/app_compatibility_view.html)
347. [NirSoft/AppCrashView](https://www.nirsoft.net/utils/app_crash_view.html)
348. [NirSoft/AppNetworkCounter](https://www.nirsoft.net/utils/app_network_counter.html)
349. [NirSoft/AppReadWriteCounter](https://www.nirsoft.net/utils/app_read_write_counter.html)
350. [NirSoft/AsterWin IE](https://www.nirsoft.net/utils/asterie.html)
351. [NirSoft/AtNow](https://www.nirsoft.net/utils/atnow.html)
352. [NirSoft/BatteryInfoView](https://www.nirsoft.net/utils/battery_information_view.html)
353. [NirSoft/BlueScreenView](https://www.nirsoft.net/utils/blue_screen_view.html)
354. [NirSoft/BluetoothCL](https://www.nirsoft.net/utils/bluetoothcl.html)
355. [NirSoft/BluetoothLogView](https://www.nirsoft.net/utils/bluetooth_log_view.html)
356. [NirSoft/BluetoothView](https://www.nirsoft.net/utils/bluetooth_viewer.html)
357. [NirSoft/BrowserAddonsView](https://www.nirsoft.net/utils/web_browser_addons_view.html)
358. [NirSoft/BrowsingHistoryView](https://www.nirsoft.net/utils/browsing_history_view.html)
359. [NirSoft/BulkFileChanger](https://www.nirsoft.net/utils/bulk_file_changer.html)
360. [NirSoft/BulletsPassView](https://www.nirsoft.net/utils/bullets_password_view.html)
361. [NirSoft/ChromeCacheView](https://www.nirsoft.net/utils/chrome_cache_view.html)
362. [NirSoft/ChromeCookiesView](https://www.nirsoft.net/utils/chrome_cookies_view.html)
363. [NirSoft/ChromeHistoryView](https://www.nirsoft.net/utils/chrome_history_view.html)
364. [NirSoft/ChromePass](https://www.nirsoft.net/utils/chromepass.html)
365. [NirSoft/CleanAfterMe](https://www.nirsoft.net/utils/clean_after_me.html)
366. [NirSoft/Clipboardic](https://www.nirsoft.net/utils/clipboardic.html)
367. [NirSoft/Content Advisor Password Remover](https://www.nirsoft.net/utils/conadvpass.html)
368. [NirSoft/ControlMyMonitor](https://www.nirsoft.net/utils/control_my_monitor.html)
369. [NirSoft/CountryTraceRoute](https://www.nirsoft.net/utils/country_traceroute.html)
370. [NirSoft/CredentialsFileView](https://www.nirsoft.net/utils/credentials_file_view.html)
371. [NirSoft/CSVFileView](https://www.nirsoft.net/utils/csv_file_view.html)
372. [NirSoft/CurrPorts](https://www.nirsoft.net/utils/cports.html)
373. [NirSoft/CurrProcess](https://www.nirsoft.net/utils/cprocess.html)
374. [NirSoft/CustomExplorerToolbar](https://www.nirsoft.net/utils/custom_explorer_toolbar.html)
375. [NirSoft/CustomizeIE](https://www.nirsoft.net/utils/ctie.html)
376. [NirSoft/DataProtectionDecryptor](https://www.nirsoft.net/utils/dpapi_data_decryptor.html)
377. [NirSoft/DeviceIOView](https://www.nirsoft.net/utils/device_io_view.html)
378. [NirSoft/DevManView](https://www.nirsoft.net/utils/device_manager_view.html)
379. [NirSoft/Dialupass](https://www.nirsoft.net/utils/dialupass.html)
380. [NirSoft/DiskCountersView](https://www.nirsoft.net/utils/disk_counters_view.html)
381. [NirSoft/DiskSmartView](https://www.nirsoft.net/utils/disk_smart_view.html)
382. [NirSoft/DLL Export Viewer](https://www.nirsoft.net/utils/dll_export_viewer.html)
383. [NirSoft/DNSDataView](https://www.nirsoft.net/utils/dns_records_viewer.html)
384. [NirSoft/DNSQuerySniffer](https://www.nirsoft.net/utils/dns_query_sniffer.html)
385. [NirSoft/DomainHostingView](https://www.nirsoft.net/utils/domain_hosting_view.html)
386. [NirSoft/DotNetResourcesExtract](https://www.nirsoft.net/utils/dot_net_resources_extract.html)
387. [NirSoft/DownTester](https://www.nirsoft.net/utils/download_speed_tester.html)
388. [NirSoft/DriveLetterView](https://www.nirsoft.net/utils/drive_letter_view.html)
389. [NirSoft/DriverView](https://www.nirsoft.net/utils/driverview.html)
390. [NirSoft/DumpEDID](https://www.nirsoft.net/utils/dump_edid.html)
391. [NirSoft/EdgeCookiesView](https://www.nirsoft.net/utils/edge_cookies_view.html)
392. [NirSoft/EncryptedRegView](https://www.nirsoft.net/utils/encrypted_registry_view.html)
393. [NirSoft/Enterprise Manager PassView](https://www.nirsoft.net/utils/empv.html)
394. [NirSoft/ESEDatabaseView](https://www.nirsoft.net/utils/ese_database_view.html)
395. [NirSoft/EventLogChannelsView](https://www.nirsoft.net/utils/event_log_channels_view.html)
396. [NirSoft/EventLogSourcesView](https://www.nirsoft.net/utils/event_log_sources_view.html)
397. [NirSoft/ExecutedProgramsList](https://www.nirsoft.net/utils/executed_programs_list.html)
398. [NirSoft/ExeInfo](https://www.nirsoft.net/utils/exeinfo.html)
399. [NirSoft/ExifDataView](https://www.nirsoft.net/utils/exif_data_view.html)
400. [NirSoft/FastResolver](https://www.nirsoft.net/utils/fastresolver.html)
401. [NirSoft/FavoritesView](https://www.nirsoft.net/utils/faview.html)
402. [NirSoft/FBCacheView](https://www.nirsoft.net/utils/facebook_cache_viewer.html)
403. [NirSoft/FileAccessErrorView](https://www.nirsoft.net/utils/file_access_error_view.html)
404. [NirSoft/FileActivityWatch](https://www.nirsoft.net/utils/file_activity_watch.html)
405. [NirSoft/FileTypesMan](https://www.nirsoft.net/utils/file_types_manager.html)
406. [NirSoft/FirefoxDownloadsView](https://www.nirsoft.net/utils/firefox_downloads_view.html)
407. [NirSoft/FlashCookiesView](https://www.nirsoft.net/utils/flash_cookies_view.html)
408. [NirSoft/FolderChangesView](https://www.nirsoft.net/utils/folder_changes_view.html)
409. [NirSoft/FoldersReport](https://www.nirsoft.net/utils/folrep.html)
410. [NirSoft/FolderTimeUpdate](https://www.nirsoft.net/utils/folder_time_update.html)
411. [NirSoft/FullEventLogView](https://www.nirsoft.net/utils/full_event_log_view.html)
412. [NirSoft/GACView](https://www.nirsoft.net/dot_net_tools/gac_viewer.html)
413. [NirSoft/GDIView](https://www.nirsoft.net/utils/gdi_handles.html)
414. [NirSoft/GUIPropView](https://www.nirsoft.net/utils/gui_prop_view.html)
415. [NirSoft/HandleCountersView](https://www.nirsoft.net/utils/handle_counters_view.html)
416. [NirSoft/HashMyFiles](https://www.nirsoft.net/utils/hash_my_files.html)
417. [NirSoft/HeapMemView](https://www.nirsoft.net/utils/heap_memory_view.html)
418. [NirSoft/HostedNetworkStarter](https://www.nirsoft.net/utils/wifi_hotspot_starter.html)
419. [NirSoft/HotKeysList](https://www.nirsoft.net/utils/hot_keys_list.html)
420. [NirSoft/HTMLAsText](https://www.nirsoft.net/utils/htmlastext.html)
421. [NirSoft/HtmlDocEdit](https://www.nirsoft.net/utils/html_doc_edit.html)
422. [NirSoft/HTTPNetworkSniffer](https://www.nirsoft.net/utils/http_network_sniffer.html)
423. [NirSoft/IconsExtract](https://www.nirsoft.net/utils/iconsext.html)
424. [NirSoft/IE PassView](https://www.nirsoft.net/utils/internet_explorer_password.html)
425. [NirSoft/IECacheView](https://www.nirsoft.net/utils/ie_cache_viewer.html)
426. [NirSoft/IECompo](https://www.nirsoft.net/utils/iecompo.html)
427. [NirSoft/IECookiesView](https://www.nirsoft.net/utils/iecookies.html)
428. [NirSoft/IEDesignMode](https://www.nirsoft.net/utils/ie_design_mode.html)
429. [NirSoft/IEHistoryView](https://www.nirsoft.net/utils/iehv.html)
430. [NirSoft/ImageCacheViewer](https://www.nirsoft.net/utils/image_cache_viewer.html)
431. [NirSoft/InjectedDLL](https://www.nirsoft.net/utils/injected_dll.html)
432. [NirSoft/InsideClipboard](https://www.nirsoft.net/utils/inside_clipboard.html)
433. [NirSoft/InstalledCodec](https://www.nirsoft.net/utils/installed_codec.html)
434. [NirSoft/InstalledDriversList](https://www.nirsoft.net/utils/installed_drivers_list.html)
435. [NirSoft/InstalledPackagesView](https://www.nirsoft.net/utils/installed_packages_view.html)
436. [NirSoft/IPInfoOffline](https://www.nirsoft.net/utils/ip_country_info_offline.html)
437. [NirSoft/IPNetInfo](https://www.nirsoft.net/utils/ipnetinfo.html)
438. [NirSoft/JavaScript Animator Express](https://www.nirsoft.net/utils/jsae.html)
439. [NirSoft/JumpListsView](https://www.nirsoft.net/utils/jump_lists_view.html)
440. [NirSoft/KeyboardStateView](https://www.nirsoft.net/utils/keyboard_state_view.html)
441. [NirSoft/LastActivityView](https://www.nirsoft.net/utils/computer_activity_view.html)
442. [NirSoft/LiveContactsView](https://www.nirsoft.net/utils/live_messenger_contacts.html)
443. [NirSoft/LiveTcpUdpWatch](https://www.nirsoft.net/utils/live_tcp_udp_watch.html)
444. [NirSoft/LoadedDllsView](https://www.nirsoft.net/utils/loaded_dll_view.html)
445. [NirSoft/LSASecretsDump](https://www.nirsoft.net/utils/lsa_secrets_dump.html)
446. [NirSoft/LSASecretsView](https://www.nirsoft.net/utils/lsa_secrets_view.html)
447. [NirSoft/MACAddressView](https://www.nirsoft.net/utils/mac_address_lookup_find.html)
448. [NirSoft/Mail PassView](https://www.nirsoft.net/utils/mailpv.html)
449. [NirSoft/MessenPass](https://www.nirsoft.net/utils/mspass.html)
450. [NirSoft/MetarWeather](https://www.nirsoft.net/utils/mweather.html)
451. [NirSoft/MIMEView](https://www.nirsoft.net/utils/mimeview.html)
452. [NirSoft/MMCSnapInsView](https://www.nirsoft.net/utils/mmc_snapins_view.html)
453. [NirSoft/MonitorInfoView](https://www.nirsoft.net/utils/monitor_info_view.html)
454. [NirSoft/MUICacheView](https://www.nirsoft.net/utils/muicache_view.html)
455. [NirSoft/MultiMonitorTool](https://www.nirsoft.net/utils/multi_monitor_tool.html)
456. [NirSoft/MyEventViewer](https://www.nirsoft.net/utils/my_event_viewer.html)
457. [NirSoft/MyLastSearch](https://www.nirsoft.net/utils/my_last_search.html)
458. [NirSoft/MZCacheView](https://www.nirsoft.net/utils/mozilla_cache_viewer.html)
459. [NirSoft/MZCookiesView](https://www.nirsoft.net/utils/mzcv.html)
460. [NirSoft/MZHistoryView](https://www.nirsoft.net/utils/mozilla_history_view.html)
461. [NirSoft/NetBScanner](https://www.nirsoft.net/utils/netbios_scanner.html)
462. [NirSoft/NetConnectChoose](https://www.nirsoft.net/utils/net_connect_choose.html)
463. [NirSoft/NetResView](https://www.nirsoft.net/utils/netresview.html)
464. [NirSoft/NetRouteView](https://www.nirsoft.net/utils/network_route_view.html)
465. [NirSoft/Network Password Recovery](https://www.nirsoft.net/utils/network_password_recovery.html)
466. [NirSoft/NetworkConnectLog](https://www.nirsoft.net/utils/network_connect_log.html)
467. [NirSoft/NetworkCountersWatch](https://www.nirsoft.net/utils/network_counters_watch.html)
468. [NirSoft/NetworkInterfacesView](https://www.nirsoft.net/utils/network_interfaces.html)
469. [NirSoft/NetworkLatencyView](https://www.nirsoft.net/utils/network_latency_view.html)
470. [NirSoft/NetworkOpenedFiles](https://www.nirsoft.net/utils/network_opened_files.html)
471. [NirSoft/NetworkTrafficView](https://www.nirsoft.net/utils/network_traffic_view.html)
472. [NirSoft/NetworkUsageView](https://www.nirsoft.net/utils/network_usage_view.html)
473. [NirSoft/NirCmd-CLI](https://www.nirsoft.net/utils/nircmd.html)
474. [NirSoft/NirCmd](https://www.nirsoft.net/utils/nircmd.html)
475. [NirSoft/NirExt](https://www.nirsoft.net/utils/nirext.html)
476. [NirSoft/NK2Edit](https://www.nirsoft.net/utils/outlook_nk2_edit.html)
477. [NirSoft/NTFSLinksView](https://www.nirsoft.net/utils/ntfs_links_view.html)
478. [NirSoft/OfficeIns](https://www.nirsoft.net/utils/officeins.html)
479. [NirSoft/OfflineRegistryFinder](https://www.nirsoft.net/utils/offline_registry_finder.html)
480. [NirSoft/OfflineRegistryView](https://www.nirsoft.net/utils/offline_registry_view.html)
481. [NirSoft/OpenedFilesView](https://www.nirsoft.net/utils/opened_files_view.html)
482. [NirSoft/OpenSaveFilesView](https://www.nirsoft.net/utils/open_save_files_view.html)
483. [NirSoft/OpenWithView](https://www.nirsoft.net/utils/open_with_view.html)
484. [NirSoft/OperaCacheView](https://www.nirsoft.net/utils/opera_cache_view.html)
485. [NirSoft/OperaPassView](https://www.nirsoft.net/utils/opera_password_recovery.html)
486. [NirSoft/OutlookAddressBookView](https://www.nirsoft.net/utils/outlook_address_book_view.html)
487. [NirSoft/OutlookAttachView](https://www.nirsoft.net/utils/outlook_attachment.html)
488. [NirSoft/OutlookStatView](https://www.nirsoft.net/utils/outlook_statistics.html)
489. [NirSoft/Password Security Scanner](https://www.nirsoft.net/utils/password_security_scanner.html)
490. [NirSoft/PasswordFox](https://www.nirsoft.net/utils/passwordfox.html)
491. [NirSoft/pcANYWHERE Hosts Scanner](https://www.nirsoft.net/utils/pcanyscan.html)
492. [NirSoft/PCAnywhere PassView](https://www.nirsoft.net/utils/pcanypass.html)
493. [NirSoft/PingInfoView](https://www.nirsoft.net/utils/multiple_ping_tool.html)
494. [NirSoft/PreviousFilesRecovery](https://www.nirsoft.net/utils/previous_files_recovery.html)
495. [NirSoft/ProcessActivityView](https://www.nirsoft.net/utils/process_activity_view.html)
496. [NirSoft/ProcessTCPSummary](https://www.nirsoft.net/utils/process_tcp_summary.html)
497. [NirSoft/ProcessThreadsView](https://www.nirsoft.net/utils/process_threads_view.html)
498. [NirSoft/ProduKey](https://www.nirsoft.net/utils/product_cd_key_viewer.html)
499. [NirSoft/Protected Storage PassView](https://www.nirsoft.net/utils/pspv.html)
500. [NirSoft/PstPassword](https://www.nirsoft.net/utils/pst_password.html)
501. [NirSoft/QuickSetDNS](https://www.nirsoft.net/utils/quick_set_dns.html)
502. [NirSoft/RecentFilesView](https://www.nirsoft.net/utils/recent_files_view.html)
503. [NirSoft/RegDllView](https://www.nirsoft.net/utils/registered_dll_view.html)
504. [NirSoft/RegFileExport](https://www.nirsoft.net/utils/registry_file_offline_export.html)
505. [NirSoft/RegFromApp](https://www.nirsoft.net/utils/reg_file_from_application.html)
506. [NirSoft/RegistryChangesView](https://www.nirsoft.net/utils/registry_changes_view.html)
507. [NirSoft/RegScanner](https://www.nirsoft.net/utils/regscanner.html)
508. [NirSoft/Remote Desktop PassView](https://www.nirsoft.net/utils/remote_desktop_password.html)
509. [NirSoft/ResourcesExtract](https://www.nirsoft.net/utils/resources_extract.html)
510. [NirSoft/RouterPassView](https://www.nirsoft.net/utils/router_password_recovery.html)
511. [NirSoft/RTMPDumpHelper](https://www.nirsoft.net/utils/rtmp_dump_helper.html)
512. [NirSoft/RunAsDate](https://www.nirsoft.net/utils/run_as_date.html)
513. [NirSoft/RunFromProcess](https://www.nirsoft.net/utils/run_from_process.html)
514. [NirSoft/SafariCacheView](https://www.nirsoft.net/utils/safari_cache_view.html)
515. [NirSoft/SafariHistoryView](https://www.nirsoft.net/utils/safari_history_view.html)
516. [NirSoft/SearchFilterView](https://www.nirsoft.net/utils/search_filter_view.html)
517. [NirSoft/SearchMyFiles](https://www.nirsoft.net/utils/search_my_files.html)
518. [NirSoft/SecuritySoftView](https://www.nirsoft.net/utils/security_software_view.html)
519. [NirSoft/SeqDownload](https://www.nirsoft.net/utils/seqdownload.html)
520. [NirSoft/ServiWin](https://www.nirsoft.net/utils/serviwin.html)
521. [NirSoft/ShadowCopyView](https://www.nirsoft.net/utils/shadow_copy_view.html)
522. [NirSoft/ShellBagsView](https://www.nirsoft.net/utils/shell_bags_view.html)
523. [NirSoft/ShellExView](https://www.nirsoft.net/utils/shexview.html)
524. [NirSoft/ShellMenuNew](https://www.nirsoft.net/utils/shell_menu_new.html)
525. [NirSoft/ShellMenuView](https://www.nirsoft.net/utils/shell_menu_view.html)
526. [NirSoft/ShortcutsMan](https://www.nirsoft.net/utils/shman.html)
527. [NirSoft/SimpleProgramDebugger](https://www.nirsoft.net/utils/simple_program_debugger.html)
528. [NirSoft/SimpleWMIView](https://www.nirsoft.net/utils/simple_wmi_view.html)
529. [NirSoft/SiteShoter](https://www.nirsoft.net/utils/web_site_screenshot.html)
530. [NirSoft/SkypeContactsView](https://www.nirsoft.net/utils/skype_contacts_view.html)
531. [NirSoft/SkypeLogView](https://www.nirsoft.net/utils/skype_log_view.html)
532. [NirSoft/SmartSniff](https://www.nirsoft.net/utils/smsniff.html)
533. [NirSoft/SniffPass](https://www.nirsoft.net/utils/password_sniffer.html)
534. [NirSoft/SocketSniff](https://www.nirsoft.net/utils/socket_sniffer.html)
535. [NirSoft/SoundVolumeView](https://www.nirsoft.net/utils/sound_volume_view.html)
536. [NirSoft/SpecialFoldersView](https://www.nirsoft.net/utils/special_folders_view.html)
537. [NirSoft/StartBlueScreen](https://www.nirsoft.net/utils/start_blue_screen.html)
538. [NirSoft/SysExporter](https://www.nirsoft.net/utils/sysexp.html)
539. [NirSoft/TableTextCompare](https://www.nirsoft.net/utils/csv_file_comparison.html)
540. [NirSoft/TagsReport](https://www.nirsoft.net/utils/tagsrep.html)
541. [NirSoft/TaskSchedulerView](https://www.nirsoft.net/utils/task_scheduler_view.html)
542. [NirSoft/TcpLogView](https://www.nirsoft.net/utils/tcp_log_view.html)
543. [NirSoft/TimeZonesView](https://www.nirsoft.net/utils/time_zones_view.html)
544. [NirSoft/TurnedOnTimesView](https://www.nirsoft.net/utils/computer_turned_on_times.html)
545. [NirSoft/TurnFlash](https://www.nirsoft.net/utils/tflash.html)
546. [NirSoft/TurnFlash2](https://www.nirsoft.net/utils/tflash2.html)
547. [NirSoft/UninstallView](https://www.nirsoft.net/utils/uninstall_view.html)
548. [NirSoft/URLProtocolView](https://www.nirsoft.net/utils/url_protocol_view.html)
549. [NirSoft/URLStringGrabber](https://www.nirsoft.net/utils/url_string_grabber.html)
550. [NirSoft/USBDeview](https://www.nirsoft.net/utils/usb_devices_view.html)
551. [NirSoft/USBLogView](https://www.nirsoft.net/utils/usb_log_view.html)
552. [NirSoft/UserAssistView](https://www.nirsoft.net/utils/userassist_view.html)
553. [NirSoft/UserProfilesView](https://www.nirsoft.net/utils/user_profiles_view.html)
554. [NirSoft/VaultPasswordView](https://www.nirsoft.net/utils/vault_password_view.html)
555. [NirSoft/VideoCacheView](https://www.nirsoft.net/utils/video_cache_view.html)
556. [NirSoft/VNCPassView](https://www.nirsoft.net/utils/vnc_password.html)
557. [NirSoft/Volumouse](https://www.nirsoft.net/utils/volumouse.html)
558. [NirSoft/WakeMeOnLan](https://www.nirsoft.net/utils/wake_on_lan.html)
559. [NirSoft/WebBrowserPassView](https://www.nirsoft.net/utils/web_browser_password.html)
560. [NirSoft/WebCacheImageInfo](https://www.nirsoft.net/utils/web_cache_image_info.html)
561. [NirSoft/WebCamImageSave](https://www.nirsoft.net/utils/web_cam_image_capture.html)
562. [NirSoft/WebCookiesSniffer](https://www.nirsoft.net/utils/web_cookies_sniffer.html)
563. [NirSoft/WebSiteSniffer](https://www.nirsoft.net/utils/web_site_sniffer.html)
564. [NirSoft/WebVideoCap](https://www.nirsoft.net/utils/web_video_capture.html)
565. [NirSoft/WhatInStartup](https://www.nirsoft.net/utils/what_run_in_startup.html)
566. [NirSoft/WhatIsHang](https://www.nirsoft.net/utils/what_is_hang.html)
567. [NirSoft/WhoisCL](https://www.nirsoft.net/utils/whoiscl.html)
568. [NirSoft/WhoIsConnectedSniffer](https://www.nirsoft.net/utils/who_is_connected_sniffer.html)
569. [NirSoft/WhoisThisDomain](https://www.nirsoft.net/utils/whois_this_domain.html)
570. [NirSoft/WhosIP](https://www.nirsoft.net/utils/whosip.html)
571. [NirSoft/WifiChannelMonitor](https://www.nirsoft.net/utils/wifi_channel_monitor.html)
572. [NirSoft/WifiHistoryView](https://www.nirsoft.net/utils/wifi_history_view.html)
573. [NirSoft/WifiInfoView](https://www.nirsoft.net/utils/wifi_information_view.html)
574. [NirSoft/Win9x PassView](https://www.nirsoft.net/utils/win9xpv.html)
575. [NirSoft/WinCrashReport](https://www.nirsoft.net/utils/application_crash_report.html)
576. [NirSoft/WinExplorer](https://www.nirsoft.net/utils/winexp.html)
577. [NirSoft/WinFontsView](https://www.nirsoft.net/utils/windows_fonts_viewer.html)
578. [NirSoft/WinLister](https://www.nirsoft.net/utils/winlister.html)
579. [NirSoft/WinLogOnView](https://www.nirsoft.net/utils/windows_log_on_times_view.html)
580. [NirSoft/WinPrefetchView](https://www.nirsoft.net/utils/win_prefetch_view.html)
581. [NirSoft/WinsockServicesView](https://www.nirsoft.net/utils/winsock_service_providers.html)
582. [NirSoft/WinUpdatesList](https://www.nirsoft.net/utils/wul.html)
583. [NirSoft/Wireless Network Watcher](https://www.nirsoft.net/utils/wireless_network_watcher.html)
584. [NirSoft/WirelessConnectionInfo](https://www.nirsoft.net/utils/wireless_connection_information.html)
585. [NirSoft/WirelessKeyView](https://www.nirsoft.net/utils/wireless_key.html)
586. [NirSoft/WirelessNetConsole](https://www.nirsoft.net/utils/wireless_net_console.html)
587. [NirSoft/WirelessNetView](https://www.nirsoft.net/utils/wireless_network_view.html)
588. [NirSoft/ZipInstaller](https://www.nirsoft.net/utils/zipinst.html)
589. [NixNote](https://sourceforge.net/projects/nevernote/files)
590. [Nodejs-LTS](https://nodejs.org/en/download/)
591. [Nodejs](https://nodejs.org/en/download/current/)
592. [notepad++](https://notepad-plus-plus.org/download/)
593. [notepad2-mod](https://github.com/XhmikosR/notepad2-mod/releases/latest)
594. [Notezilla](https://www.conceptworld.com/Notezilla/Portable) :money_with_wings:
595. [Notion](https://www.notion.so/desktop) [Free Personal]
597. [NTWind/Alt-Tab Terminator](https://www.ntwind.com/software/alttabter.html)
598. [NTWind/Bad Application](https://www.ntwind.com/software/utilities/badapp.html)
599. [NTWind/Close All](https://www.ntwind.com/software/utilities/close-all.html)
600. [NTWind/Hidden Start](https://www.ntwind.com/software/hstart.html) :money_with_wings:
601. [NTWind/Sticky Previews](https://www.ntwind.com/software/sticky-previews.html) :money_with_wings:
602. [NTWind/Visual Subst](https://www.ntwind.com/software/utilities/visual-subst.html)
603. [NTWind/WinCam](https://www.ntwind.com/software/wincam.html) :money_with_wings:
604. [NTWind/WindowSpace](https://www.ntwind.com/software/windowspace.html) :money_with_wings:
605. [NTWind/WinSnap](https://www.ntwind.com/software/winsnap.html) :money_with_wings:
606. [odrive Sync](https://forum.odrive.com/c/release-notes) [Free Personal]
607. [ODrive](https://github.com/liberodark/ODrive/releases/latest)
608. [Office Tool Plus](https://mirrors.yuntu.ca/office-tool/)
609. [OnTopReplica](https://github.com/LorenzCK/OnTopReplica/releases/latest)
610. [Open Broadcaster Software](https://obsproject.com/download)
611. [OpenShot](https://github.com/OpenShot/openshot-qt/releases/latest)
612. [OpenVPN](https://openvpn.net/community-downloads/) :airplane:
613. [Opera](https://biblprog.com/en/opera/download/)
614. [Outlook Google Calendar Sync](https://github.com/phw198/OutlookGoogleCalendarSync/releases/latest)
615. [Paint.NET](https://www.dotpdn.com/downloads/pdn.html)
616. [Pale Moon](https://www.palemoon.org/)
617. [PasteEx](https://github.com/huiyadanli/PasteEx/releases/latest)
618. [PeaZip](https://github.com/giorgiotani/PeaZip/releases/latest)
619. [Persepolis Download Manager](https://github.com/persepolisdm/persepolis/releases/latest)
620. [PicGo](https://github.com/Molunerfinn/PicGo/releases/latest)
621. [PicoTorrent](https://github.com/picotorrent/picotorrent/releases/latest)
622. [PicPick](https://picpick.app/zh/download) [Freemium]
623. [Pidgin](https://www.pidgin.im/)
624. [Piggydb](https://sourceforge.net/projects/piggydb/files/)
625. [PiP-Tool](https://github.com/LionelJouin/PiP-Tool/releases/latest)
627. [Piriform/CCleaner](https://www.ccleaner.com/ccleaner/download) [Free Personal]
628. [Piriform/Defraggler](https://www.ccleaner.com/defraggler/download) [Freemium]
629. [Piriform/Recuva](https://www.ccleaner.com/recuva/download) [Free Personal]
630. [Piriform/Speccy](https://www.ccleaner.com/speccy/download) [Free Personal]
631. [PlayTime](http://www.dcmembers.com/skwire/download/playtime/)
632. [PlexMediaPlayer](https://plex.tv/api/downloads/3.json)
633. [PlexMediaServer](https://plex.tv/api/downloads/1.json)
634. [PNotes](https://pnotes.sourceforge.io/index.php?page=5)
635. [PNotes.NET](https://pnotes.sourceforge.io/index.php?page=5)
636. [Postman](https://dl.pstmn.io/api/version/notes?channel=stable) [Free Personal]
637. [PotPlayer](https://potplayer.daum.net/)
638. [Private Tunnel](https://www.privatetunnel.com/apps/) [Free Personal]
639. [PrivaZer](https://privazer.com/download.php)
640. [ProtonVPN](https://protonvpn.com/download/win-update.json) [Free Personal] :airplane:
641. [Proxifier](https://www.proxifier.com/) :money_with_wings:
642. [Psiphon](https://www.filehorse.com/download-psiphon/download/)
643. [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
644. [PyScripter](https://sourceforge.net/projects/pyscripter/files/)
645. [Python](https://www.python.org/downloads/windows/)
646. [Python2](https://www.python.org/downloads/windows/)
647. [Q-Dir](http://www.softwareok.com/?seite=Freeware/Q-Dir/History)
648. [qBittorrent](https://www.qbittorrent.org/download.php)
649. [QOwnNotes](https://www.qownnotes.org/installation)
650. [QQ](https://im.qq.com/pcqq/) :hand:
651. [QTranslate](https://quest-app.appspot.com/)
652. [Quick Access Popup](https://www.quickaccesspopup.com/)
653. [QuickLook](https://github.com/QL-Win/QuickLook/releases/latest)
654. [RaiDrive](https://www.raidrive.com/download/) :hand:
655. [Rapid Environment Editor](https://www.rapidee.com/en/download)
656. [Rclone](https://github.com/ncw/rclone/releases/latest)
657. [RecentX](https://www.conceptworld.com/RecentX/RevisionHistory) :money_with_wings:
658. [Registry Workshop](http://www.torchsoft.com/en/download.html) :money_with_wings:
659. [RegSeeker](http://www.hoverdesk.net/download.php) [Freemium]
660. [ReMouse](https://www.remouse.com/downloads.html) [Free Personal]
661. [Resonic](https://resonic.at/download)
662. [Resource Hacker](http://www.angusj.com/resourcehacker/)
663. [Resource Tuner](http://www.restuner.com/news-history.htm) :money_with_wings:
664. [Right Click Enhancer](https://rbsoft.org/downloads/right-click-enhancer/rce-changelog.html) [Free Personal]
665. [Rocket.Chat](https://github.com/RocketChat/Rocket.Chat.Electron/releases/latest)
666. [Rufus](https://rufus.ie/en_IE.html)
667. [ScreenToGif](https://github.com/NickeManarin/ScreenToGif/releases/latest)
668. [shadowsocks-magic](https://github.com/ihciah/go-shadowsocks-magic/releases/latest)
669. [shadowsocks](https://github.com/shadowsocks/shadowsocks-windows/releases)
670. [shadowsocksr-csharp](https://github.com/shadowsocksrr/shadowsocksr-csharp/releases)
671. [shadowsocksr-electron](https://github.com/erguotou520/electron-ssr/releases/latest)
672. [Shareaza](http://shareaza.sourceforge.net/?id=download)
673. [ShareX](https://github.com/ShareX/ShareX/releases/latest)
674. [Shellbag Analyzer & Cleaner](https://privazer.com/download-shellbag-analyzer-shellbag-cleaner.php)
675. [Shuax-FireDoge](https://shuax.com/project/firedoge/)
676. [Shuax-GreenChrome](https://shuax.com/project/greenchrome/)
677. [Shuax-MouseInc](https://shuax.com/project/mouseinc/)
678. [Simplenote](https://github.com/Automattic/simplenote-electron/releases/latest)
679. [Skype](http://skype.gmw.cn/down/skype-for-windows-desktop.html)
680. [Slack](https://slack.com/downloads/windows) [Free Personal]
681. [SmartGit](https://www.syntevo.com/smartgit/download/) [Freemium]
682. [SMath Studio](https://en.smath.com/view/SMathStudio/summary)
683. [SMPlayer](https://sourceforge.net/projects/smplayer/files/SMPlayer/)
684. [SoftEtherVPN](https://github.com/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest) :hand:
685. [SoLoud](http://sol.gfxile.net/soloud/downloads.html)
687. [Sordum/AskAdmin](https://www.sordum.org/7941/)
688. [Sordum/Backup Start Menu Layout](https://www.sordum.org/10997/)
689. [Sordum/BlueLife Hosts Editor](https://www.sordum.org/8266/)
690. [Sordum/BlueLife KeyFreeze](https://www.sordum.org/7921/)
691. [Sordum/Bluetooth Version finder](https://www.sordum.org/10772/)
692. [Sordum/Bpuzzle](https://www.sordum.org/8058/)
693. [Sordum/Copy IP](https://www.sordum.org/9201/)
694. [Sordum/Defender Control](https://www.sordum.org/9480/)
695. [Sordum/Defender Injector](https://www.sordum.org/10636/)
696. [Sordum/Desktop.ini Editor](https://www.sordum.org/10084/)
697. [Sordum/Dns Angel](https://www.sordum.org/8127/)
698. [Sordum/Dns Jumper](https://www.sordum.org/7952/)
699. [Sordum/Dns Lock](https://www.sordum.org/9432/)
700. [Sordum/Drive Letter Changer](https://www.sordum.org/8501/)
701. [Sordum/Easy Context Menu](https://www.sordum.org/7615/)
702. [Sordum/Easy Service Optimizer](https://www.sordum.org/8637/)
703. [Sordum/Edge Blocker](https://www.sordum.org/9312/)
704. [Sordum/Find Prime Numbers](https://www.sordum.org/9207/)
705. [Sordum/Firewall App Blocker](https://www.sordum.org/8125/)
706. [Sordum/Fix Print Spooler](https://www.sordum.org/9199/)
707. [Sordum/Folder Painter](https://www.sordum.org/10124/)
708. [Sordum/Hibernate Enable or Disable](https://www.sordum.org/9502/)
709. [Sordum/Hide From Uninstall List](https://www.sordum.org/11081/)
710. [Sordum/Net Disabler](https://www.sordum.org/9660/)
711. [Sordum/Ntfs Drive Protection](https://www.sordum.org/8117/)
712. [Sordum/PowerRun](https://www.sordum.org/9416/)
713. [Sordum/Qemu Simple Boot](https://www.sordum.org/7763/)
714. [Sordum/Ratool](https://www.sordum.org/8104/)
715. [Sordum/Rebuild Shell Icon Cache](https://www.sordum.org/9194/)
716. [Sordum/Reduce Memory](https://www.sordum.org/9197/)
717. [Sordum/Reg Converter](https://www.sordum.org/8478/)
718. [Sordum/Registry Key Jumper](https://www.sordum.org/8110/)
719. [Sordum/ReIcon](https://www.sordum.org/8366/)
720. [Sordum/Reset Data Usage](https://www.sordum.org/9817/)
721. [Sordum/Restart Explorer](https://www.sordum.org/9192/)
722. [Sordum/Router Default Password](https://www.sordum.org/10411/)
723. [Sordum/RunAsTool](https://www.sordum.org/8727/)
724. [Sordum/SendTo Menu Editor](https://www.sordum.org/10830/)
725. [Sordum/Show Desktop Icons](https://www.sordum.org/9341/)
726. [Sordum/Show Disk Partition Style](https://www.sordum.org/9307/)
727. [Sordum/Shut Down Windows](https://www.sordum.org/9205/)
728. [Sordum/Simple Run Blocker](https://www.sordum.org/8486/)
729. [Sordum/Simple VHD  Manager](https://www.sordum.org/8705/)
730. [Sordum/Sordum Monitor Off](https://www.sordum.org/10104/)
731. [Sordum/Sordum Random Password Generator](https://www.sordum.org/10946/)
732. [Sordum/Streams Remover](https://www.sordum.org/11263/)
733. [Sordum/Temp Cleaner](https://www.sordum.org/9190/)
734. [Sordum/Tunnel Adapter Microsoft 6to4 Adapter Remover](https://www.sordum.org/6423/)
735. [Sordum/Update Time](https://www.sordum.org/9203/)
736. [Sordum/VHD For Context Menu](https://www.sordum.org/9209/)
737. [Sordum/WebCam On-Off](https://www.sordum.org/8585/)
738. [Sordum/Win10 Settings Blocker](https://www.sordum.org/11128/)
739. [Sordum/Windows TopMost Control](https://www.sordum.org/9182/)
740. [Sordum/Windows Update Blocker](https://www.sordum.org/9470/)
741. [SourceTree](https://www.sourcetreeapp.com/)
742. [SpaceSniffer](http://www.uderzo.it/main_products/space_sniffer/download_alt.html)
743. [SpeedCrunch](http://speedcrunch.org/download.html)
744. [SpeedyFox](https://www.crystalidea.com/speedyfox)
745. [SQLite](https://sqlite.org/download.html)
746. [Standard Notes](https://github.com/standardnotes/desktop/releases/latest)
747. [Steam](https://biblprog.com/en/steam/download/)
748. [Stremio](https://www.stremio.com/downloads) [Freemium]
749. [Sublime Text](http://www.sublimetext.com/3) [Free Personal]
750. [Sumatra PDF](https://www.sumatrapdfreader.org/sumatra.js)
752. [Sysinternals/AccessChk](https://docs.microsoft.com/zh-cn/sysinternals/downloads/accesschk)
753. [Sysinternals/AccessEnum](https://docs.microsoft.com/zh-cn/sysinternals/downloads/accessenum)
754. [Sysinternals/Active Directory Explorer](https://docs.microsoft.com/zh-cn/sysinternals/downloads/adexplorer)
755. [Sysinternals/AdRestore](https://docs.microsoft.com/zh-cn/sysinternals/downloads/adrestore)
756. [Sysinternals/Autologon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/autologon)
757. [Sysinternals/Autoruns](https://docs.microsoft.com/zh-cn/sysinternals/downloads/autoruns)
758. [Sysinternals/BgInfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/bginfo)
759. [Sysinternals/BlueScreen](https://docs.microsoft.com/zh-cn/sysinternals/downloads/bluescreen)
760. [Sysinternals/CacheSet](https://docs.microsoft.com/zh-cn/sysinternals/downloads/cacheset)
761. [Sysinternals/ClockRes](https://docs.microsoft.com/zh-cn/sysinternals/downloads/clockres)
762. [Sysinternals/Contig](https://docs.microsoft.com/zh-cn/sysinternals/downloads/contig)
763. [Sysinternals/Coreinfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/coreinfo)
764. [Sysinternals/Ctrl2Cap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ctrl2cap)
765. [Sysinternals/DebugView](https://docs.microsoft.com/zh-cn/sysinternals/downloads/debugview)
766. [Sysinternals/Desktops](https://docs.microsoft.com/zh-cn/sysinternals/downloads/desktops)
767. [Sysinternals/Disk Usage](https://docs.microsoft.com/zh-cn/sysinternals/downloads/du)
768. [Sysinternals/Disk2vhd](https://docs.microsoft.com/zh-cn/sysinternals/downloads/disk2vhd)
769. [Sysinternals/DiskExt](https://docs.microsoft.com/zh-cn/sysinternals/downloads/diskext)
770. [Sysinternals/DiskMon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/diskmon)
771. [Sysinternals/DiskView](https://docs.microsoft.com/zh-cn/sysinternals/downloads/diskview)
772. [Sysinternals/EFSDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/efsdump)
773. [Sysinternals/FindLinks](https://docs.microsoft.com/zh-cn/sysinternals/downloads/findlinks)
774. [Sysinternals/Handle](https://docs.microsoft.com/zh-cn/sysinternals/downloads/handle)
775. [Sysinternals/Hex2dec](https://docs.microsoft.com/zh-cn/sysinternals/downloads/hex2dec)
776. [Sysinternals/Insight for Active Directory](https://docs.microsoft.com/zh-cn/sysinternals/downloads/adinsight)
777. [Sysinternals/Junction](https://docs.microsoft.com/zh-cn/sysinternals/downloads/junction)
778. [Sysinternals/LDMDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ldmdump)
779. [Sysinternals/ListDLLs](https://docs.microsoft.com/zh-cn/sysinternals/downloads/listdlls)
780. [Sysinternals/LiveKd](https://docs.microsoft.com/zh-cn/sysinternals/downloads/livekd)
781. [Sysinternals/LoadOrder](https://docs.microsoft.com/zh-cn/sysinternals/downloads/loadorder)
782. [Sysinternals/LogonSessions](https://docs.microsoft.com/zh-cn/sysinternals/downloads/logonsessions)
783. [Sysinternals/NotMyFault](https://docs.microsoft.com/zh-cn/sysinternals/downloads/notmyfault)
784. [Sysinternals/NTFSInfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ntfsinfo)
785. [Sysinternals/PageDefrag](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pagedefrag)
786. [Sysinternals/PendMovesand MoveFile](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pendmoves)
787. [Sysinternals/PipeList](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pipelist)
788. [Sysinternals/Portmon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/portmon)
789. [Sysinternals/ProcDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/procdump)
790. [Sysinternals/Process Explorer](https://docs.microsoft.com/zh-cn/sysinternals/downloads/process-explorer)
791. [Sysinternals/Process Monitor](https://docs.microsoft.com/zh-cn/sysinternals/downloads/procmon)
792. [Sysinternals/PsExec](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psexec)
793. [Sysinternals/PsFile](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psfile)
794. [Sysinternals/PsGetSid](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psgetsid)
795. [Sysinternals/PsInfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psinfo)
796. [Sysinternals/PsKill](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pskill)
797. [Sysinternals/PsList](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pslist)
798. [Sysinternals/PsLoggedOn](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psloggedon)
799. [Sysinternals/PsLogList](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psloglist)
800. [Sysinternals/PsPasswd](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pspasswd)
801. [Sysinternals/PsPing](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psping)
802. [Sysinternals/PsService](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psservice)
803. [Sysinternals/PsShutdown](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psshutdown)
804. [Sysinternals/PsSuspend](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pssuspend)
805. [Sysinternals/RAMMap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/rammap)
806. [Sysinternals/RegDelNull](https://docs.microsoft.com/zh-cn/sysinternals/downloads/regdelnull)
807. [Sysinternals/Registry Usage](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ru)
808. [Sysinternals/RegJump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/regjump)
809. [Sysinternals/RootkitRevealer](https://docs.microsoft.com/zh-cn/sysinternals/downloads/rootkit-revealer)
810. [Sysinternals/SDelete](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sdelete)
811. [Sysinternals/ShareEnum](https://docs.microsoft.com/zh-cn/sysinternals/downloads/shareenum)
812. [Sysinternals/ShellRunas](https://docs.microsoft.com/zh-cn/sysinternals/downloads/shellrunas)
813. [Sysinternals/Sigcheck](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sigcheck)
814. [Sysinternals/Streams](https://docs.microsoft.com/zh-cn/sysinternals/downloads/streams)
815. [Sysinternals/Strings](https://docs.microsoft.com/zh-cn/sysinternals/downloads/strings)
816. [Sysinternals/Sync](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sync)
817. [Sysinternals/Sysmon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sysmon)
818. [Sysinternals/TCPView](https://docs.microsoft.com/zh-cn/sysinternals/downloads/tcpview)
819. [Sysinternals/VMMap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/vmmap)
820. [Sysinternals/VolumeID](https://docs.microsoft.com/zh-cn/sysinternals/downloads/volumeid)
821. [Sysinternals/Whois](https://docs.microsoft.com/zh-cn/sysinternals/downloads/whois)
822. [Sysinternals/WinObj](https://docs.microsoft.com/zh-cn/sysinternals/downloads/winobj)
823. [Sysinternals/ZoomIt](https://docs.microsoft.com/zh-cn/sysinternals/downloads/zoomit)
824. [SysinternalsSuite](https://docs.microsoft.com/en-us/sysinternals/downloads/sysinternals-suite)
825. [System Ninja](https://singularlabs.com/software/system-ninja/confirm-download/) [Free Personal]
826. [TablacusExplorer](https://github.com/tablacus/TablacusExplorer/releases/latest)
827. [TagScanner](https://www.xdlab.ru/en/download.htm)
828. [TagSpaces](https://github.com/tagspaces/tagspaces/releases/latest) [Free Personal]
829. [Taskade](https://www.taskade.com/downloads)
830. [TeamSpeak](https://www.teamspeak.com/en/downloads/) [Free Personal]
831. [TeamViewer](https://community.teamviewer.com/t5/Change-Log-Windows/bd-p/Change_Log_Windows) [Freemium]
832. [Telegram](https://github.com/telegramdesktop/tdesktop/releases/latest)
833. [TestDisk](https://www.cgsecurity.org/wiki/TestDisk_Download)
834. [Textify](https://rammichael.com/downloads/textify_setup.exe?changelog)
835. [The Silver Searcher](https://github.com/k-takata/the_silver_searcher-win32/releases)
836. [TIM](https://tim.qq.com/download.html) :hand:
837. [Tixati](https://www.tixati.com/download/windows64.html)
838. [Tomboy](https://github.com/tomboy-notes/tomboy-ng/releases/latest)
839. [Tor Browser](https://www.torproject.org/download/download-easy.html.en) :airplane:
840. [TortoiseGit](https://tortoisegit.org/download/)
841. [TortoiseSVN](https://tortoisesvn.net/downloads.html)
842. [Total Commander](https://www.ghisler.com/download.htm) [Free Personal]
843. [Total Uninstall](https://www.martau.com/uninstaller-download.php) :money_with_wings:
844. [Touchpad Blocker](https://touchpad-blocker.com)
845. [Tower](https://www.git-tower.com/release-notes/windows) :money_with_wings:
846. [traccar](https://github.com/traccar/traccar/releases/latest)
847. [TrafficMonitor](https://github.com/zhongyang219/TrafficMonitor/releases/latest)
848. [Transmission](https://github.com/transmission/transmission/releases/latest)
849. [Traymond](https://github.com/fcFn/traymond/releases/latest)
850. [Tribler](https://github.com/Tribler/tribler/releases/latest)
851. [TunnelBear](https://www.tunnelbear.com/core/getVersionHistory?platform=pc) [Free Personal] :airplane:
852. [Turtl](https://github.com/turtl/desktop/releases/latest)
853. [Twitch](https://www.filehorse.com/download-twitch-desktop-app/download/) [Free Personal] :hand:
854. [Ubooquity](http://vaemendis.net/ubooquity/static2/download)
855. [ueli](https://github.com/oliverschwendener/ueli/releases/latest)
856. [uGet](https://ugetdm.com/downloads/windows/)
857. [UltraISO](https://www.ultraiso.com/download.html)
858. [ultraSurf](http://wujieliulan.com/) :airplane:
859. [Uncolored](https://github.com/n457/Uncolored/releases/latest)
860. [UNetbootin](https://github.com/unetbootin/unetbootin/releases/latest)
861. [Universal Extractor 2](https://github.com/Bioruebe/UniExtract2/releases/latest)
862. [Universal Extractor mod by koros aka ya158](http://forum.oszone.net/thread-295084.html) :hand:
863. [Unreal Commander](https://x-diesel.com/?download) [Free Personal]
864. [upx](https://github.com/upx/upx/releases/latest)
865. [uTorrent](http://blog.utorrent.com/releases/windows/) [Free Personal] :hand:
866. [v2ray](https://github.com/v2ray/v2ray-core/releases/latest)
867. [v2rayN](https://github.com/2dust/v2rayN/releases/latest)
868. [V2RayW](https://github.com/Cenmrev/V2RayW/releases)
869. [VcXsrv](https://sourceforge.net/projects/vcxsrv/files/)
870. [Velocity](https://velocity.silverlakesoftware.com/) [Free Personal]
871. [VerySleepy](https://github.com/VerySleepy/verysleepy/releases/latest)
872. [Video Download Manager](https://github.com/ingbyr/VDM/releases/latest)
873. [Visual Studio Code](https://github.com/Microsoft/vscode/releases)
874. [VLC Media Player](https://www.videolan.org/vlc/download-windows.html)
875. [VNote](https://github.com/tamlok/vnote/releases/latest)
876. [Volume2](https://irzyxa.blogspot.com/p/downloads.html)
877. [VPN Gate](https://www.vpngate.net/cn/download.aspx) :airplane:
878. [wagon](https://github.com/laravel-dojo/wagon/releases/latest)
879. [WebCopy](https://www.cyotek.com/cyotek-webcopy/downloads)
880. [WebTorrent](https://github.com/webtorrent/webtorrent-desktop/releases/latest)
881. [WeChat Work](https://work.weixin.qq.com/) :hand:
882. [WeChat](https://weixin.qq.com/cgi-bin/readtemplate?t=win_weixin) :hand:
883. [WGestures](https://github.com/yingDev/WGestures/releases/latest)
884. [wget](https://eternallybored.org/misc/wget/)
885. [WikidPad](https://github.com/WikidPad/WikidPad/releases/)
886. [Winamp](http://www.winamp.com/) [Free Personal]
887. [WinAuth](https://github.com/winauth/winauth/releases)
888. [WinCDEmu Portable](http://wincdemu.sysprogs.org/portable/)
889. [WinDirStat](https://windirstat.net/download.html)
890. [Windows System Control Center](http://www.kls-soft.com/wscc/downloads.php) [Freemium]
891. [Windscribe](https://www.filehorse.com/download-windscribe/download/) [Free Personal]
892. [WinHex](http://www.x-ways.net/winhex/) :money_with_wings:
893. [WinMerge](http://winmerge.org/downloads/)
894. [WinNTSetup](https://msfn.org/board/topic/149612-winntsetup/)
895. [WinRAR](https://www.rarlab.com/download.htm) [Free Personal]
896. [WinSCP](https://winscp.net/eng/download.php)
897. [winyl](https://github.com/winyl-player/winyl/releases)
899. [Wise/Wise Anti Malware](https://www.wisecleaner.com/wise-anti-malware.html)
900. [Wise/Wise Auto Shutdown](https://www.wisecleaner.com/wise-auto-shutdown.html)
901. [Wise/Wise Care 365](https://www.wisecleaner.com/wise-care-365.html) [Free Personal]
902. [Wise/Wise Data Recovery](https://www.wisecleaner.com/wise-data-recovery.html)
903. [Wise/Wise Disk Cleaner](https://www.wisecleaner.com/wise-disk-cleaner.html)
904. [Wise/Wise Duplicate Finder](https://www.wisecleaner.com/wise-duplicate-finder.html)
905. [Wise/Wise Folder Hider Pro](https://www.wisecleaner.com/wise-folder-hider-pro.html)
906. [Wise/Wise Force Deleter](https://www.wisecleaner.com/wise-force-deleter.html)
907. [Wise/Wise Game Booster](https://www.wisecleaner.com/wise-game-booster.html)
908. [Wise/Wise Hotkey](https://www.wisecleaner.com/wise-hotkey.html)
909. [Wise/Wise JetSearch](https://www.wisecleaner.com/wise-jetsearch.html)
910. [Wise/Wise Memory Optimizer](https://www.wisecleaner.com/wise-memory-optimizer.html)
911. [Wise/Wise PC 1stAid](https://www.wisecleaner.com/wise-pc-1staid.html)
912. [Wise/Wise Plugin Manager](https://www.wisecleaner.com/wise-plugin-manager.html)
913. [Wise/Wise Program Uninstaller](https://www.wisecleaner.com/wise-program-uninstaller.html)
914. [Wise/Wise Registry Cleaner](https://www.wisecleaner.com/wise-registry-cleaner.html)
915. [Wise/Wise Reminder](https://www.wisecleaner.com/wise-reminder.html)
916. [Wise/Wise System Monitor](https://www.wisecleaner.com/wise-system-monitor.html)
917. [Wise/Wise Windows Key Finder](https://www.wisecleaner.com/wise-windows-key-finder.html)
918. [WiX Toolset](https://github.com/wixtoolset/wix3/releases/latest)
919. [WizFile](https://antibody-software.com/web/software/software/wizfile-finds-your-files-fast/)
920. [WizKey](https://antibody-software.com/web/software/software/wizkey-makes-it-easy-to-type-accented-and-other-special-unicode-characters/) :money_with_wings:
921. [WizMouse](https://antibody-software.com/web/software/software/wizmouse-makes-your-mouse-wheel-work-on-the-window-under-the-mouse/)
922. [WizTree](https://antibody-software.com/web/software/software/wiztree-finds-the-files-and-folders-using-the-most-disk-space-on-your-hard-drive/)
923. [WordPress.com](https://github.com/Automattic/wp-desktop/releases/latest)
924. [Wox](https://github.com/Wox-launcher/Wox/releases)
925. [wxHexEditor](https://sourceforge.net/projects/wxhexeditor/files/)
926. [x64dbg](https://github.com/x64dbg/x64dbg/releases/latest)
927. [XAMPP](https://www.apachefriends.org/index.html) :hand:
928. [Xlideit Image Viewer](https://sourceforge.net/projects/xlideit/files)
929. [XMPlay](http://www.un4seen.com/xmplay.html)
930. [XnConvert](https://www.xnview.com/en/xnconvert/)
931. [XnRetro](https://www.xnview.com/en/xnretro/)
932. [XnSketch](https://www.xnview.com/en/xnsketch/)
933. [XnView](https://www.xnview.com/en/xnview/) [Freemium]
934. [XnViewMP](https://www.xnview.com/en/xnviewmp/) [Freemium]
935. [Xtreme Download Manager](http://xdman.sourceforge.net/)
936. [XX-Net](https://github.com/XX-net/XX-Net/blob/master/code/default/download.md)
937. [YACReader](http://www.yacreader.com/downloads)
938. [Yandex Browser](https://browser.yandex.com/)
939. [Yosoro](https://github.com/IceEnd/Yosoro/releases/latest)
940. [youtube-dl-gui](https://github.com/MrS0m30n3/youtube-dl-gui/releases/latest)
941. [youtube-dl](https://github.com/rg3/youtube-dl/releases/latest)
942. [YUMI-UEFI](https://www.pendrivelinux.com/yumi-multiboot-usb-creator/)
943. [YUMI](https://www.pendrivelinux.com/yumi-multiboot-usb-creator/)
944. [Zazu](https://github.com/tinytacoteam/zazu/releases/latest)
945. [zeal](https://github.com/zealdocs/zeal/releases/latest)
946. [ZenMate](https://www.filehorse.com/download-zenmate-vpn/download/)
947. [ZeroNet](https://github.com/HelloZeroNet/ZeroNet/releases/latest)
948. [ZeroTier One](https://www.zerotier.com/download.shtml) [Free Personal]
949. [Zim](https://zim.glump.net/windows/)
950. [为知笔记](http://www.wiz.cn/downloads-windows.html) :money_with_wings:
951. [冰点文库下载器](http://www.bingdian001.com/?p=30) :hand:
952. [繁化姬](https://github.com/James1201/Fanhuaji-GUI-Release/releases/latest)

</details>

### Special Software
#### 特别的软件

##### Special Installer
###### 特殊的安装方式(作为参考)

1. [AIMP](software/AIMP.js)
2. [Bandisoft Bandizip](software/Bandisoft Bandizip.js)
3. [Bandisoft Honeyview](software/Bandisoft Honeyview.js)
4. [Calibre](software/Calibre.js)
5. [Cygwin](software/Cygwin.js)
6. [FastCopy](software/FastCopy.js)
7. [GIMP](software/GIMP.js)
8. [IObit/IObit Unlocker](software/IObit/IObit Unlocker.js)
9. [Python](software/Python.js)
10. [Python2](software/Python2.js)


##### Without Download
###### 缺失下载

1. [Enigma Virtual Box unpacker](software/Enigma Virtual Box unpacker.js)
2. [Universal Extractor mod by koros aka ya158](software/Universal Extractor mod by koros aka ya158.js)
3. [冰点文库下载器](software/冰点文库下载器.js)


##### Without Installer
###### 缺失安装方式

1. [Cloudevo](software/Cloudevo.js)
2. [Evernote](software/Evernote.js)
3. [FreeFileSync](software/FreeFileSync.js)
4. [Internet Download Manager](software/Internet Download Manager.js)
5. [NeoSmart/Windows 10 Rollback Utility](software/NeoSmart/Windows 10 Rollback Utility.js)
6. [QQ](software/QQ.js)
7. [RaiDrive](software/RaiDrive.js)
8. [SoftEtherVPN](software/SoftEtherVPN.js)
9. [TIM](software/TIM.js)
10. [Twitch](software/Twitch.js)
11. [uTorrent](software/uTorrent.js)
12. [WeChat Work](software/WeChat Work.js)
13. [WeChat](software/WeChat.js)
14. [XAMPP](software/XAMPP.js)


##### Extractable Software
###### 可以解包的软件

1. 以下软件的安装包使用 [Advanced Installer](https://www.advancedinstaller.com/) 打包
  可以使用参数 `/extract <path>` 来提取，查看[更多信息](https://www.advancedinstaller.com/user-guide/exe-setup-file.html)

    `RaiDrive`

2. `Evernote` 是使用MSI打包的, 你可以从 `%temp%\Evernote.msi` 获得安装包
