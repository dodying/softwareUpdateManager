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

1. [Actual Tools/Actual File Folders](software/Actual%20Tools/Actual%20File%20Folders.js)
2. [Actual Tools/Actual Multiple Monitors](software/Actual%20Tools/Actual%20Multiple%20Monitors.js)
3. [Actual Tools/Actual Title Buttons](software/Actual%20Tools/Actual%20Title%20Buttons.js)
4. [Actual Tools/Actual Transparent Window](software/Actual%20Tools/Actual%20Transparent%20Window.js)
5. [Actual Tools/Actual Virtual Desktops](software/Actual%20Tools/Actual%20Virtual%20Desktops.js)
6. [Actual Tools/Actual Window Guard](software/Actual%20Tools/Actual%20Window%20Guard.js)
7. [Actual Tools/Actual Window Manager](software/Actual%20Tools/Actual%20Window%20Manager.js)
8. [Actual Tools/Actual Window Menu](software/Actual%20Tools/Actual%20Window%20Menu.js)
9. [Actual Tools/Actual Window Minimizer](software/Actual%20Tools/Actual%20Window%20Minimizer.js)
10. [Actual Tools/Actual Window Rollup](software/Actual%20Tools/Actual%20Window%20Rollup.js)
11. [Apple/AppleApplicationSupport](software/Apple/AppleApplicationSupport.js)
12. [Apple/Bonjour](software/Apple/Bonjour.js)
13. [AutoHotkey](software/AutoHotkey.js)
14. [Bandisoft/Bandizip](software/Bandisoft/Bandizip.js)
15. [Bandisoft/Honeyview](software/Bandisoft/Honeyview.js)
16. [Cocos2d-x/CocosCreator](software/Cocos2d-x/CocosCreator.js)
17. [Directory Opus](software/Directory%20Opus.js)
18. [Evernote](software/Evernote.js)
19. [Famatech/Advanced IP Scanner](software/Famatech/Advanced%20IP%20Scanner.js)
20. [Famatech/Advanced Port Scanner](software/Famatech/Advanced%20Port%20Scanner.js)
21. [Fork](software/Fork.js)
22. [GIMP](software/GIMP.js)
23. [IObit/Driver Booster](software/IObit/Driver%20Booster.js)
24. [KingSoft/WPS](software/KingSoft/WPS.js)
25. [KingSoft/WPSPDF](software/KingSoft/WPSPDF.js)
26. [MinGW-w64](software/MinGW-w64.js)
27. [Mythicsoft/Agent Ransack](software/Mythicsoft/Agent%20Ransack.js)
28. [Mythicsoft/FileLocator Pro](software/Mythicsoft/FileLocator%20Pro.js)
29. [Netease/MuMu](software/Netease/MuMu.js)
30. [Python](software/Python.js)
31. [Python2](software/Python2.js)
32. [Rust](software/Rust.js)
33. [SmartGit](software/SmartGit.js)
34. [upupoo](software/upupoo.js)
35. [uTorrent](software/uTorrent.js)
36. [VirtualBox](software/VirtualBox.js)
37. [Weasel](software/Weasel.js)


###### 缺少下载地址

1. [Android 调试助手](software/Android%20%E8%B0%83%E8%AF%95%E5%8A%A9%E6%89%8B.js)
2. [Edgeless](software/Edgeless.js)
3. [Enigma Virtual Box unpacker](software/Enigma%20Virtual%20Box%20unpacker.js)
4. [the-sz/Pictures on Map](software/the-sz/Pictures%20on%20Map.js)
5. [Universal Extractor mod by koros aka ya158](software/Universal%20Extractor%20mod%20by%20koros%20aka%20ya158.js)
6. [天若OCR](software/%E5%A4%A9%E8%8B%A5OCR.js)
7. [微PE工具箱](software/%E5%BE%AEPE%E5%B7%A5%E5%85%B7%E7%AE%B1.js)


###### 缺少安装方式

