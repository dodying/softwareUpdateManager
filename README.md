<!-- TOC -->

- [软件更新管理器](#软件更新管理器)
    - [说明](#说明)
      - [使用方法](#使用方法)
      - [其他说明](#其他说明)
    - [命令行](#命令行)
    - [TODO](#todo)
    - [软件示例](#软件示例)
      - [简略版](#简略版)
        - [version](#version)
        - [download](#download)
        - [install](#install)
    - [支持的搜索站点](#支持的搜索站点)
    - [支持的软件](#支持的软件)
    - [特别的软件](#特别的软件)
        - [特殊的安装方式(作为参考)](#特殊的安装方式作为参考)
        - [缺少下载地址](#缺少下载地址)
        - [缺少安装方式](#缺少安装方式)

<!-- /TOC -->


## 软件更新管理器

[English ReadMe](README_en.md)

#### 说明

##### 使用方法

1. `git clone https://github.com/dodying/softwareUpdateManager`
2. `npm install`
3. 下载 `https://github.com/dodying/software-for-softwareUpdateManager/archive/master.zip`，
  解压并移动 **software** 到 **softwareUpdateManager** 下
4. 从[这里](https://github.com/dodying/softwareUpdateManager/releases/tag/plugins)下载 **plugins.7z**，并解压到 **plugins** 下
5. 复制一份 **config.default.js**，按其中注释修改并存为 **config.js**
6. `node index.js`

##### 其他说明

1. 以下软件，如果`通常版(installer)`与`便携版(portable)`功能相同则一般以绿色版优先(如果安装版的包小许多，则可能以安装版优先)，同时64位优先
2. 大多软件都支持自动安装
3. 带 :money_with_wings: 的为**商业软件** (包括Freemium与Free Persion)， 带 :airplane: 的需**番羽土墙**， 带 :hand: 的需**手动下载/安装**， 带 :pushpin: 的表示**安装目录固定**
4. 代理优先级(前提是设置了代理): `config.urlWithoutProxy > config.urlWithProxy > config.useProxy > software.useProxy`
5. 模式优先级: `config.specialMode > config.mode = config.commercialSoftware`
6. 安装方法并没有一一测试，如果自动安装失败，请尝试手动安装
7. 如果你想安装同个软件到多个地方，请在`config.js`中编辑`profile`，并使用`node index --profile`
8. 如果下载错误，请尝试挂代理下载

#### 命令行

* `--help`
* `--makemd`
* `--search keyword`
* `[--profile name] --list`
* `[--quiet] [--profile name] [--filter name] [ --test | --test-download | --test-install | --check | --backup | --install ]`
* `[--quiet] [--profile name] [ --test | --test-download | --test-install | --check | --backup | --install ] [name]`

<details>
  <summary>命令行详情</summary>

* `node index`

   `node index.js`
    检查并更新所有软件
* `--help`, `-h`

    `node index.js --help`
* `--makemd`, `-md`

    `node index.js --makemd`
    更新`README.md`
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
* `--test-download`, `-td`

    `node index.js --test-download`
    获取网上所有软件的最新版本号，并下载 (使用 profile test)
* `--test-download`, `-ti`

    `node index.js --test-install`
    获取网上所有软件的最新版本号，并下载安装 (使用 profile test)
* `--check`, `-c`

    `node index.js --check`
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


#### TODO
1. 针对软件的特定化设置
2. install_cli 变手动
  所有安装手动
3. version 去除 build
4. func-full => walkLink
5. software =>
https://stackoverflow.com/questions/10843572/how-to-create-javascript-constants-as-properties-of-objects-using-const-keyword
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
```js
  function Parser(){
    this.init.apply(this, arguments);
  }
  Parser.prototype = {
    constructor: Parser,
    get contentTxt() {  // callback 才有用
      var text = $('<div>').html(this.content).text().trim();

      // 解决第二个段落和第一个锻炼合在一起的问题
      text = text.replace(/([^\n])　　/, '$1\n　　');

      return text;
    },

    init: function (info, doc, curPageUrl) {}
  }
```
6. 依据特定方式直接安装指定版本的软件（当前为只能安装最新版本）
7. 无需下载software文件夹直接安装
8. 只有软件不存在时才安装（适用于不常更新/会自动更新的软件）

#### 软件示例

详见 [Vivaldi](software/Vivaldi.js)

##### 简略版

说明：主要简略 `version/download/install` 三个属性

###### version

function => `version: function`

string => `version: { selector: string }`

array => `version: { selector: array[0], attr: array[1], match: array[2] }`

###### download

any => array `[].concat(any)`

`typeof array[0] === 'string'` and `array[0].match(/^https?:/i)` => { plain: array[0], output: array[1] }

`typeof array[0] === 'string'` and not `array[0].match(/^https?:/i)` => { selector: array[0], attr: array[1], match: array[2], output: array[3] }

`typeof array[0] === 'function'` => { func: array[0], output: array[1] }

###### install

array => (array[0])(output, iPath, ...array[1,])


#### 支持的搜索站点

1. FileHorse
2. Pc6
3. Softpedia


#### 支持的软件

详见 [SupportedSoftwares.md](SupportedSoftwares.md)

#### 特别的软件

###### 特殊的安装方式(作为参考)

1. [Actual Tools/Actual File Folders](software/Actual%20Tools.js)
2. [Actual Tools/Actual Multiple Monitors](software/Actual%20Tools.js)
3. [Actual Tools/Actual Title Buttons](software/Actual%20Tools.js)
4. [Actual Tools/Actual Transparent Window](software/Actual%20Tools.js)
5. [Actual Tools/Actual Virtual Desktops](software/Actual%20Tools.js)
6. [Actual Tools/Actual Window Guard](software/Actual%20Tools.js)
7. [Actual Tools/Actual Window Manager](software/Actual%20Tools.js)
8. [Actual Tools/Actual Window Menu](software/Actual%20Tools.js)
9. [Actual Tools/Actual Window Minimizer](software/Actual%20Tools.js)
10. [Actual Tools/Actual Window Rollup](software/Actual%20Tools.js)
11. [Apple/AppleApplicationSupport](software/Apple.js)
12. [Apple/Bonjour](software/Apple.js)
13. [Bandisoft/Bandizip](software/Bandisoft.js)
14. [Bandisoft/Honeyview](software/Bandisoft.js)
15. [Famatech/Advanced IP Scanner](software/Famatech.js)
16. [Famatech/Advanced Port Scanner](software/Famatech.js)
17. [IObit/Driver Booster](software/IObit.js)
18. [KingSoft/WPS](software/KingSoft.js)
19. [KingSoft/WPSPDF](software/KingSoft.js)
20. [Mythicsoft/Agent Ransack](software/Mythicsoft.js)
21. [Mythicsoft/FileLocator Pro](software/Mythicsoft.js)
22. [Netease/MuMu](software/Netease.js)
23. [AutoHotkey](software/_list/list-for-A.js)
24. [BitTorrent](software/_list/list-for-B.js)
25. [Directory Opus](software/_list/list-for-D.js)
26. [Evernote](software/_list/list-for-E.js)
27. [Fork](software/_list/list-for-F.js)
28. [GIMP](software/_list/list-for-G.js)
29. [MinGW-w64](software/_list/list-for-M.js)
30. [Rust](software/_list/list-for-R.js)
31. [SmartGit](software/_list/list-for-S.js)
32. [upupoo](software/_list/list-for-U.js)
33. [uTorrent](software/_list/list-for-U.js)
34. [VirtualBox](software/_list/list-for-V.js)
35. [Weasel](software/_list/list-for-W.js)


###### 缺少下载地址

1. [天若OCR](software/_list/list-for-%25.js)
2. [微PE工具箱](software/_list/list-for-%25.js)
3. [Enigma Virtual Box unpacker](software/_list/list-for-E.js)
4. [Jvedio](software/_list/list-for-J.js)
5. [PixivBiu](software/_list/list-for-P.js)
6. [Universal Extractor mod by koros aka ya158](software/_list/list-for-U.js)


###### 缺少安装方式

1. [360/360安全卫士](software/360.js)
2. [360/360杀毒](software/360.js)
3. [42wim/dt](software/42wim.js)
4. [BenVista/PhotoArtist](software/BenVista.js) ASPack
5. [BenVista/PhotoZoom](software/BenVista.js)
6. [BinaryMark/Advanced File Finder](software/BinaryMark.js)
7. [BinaryMark/All the Best YouTube Downloader](software/BinaryMark.js)
8. [BinaryMark/Batch Docs](software/BinaryMark.js)
9. [BinaryMark/Batch Encoding Converter](software/BinaryMark.js)
10. [BinaryMark/Batch File Encrypt](software/BinaryMark.js)
11. [BinaryMark/Batch File Manager](software/BinaryMark.js)
12. [BinaryMark/Batch File Rename](software/BinaryMark.js)
13. [BinaryMark/Batch File Replace](software/BinaryMark.js)
14. [BinaryMark/Batch File Split & Join](software/BinaryMark.js)
15. [BinaryMark/Batch Files](software/BinaryMark.js)
16. [BinaryMark/Batch Hex Editor](software/BinaryMark.js)
17. [BinaryMark/Batch Image Converter](software/BinaryMark.js)
18. [BinaryMark/Batch Image Enhancer](software/BinaryMark.js)
19. [BinaryMark/Batch Image Resizer](software/BinaryMark.js)
20. [BinaryMark/Batch Image Splitter](software/BinaryMark.js)
21. [BinaryMark/Batch Image Watermarker](software/BinaryMark.js)
22. [BinaryMark/Batch Images](software/BinaryMark.js)
23. [BinaryMark/Batch Photo Face](software/BinaryMark.js)
24. [BinaryMark/Batch RegEx](software/BinaryMark.js)
25. [BinaryMark/Batch Text File Editor](software/BinaryMark.js)
26. [BinaryMark/Batch Word Replace](software/BinaryMark.js)
27. [BinaryMark/Biorhythms Calculator 2018](software/BinaryMark.js)
28. [BinaryMark/Blogspot Image Downloader](software/BinaryMark.js)
29. [BinaryMark/Color Picker Pro](software/BinaryMark.js)
30. [BinaryMark/Database E-Mailer](software/BinaryMark.js)
31. [BinaryMark/File Hash Generator](software/BinaryMark.js)
32. [BinaryMark/Password Generator](software/BinaryMark.js)
33. [BinaryMark/Random Item Picker](software/BinaryMark.js)
34. [BinaryMark/Random Number Generator](software/BinaryMark.js)
35. [BinaryMark/Streaming Video Downloader](software/BinaryMark.js)
36. [BinaryMark/Text to MP3 Converter](software/BinaryMark.js)
37. [BiniSoft/USB Flash Drives Control](software/BiniSoft.js)
38. [BiniSoft/Windows Firewall Control](software/BiniSoft.js)
39. [Black Bird Cleaner Software/Black Bird Cleaner](software/Black%20Bird%20Cleaner%20Software.js)
40. [Black Bird Cleaner Software/Black Bird Image Optimizer](software/Black%20Bird%20Cleaner%20Software.js)
41. [Black Bird Cleaner Software/Black Bird Registry Cleaner](software/Black%20Bird%20Cleaner%20Software.js)
42. [Black Bird Cleaner Software/Black Bird System Info](software/Black%20Bird%20Cleaner%20Software.js)
43. [Black Bird Cleaner Software/Perfecto Encryptor](software/Black%20Bird%20Cleaner%20Software.js)
44. [cFos Software/cFos Broadband Connect](software/cFos%20Software.js)
45. [cFos Software/cFos IPv6 Link](software/cFos%20Software.js)
46. [cFos Software/cFos Outlook DAV](software/cFos%20Software.js)
47. [cFos Software/cFos Personal Net](software/cFos%20Software.js)
48. [cFos Software/cFos](software/cFos%20Software.js)
49. [cFos Software/cFosSpeed](software/cFos%20Software.js)
50. [ChemTable/Autorun Organizer](software/ChemTable.js)
51. [ChemTable/Soft Organizer](software/ChemTable.js)
52. [DeskSoft/BWMeter](software/DeskSoft.js)
53. [DeskSoft/CheckMail](software/DeskSoft.js)
54. [DeskSoft/DesktopPlants](software/DeskSoft.js)
55. [DeskSoft/EarthTime](software/DeskSoft.js)
56. [DeskSoft/EarthView](software/DeskSoft.js)
57. [DeskSoft/FastFolders](software/DeskSoft.js)
58. [DeskSoft/HardCopy](software/DeskSoft.js)
59. [DeskSoft/ScrollNavigator](software/DeskSoft.js)
60. [DeskSoft/SmartCapture](software/DeskSoft.js)
61. [DeskSoft/WindowManager](software/DeskSoft.js)
62. [Evorim/Advanced Backup](software/Evorim.js)
63. [Evorim/Cloudevo](software/Evorim.js)
64. [Evorim/Free Firewall](software/Evorim.js)
65. [Evorim/HotkeyPro](software/Evorim.js)
66. [Fenrir/PictBear](software/Fenrir.js)
67. [HHD Software/Device Monitoring Studio](software/HHD%20Software.js)
68. [HHD Software/Hex Editor Neo](software/HHD%20Software.js)
69. [HHD Software/Network Monitor](software/HHD%20Software.js)
70. [HHD Software/Remote Serial Ports](software/HHD%20Software.js)
71. [HHD Software/Serial Monitor](software/HHD%20Software.js)
72. [HHD Software/Serial Port Monitoring Control](software/HHD%20Software.js)
73. [HHD Software/USB Monitor](software/HHD%20Software.js)
74. [HHD Software/USB Monitoring Control](software/HHD%20Software.js)
75. [HHD Software/Virtual Serial Ports](software/HHD%20Software.js)
76. [IDM/UEStudio](software/IDM.js) SetupFactory
77. [IDM/UltraCompare](software/IDM.js) SetupFactory
78. [IDM/UltraEdit](software/IDM.js) SetupFactory
79. [IDM/UltraFinder](software/IDM.js) SetupFactory
80. [IDM/UltraFTP](software/IDM.js) SetupFactory
81. [Just Great Software/AceText](software/Just%20Great%20Software.js)
82. [Just Great Software/DeployMaster](software/Just%20Great%20Software.js)
83. [Just Great Software/EditPad Lite](software/Just%20Great%20Software.js)
84. [Just Great Software/EditPad Pro](software/Just%20Great%20Software.js)
85. [Just Great Software/HelpScribble](software/Just%20Great%20Software.js)
86. [Just Great Software/PowerGREP](software/Just%20Great%20Software.js)
87. [Just Great Software/RegexBuddy](software/Just%20Great%20Software.js)
88. [Just Great Software/RegexMagic](software/Just%20Great%20Software.js)
89. [KingSoft/PowerWord](software/KingSoft.js)
90. [KurtZimmermannn Software/HDCleaner](software/KurtZimmermannn%20Software.js)
91. [KurtZimmermannn Software/ImageFinder](software/KurtZimmermannn%20Software.js)
92. [KurtZimmermannn Software/RegCool](software/KurtZimmermannn%20Software.js)
93. [KurtZimmermannn Software/TweakPower](software/KurtZimmermannn%20Software.js)
94. [Macroplant/iExplorer](software/Macroplant.js)
95. [Microsoft/dotNET Core Runtime](software/Microsoft.js)
96. [Microsoft/Microsoft Support and Recovery Assistant](software/Microsoft.js)
97. [Microsoft/必应词典](software/Microsoft.js)
98. [Moon Software/Copiaris](software/Moon%20Software.js)
99. [Moon Software/Font Xplorer](software/Moon%20Software.js)
100. [Moon Software/ShellTools](software/Moon%20Software.js)
101. [Netease/MailMaster](software/Netease.js)
102. [NewSoftwares.net/Cloud Secure](software/NewSoftwares.net.js)
103. [NewSoftwares.net/Folder Lock](software/NewSoftwares.net.js)
104. [Paragon/Paragon Disk Wiper Professional](software/Paragon.js)
105. [Paragon/Paragon VM Backup](software/Paragon.js)
106. [PrivacyRoot/Prevent Restore](software/PrivacyRoot.js)
107. [PrivacyRoot/Secret Disk](software/PrivacyRoot.js)
108. [PrivacyRoot/Wipe](software/PrivacyRoot.js)
109. [pXc-coding/Tweak Me](software/pXc-coding.js)
110. [Saleen/FilePro](software/Saleen.js)
111. [Saleen/Folder Sync](software/Saleen.js)
112. [Saleen/KeyboardExt](software/Saleen.js)
113. [Saleen/ScanFs](software/Saleen.js)
114. [Saleen/Tasks Manager](software/Saleen.js)
115. [Saleen/Video Manager](software/Saleen.js)
116. [Saleen/WebDownloader](software/Saleen.js)
117. [SolveigMM/HyperCam](software/SolveigMM.js) Ghost Installer
118. [SolveigMM/Video Splitter](software/SolveigMM.js) Ghost Installer
119. [SolveigMM/WMP Trimmer Plugin](software/SolveigMM.js) Ghost Installer
120. [SolveigMM/Zond 265](software/SolveigMM.js) Ghost Installer
121. [sony/Music Center](software/sony.js)
122. [Splashtop/Splashtop Streamer](software/Splashtop.js)
123. [Splashtop/Splashtop Wired XDisplay](software/Splashtop.js)
124. [Splashtop/Splashtop](software/Splashtop.js)
125. [Stardock/Start8](software/Stardock.js)
126. [Sysprogs/VisualDDK](software/Sysprogs.js)
127. [Sysprogs/VisualHDL](software/Sysprogs.js)
128. [Sysprogs/WinCDEmu](software/Sysprogs.js)
129. [Technitium/MAC Address Changer](software/Technitium.js)
130. [Tencent/DeskGo](software/Tencent.js)
131. [Tencent/QQ Music](software/Tencent.js)
132. [VanDyke/SecureCRT](software/VanDyke.js) InstallShield
133. [VanDyke/SecureFX](software/VanDyke.js) InstallShield
134. [VanDyke/VanDyke ClientPack](software/VanDyke.js) InstallShield
135. [VanDyke/VShell](software/VanDyke.js) InstallShield
136. [VSO Software/VSO Media Player](software/VSO%20Software.js)
137. [WinAbility Software/AB Commander](software/WinAbility%20Software.js)
138. [WinAbility Software/ActiveExit](software/WinAbility%20Software.js)
139. [WinAbility Software/Folder Guard](software/WinAbility%20Software.js)
140. [WinAbility Software/MySecretFolder](software/WinAbility%20Software.js)
141. [WinAbility Software/StartFinity](software/WinAbility%20Software.js)
142. [WinAbility Software/USBCrypt](software/WinAbility%20Software.js)
143. [Z-Cron/Z-Cron](software/Z-Cron.js)
144. [Z-Cron/Z-FTPcopyII](software/Z-Cron.js)
145. [Z-Cron/Z-ParSwitch](software/Z-Cron.js)
146. [Z-Cron/Z-TaskHelp](software/Z-Cron.js)
147. [亿寻](software/_list/list-for-%25.js)
148. [天翼云盘](software/_list/list-for-%25.js)
149. [直播神探](software/_list/list-for-%25.js)
150. [稻壳阅读器](software/_list/list-for-%25.js)
151. [蓝奏云盘](software/_list/list-for-%25.js)
152. [雷鸟下载](software/_list/list-for-%25.js)
153. [Ad Muncher](software/_list/list-for-A.js)
154. [Apabi Reader](software/_list/list-for-A.js)
155. [Avidemux](software/_list/list-for-A.js)
156. [Balabolka](software/_list/list-for-B.js)
157. [BetterExplorer](software/_list/list-for-B.js)
158. [BlueStacks](software/_list/list-for-B.js)
159. [Bvckup 2](software/_list/list-for-B.js)
160. [Classic Shell](software/_list/list-for-C.js)
161. [Clipboard Master](software/_list/list-for-C.js)
162. [Clover](software/_list/list-for-C.js)
163. [CuteFTP](software/_list/list-for-C.js)
164. [DbVisualizer](software/_list/list-for-D.js)
165. [Docker Desktop](software/_list/list-for-D.js)
166. [DriverTalent](software/_list/list-for-D.js)
167. [DualServer](software/_list/list-for-D.js)
168. [EasyDrv](software/_list/list-for-E.js)
169. [ExView](software/_list/list-for-E.js)
170. [FireDaemon](software/_list/list-for-F.js) InstallShield
171. [fman](software/_list/list-for-F.js)
172. [FreeFileSync](software/_list/list-for-F.js)
173. [GParted](software/_list/list-for-G.js)
174. [Grub2Win](software/_list/list-for-G.js)
175. [HkDown](software/_list/list-for-H.js)
176. [Hsteam](software/_list/list-for-H.js)
177. [InstallBuilder](software/_list/list-for-I.js)
178. [InstallMate](software/_list/list-for-I.js)
179. [jEdit](software/_list/list-for-J.js)
180. [KinhDown](software/_list/list-for-K.js)
181. [LastPass](software/_list/list-for-L.js)
182. [MiKTeX](software/_list/list-for-M.js)
183. [OpalCalc](software/_list/list-for-O.js)
184. [Open Shell](software/_list/list-for-O.js)
185. [Outlook CalDav Synchronizer](software/_list/list-for-O.js)
186. [Pixia](software/_list/list-for-P.js) InstallShield
187. [Preme](software/_list/list-for-P.js)
188. [Qdown](software/_list/list-for-Q.js)
189. [QTTabBar](software/_list/list-for-Q.js)
190. [Shapeshifter](software/_list/list-for-S.js)
191. [Simple DNS Plus](software/_list/list-for-S.js)
192. [SoftEtherVPN](software/_list/list-for-S.js)
193. [SystemRescueCd](software/_list/list-for-S.js)
194. [SystemTools Hyena](software/_list/list-for-S.js)
195. [TDM-GCC](software/_list/list-for-T.js)
196. [Tresorit](software/_list/list-for-T.js)
197. [Trillian](software/_list/list-for-T.js)
198. [TVDownloader](software/_list/list-for-T.js)
199. [Twitch](software/_list/list-for-T.js)
200. [UltWin](software/_list/list-for-U.js)
201. [VeraCrypt](software/_list/list-for-V.js)
202. [Visual C++ Redistributable Runtimes](software/_list/list-for-V.js)
203. [Vuze](software/_list/list-for-V.js)
204. [Vysor](software/_list/list-for-V.js)
205. [yamada](software/_list/list-for-Y.js)
206. [小葫芦/小葫芦弹幕助手](software/%E5%B0%8F%E8%91%AB%E8%8A%A6.js)
207. [讯飞/智能文稿字幕系统](software/%E8%AE%AF%E9%A3%9E.js) inno