1. [42wim/dt](software/42wim/dt.js)
2. [Ad Muncher](software/Ad%20Muncher.js)
3. [Apabi Reader](software/Apabi%20Reader.js)
4. [Avidemux](software/Avidemux.js)
5. [Balabolka](software/Balabolka.js)
6. [BenVista/PhotoArtist](software/BenVista/PhotoArtist.js) ASPack
7. [BenVista/PhotoZoom](software/BenVista/PhotoZoom.js)
8. [BetterExplorer](software/BetterExplorer.js)
9. [BinaryMark/Advanced File Finder](software/BinaryMark/Advanced%20File%20Finder.js)
10. [BinaryMark/All the Best YouTube Downloader](software/BinaryMark/All%20the%20Best%20YouTube%20Downloader.js)
11. [BinaryMark/Batch Docs](software/BinaryMark/Batch%20Docs.js)
12. [BinaryMark/Batch Encoding Converter](software/BinaryMark/Batch%20Encoding%20Converter.js)
13. [BinaryMark/Batch File Encrypt](software/BinaryMark/Batch%20File%20Encrypt.js)
14. [BinaryMark/Batch File Manager](software/BinaryMark/Batch%20File%20Manager.js)
15. [BinaryMark/Batch File Rename](software/BinaryMark/Batch%20File%20Rename.js)
16. [BinaryMark/Batch File Replace](software/BinaryMark/Batch%20File%20Replace.js)
17. [BinaryMark/Batch File Split & Join](software/BinaryMark/Batch%20File%20Split%20&%20Join.js)
18. [BinaryMark/Batch Files](software/BinaryMark/Batch%20Files.js)
19. [BinaryMark/Batch Hex Editor](software/BinaryMark/Batch%20Hex%20Editor.js)
20. [BinaryMark/Batch Image Converter](software/BinaryMark/Batch%20Image%20Converter.js)
21. [BinaryMark/Batch Image Enhancer](software/BinaryMark/Batch%20Image%20Enhancer.js)
22. [BinaryMark/Batch Image Resizer](software/BinaryMark/Batch%20Image%20Resizer.js)
23. [BinaryMark/Batch Image Splitter](software/BinaryMark/Batch%20Image%20Splitter.js)
24. [BinaryMark/Batch Image Watermarker](software/BinaryMark/Batch%20Image%20Watermarker.js)
25. [BinaryMark/Batch Images](software/BinaryMark/Batch%20Images.js)
26. [BinaryMark/Batch Photo Face](software/BinaryMark/Batch%20Photo%20Face.js)
27. [BinaryMark/Batch RegEx](software/BinaryMark/Batch%20RegEx.js)
28. [BinaryMark/Batch Text File Editor](software/BinaryMark/Batch%20Text%20File%20Editor.js)
29. [BinaryMark/Batch Word Replace](software/BinaryMark/Batch%20Word%20Replace.js)
30. [BinaryMark/Biorhythms Calculator 2018](software/BinaryMark/Biorhythms%20Calculator%202018.js)
31. [BinaryMark/Blogspot Image Downloader](software/BinaryMark/Blogspot%20Image%20Downloader.js)
32. [BinaryMark/Color Picker Pro](software/BinaryMark/Color%20Picker%20Pro.js)
33. [BinaryMark/Database E-Mailer](software/BinaryMark/Database%20E-Mailer.js)
34. [BinaryMark/File Hash Generator](software/BinaryMark/File%20Hash%20Generator.js)
35. [BinaryMark/Password Generator](software/BinaryMark/Password%20Generator.js)
36. [BinaryMark/Random Item Picker](software/BinaryMark/Random%20Item%20Picker.js)
37. [BinaryMark/Random Number Generator](software/BinaryMark/Random%20Number%20Generator.js)
38. [BinaryMark/Streaming Video Downloader](software/BinaryMark/Streaming%20Video%20Downloader.js)
39. [BinaryMark/Text to MP3 Converter](software/BinaryMark/Text%20to%20MP3%20Converter.js)
40. [BiniSoft/USB Flash Drives Control](software/BiniSoft/USB%20Flash%20Drives%20Control.js)
41. [BiniSoft/Windows Firewall Control](software/BiniSoft/Windows%20Firewall%20Control.js)
42. [Black Bird Cleaner Software/Black Bird Cleaner](software/Black%20Bird%20Cleaner%20Software/Black%20Bird%20Cleaner.js)
43. [Black Bird Cleaner Software/Black Bird Image Optimizer](software/Black%20Bird%20Cleaner%20Software/Black%20Bird%20Image%20Optimizer.js)
44. [Black Bird Cleaner Software/Black Bird Registry Cleaner](software/Black%20Bird%20Cleaner%20Software/Black%20Bird%20Registry%20Cleaner.js)
45. [Black Bird Cleaner Software/Black Bird System Info](software/Black%20Bird%20Cleaner%20Software/Black%20Bird%20System%20Info.js)
46. [Black Bird Cleaner Software/Perfecto Encryptor](software/Black%20Bird%20Cleaner%20Software/Perfecto%20Encryptor.js)
47. [BlueStacks](software/BlueStacks.js)
48. [Bvckup 2](software/Bvckup%202.js)
49. [cFos Software/cFos Broadband Connect](software/cFos%20Software/cFos%20Broadband%20Connect.js)
50. [cFos Software/cFos IPv6 Link](software/cFos%20Software/cFos%20IPv6%20Link.js)
51. [cFos Software/cFos Outlook DAV](software/cFos%20Software/cFos%20Outlook%20DAV.js)
52. [cFos Software/cFos Personal Net](software/cFos%20Software/cFos%20Personal%20Net.js)
53. [cFos Software/cFos](software/cFos%20Software/cFos.js)
54. [cFos Software/cFosSpeed](software/cFos%20Software/cFosSpeed.js)
55. [ChemTable/Autorun Organizer](software/ChemTable/Autorun%20Organizer.js)
56. [ChemTable/Registry Life](software/ChemTable/Registry%20Life.js)
57. [ChemTable/Soft Organizer](software/ChemTable/Soft%20Organizer.js)
58. [Classic Shell](software/Classic%20Shell.js)
59. [Clipboard Master](software/Clipboard%20Master.js)
60. [Clover](software/Clover.js)
61. [CuteFTP](software/CuteFTP.js)
62. [DeskSoft/BWMeter](software/DeskSoft/BWMeter.js)
63. [DeskSoft/CheckMail](software/DeskSoft/CheckMail.js)
64. [DeskSoft/DesktopPlants](software/DeskSoft/DesktopPlants.js)
65. [DeskSoft/EarthTime](software/DeskSoft/EarthTime.js)
66. [DeskSoft/EarthView](software/DeskSoft/EarthView.js)
67. [DeskSoft/FastFolders](software/DeskSoft/FastFolders.js)
68. [DeskSoft/HardCopy](software/DeskSoft/HardCopy.js)
69. [DeskSoft/ScrollNavigator](software/DeskSoft/ScrollNavigator.js)
70. [DeskSoft/SmartCapture](software/DeskSoft/SmartCapture.js)
71. [DeskSoft/WindowManager](software/DeskSoft/WindowManager.js)
72. [DriverTalent](software/DriverTalent.js)
73. [EasyDrv](software/EasyDrv.js)
74. [Evorim/Advanced Backup](software/Evorim/Advanced%20Backup.js)
75. [Evorim/Cloudevo](software/Evorim/Cloudevo.js)
76. [Evorim/Free Firewall](software/Evorim/Free%20Firewall.js)
77. [Evorim/HotkeyPro](software/Evorim/HotkeyPro.js)
78. [ExView](software/ExView.js)
79. [Fenrir/PictBear](software/Fenrir/PictBear.js)
80. [FireDaemon](software/FireDaemon.js) InstallShield
81. [fman](software/fman.js)
82. [FreeFileSync](software/FreeFileSync.js)
83. [HHD Software/Device Monitoring Studio](software/HHD%20Software/Device%20Monitoring%20Studio.js)
84. [HHD Software/Hex Editor Neo](software/HHD%20Software/Hex%20Editor%20Neo.js)
85. [HHD Software/Network Monitor](software/HHD%20Software/Network%20Monitor.js)
86. [HHD Software/Remote Serial Ports](software/HHD%20Software/Remote%20Serial%20Ports.js)
87. [HHD Software/Serial Monitor](software/HHD%20Software/Serial%20Monitor.js)
88. [HHD Software/Serial Port Monitoring Control](software/HHD%20Software/Serial%20Port%20Monitoring%20Control.js)
89. [HHD Software/USB Monitor](software/HHD%20Software/USB%20Monitor.js)
90. [HHD Software/USB Monitoring Control](software/HHD%20Software/USB%20Monitoring%20Control.js)
91. [HHD Software/Virtual Serial Ports](software/HHD%20Software/Virtual%20Serial%20Ports.js)
92. [HkDown](software/HkDown.js)
93. [IDM/UEStudio](software/IDM/UEStudio.js) SetupFactory
94. [IDM/UltraCompare](software/IDM/UltraCompare.js) SetupFactory
95. [IDM/UltraEdit](software/IDM/UltraEdit.js) SetupFactory
96. [IDM/UltraFinder](software/IDM/UltraFinder.js) SetupFactory
97. [IDM/UltraFTP](software/IDM/UltraFTP.js) SetupFactory
98. [InstallBuilder](software/InstallBuilder.js)
99. [InstallMate](software/InstallMate.js)
100. [KingSoft/PowerWord](software/KingSoft/PowerWord.js)
101. [KurtZimmermannn Software/HDCleaner](software/KurtZimmermannn%20Software/HDCleaner.js)
102. [KurtZimmermannn Software/ImageFinder](software/KurtZimmermannn%20Software/ImageFinder.js)
103. [KurtZimmermannn Software/RegCool](software/KurtZimmermannn%20Software/RegCool.js)
104. [KurtZimmermannn Software/TweakPower](software/KurtZimmermannn%20Software/TweakPower.js)
105. [LastPass](software/LastPass.js)
106. [Macroplant/iExplorer](software/Macroplant/iExplorer.js)
107. [Microsoft/dotNET Core Runtime](software/Microsoft/dotNET%20Core%20Runtime.js)
108. [Microsoft/必应词典](software/Microsoft/%E5%BF%85%E5%BA%94%E8%AF%8D%E5%85%B8.js)
109. [MiKTeX](software/MiKTeX.js)
110. [Moon Software/Copiaris](software/Moon%20Software/Copiaris.js)
111. [Moon Software/Font Xplorer](software/Moon%20Software/Font%20Xplorer.js)
112. [Moon Software/ShellTools](software/Moon%20Software/ShellTools.js)
113. [NewSoftwares.net/Cloud Secure](software/NewSoftwares.net/Cloud%20Secure.js)
114. [NewSoftwares.net/Folder Lock](software/NewSoftwares.net/Folder%20Lock.js)
115. [OpalCalc](software/OpalCalc.js)
116. [Open Shell](software/Open%20Shell.js)
117. [Outlook CalDav Synchronizer](software/Outlook%20CalDav%20Synchronizer.js)
118. [Paragon/Paragon Disk Wiper Professional](software/Paragon/Paragon%20Disk%20Wiper%20Professional.js)
119. [Paragon/Paragon VM Backup](software/Paragon/Paragon%20VM%20Backup.js)
120. [Pixia](software/Pixia.js) InstallShield
121. [Preme](software/Preme.js)
122. [PrivacyRoot/Prevent Restore](software/PrivacyRoot/Prevent%20Restore.js)
123. [PrivacyRoot/Safe Startup](software/PrivacyRoot/Safe%20Startup.js)
124. [PrivacyRoot/Secret Disk](software/PrivacyRoot/Secret%20Disk.js)
125. [PrivacyRoot/Wipe](software/PrivacyRoot/Wipe.js)
126. [QTTabBar](software/QTTabBar.js)
127. [Saleen/FilePro](software/Saleen/FilePro.js)
128. [Saleen/Folder Sync](software/Saleen/Folder%20Sync.js)
129. [Saleen/KeyboardExt](software/Saleen/KeyboardExt.js)
130. [Saleen/ScanFs](software/Saleen/ScanFs.js)
131. [Saleen/Tasks Manager](software/Saleen/Tasks%20Manager.js)
132. [Saleen/Video Manager](software/Saleen/Video%20Manager.js)
133. [Saleen/WebDownloader](software/Saleen/WebDownloader.js)
134. [Shapeshifter](software/Shapeshifter.js)
135. [SoftEtherVPN](software/SoftEtherVPN.js)
136. [SolveigMM/HyperCam](software/SolveigMM/HyperCam.js) Ghost Installer
137. [SolveigMM/Video Splitter](software/SolveigMM/Video%20Splitter.js) Ghost Installer
138. [SolveigMM/WMP Trimmer Plugin](software/SolveigMM/WMP%20Trimmer%20Plugin.js) Ghost Installer
139. [SolveigMM/Zond 265](software/SolveigMM/Zond%20265.js) Ghost Installer
140. [Splashtop/Splashtop Streamer](software/Splashtop/Splashtop%20Streamer.js)
141. [Splashtop/Splashtop Wired XDisplay](software/Splashtop/Splashtop%20Wired%20XDisplay.js)
142. [Splashtop/Splashtop](software/Splashtop/Splashtop.js)
143. [Stardock/Start8](software/Stardock/Start8.js)
144. [Sysprogs/VisualDDK](software/Sysprogs/VisualDDK.js)
145. [Sysprogs/VisualHDL](software/Sysprogs/VisualHDL.js)
146. [Sysprogs/WinCDEmu](software/Sysprogs/WinCDEmu.js)
147. [SystemTools Hyena](software/SystemTools%20Hyena.js)
148. [Technitium/MAC Address Changer](software/Technitium/MAC%20Address%20Changer.js)
149. [Tencent/QQ Music](software/Tencent/QQ%20Music.js)
150. [Tresorit](software/Tresorit.js)
151. [Trillian](software/Trillian.js)
152. [TVDownloader](software/TVDownloader.js)
153. [Twitch](software/Twitch.js)
154. [VanDyke/SecureCRT](software/VanDyke/SecureCRT.js) InstallShield
155. [VanDyke/SecureFX](software/VanDyke/SecureFX.js) InstallShield
156. [VanDyke/VanDyke ClientPack](software/VanDyke/VanDyke%20ClientPack.js) InstallShield
157. [VanDyke/VShell](software/VanDyke/VShell.js) InstallShield
158. [VeraCrypt](software/VeraCrypt.js)
159. [Visual C++ Redistributable Runtimes](software/Visual%20C++%20Redistributable%20Runtimes.js)
160. [VSO Software/VSO Media Player](software/VSO%20Software/VSO%20Media%20Player.js)
161. [Vuze](software/Vuze.js)
162. [Vysor](software/Vysor.js)
163. [WinAbility Software/AB Commander](software/WinAbility%20Software/AB%20Commander.js)
164. [WinAbility Software/ActiveExit](software/WinAbility%20Software/ActiveExit.js)
165. [WinAbility Software/Folder Guard](software/WinAbility%20Software/Folder%20Guard.js)
166. [WinAbility Software/MySecretFolder](software/WinAbility%20Software/MySecretFolder.js)
167. [WinAbility Software/StartFinity](software/WinAbility%20Software/StartFinity.js)
168. [WinAbility Software/USBCrypt](software/WinAbility%20Software/USBCrypt.js)
169. [yamada](software/yamada.js)
170. [Z-Cron/Z-Cron](software/Z-Cron/Z-Cron.js)
171. [Z-Cron/Z-FTPcopyII](software/Z-Cron/Z-FTPcopyII.js)
172. [Z-Cron/Z-ParSwitch](software/Z-Cron/Z-ParSwitch.js)
173. [Z-Cron/Z-TaskHelp](software/Z-Cron/Z-TaskHelp.js)
174. [小葫芦/小葫芦弹幕助手](software/%E5%B0%8F%E8%91%AB%E8%8A%A6/%E5%B0%8F%E8%91%AB%E8%8A%A6%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B.js)
175. [小葫芦/小葫芦直播助手](software/%E5%B0%8F%E8%91%AB%E8%8A%A6/%E5%B0%8F%E8%91%AB%E8%8A%A6%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B.js)
176. [永中Office](software/%E6%B0%B8%E4%B8%ADOffice.js)
177. [火绒安全软件](software/%E7%81%AB%E7%BB%92%E5%AE%89%E5%85%A8%E8%BD%AF%E4%BB%B6.js)
178. [直播神探](software/%E7%9B%B4%E6%92%AD%E7%A5%9E%E6%8E%A2.js)
179. [稻壳阅读器](software/%E7%A8%BB%E5%A3%B3%E9%98%85%E8%AF%BB%E5%99%A8.js)
180. [蓝奏云盘](software/%E8%93%9D%E5%A5%8F%E4%BA%91%E7%9B%98.js)
181. [讯飞/智能文稿字幕系统](software/%E8%AE%AF%E9%A3%9E/%E6%99%BA%E8%83%BD%E6%96%87%E7%A8%BF%E5%AD%97%E5%B9%95%E7%B3%BB%E7%BB%9F.js) inno

