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
    - [Supported Search Site](#supported-search-site)
      - [支持的搜索站点](#支持的搜索站点)
    - [Supported Software](#supported-software)
      - [支持的软件](#支持的软件)
    - [Special Software](#special-software)
      - [特别的软件](#特别的软件)
        - [Special Installer](#special-installer)
          - [特殊的安装方式(作为参考)](#特殊的安装方式作为参考)
        - [Without Download](#without-download)
          - [缺少下载地址](#缺少下载地址)
        - [Without Installer](#without-installer)
          - [缺少安装方式](#缺少安装方式)

<!-- /TOC -->

# SoftwareUpdateManager
## 软件更新管理器

### Note
#### 说明

##### 使用方法

1. `git clone https://github.com/dodying/softwareUpdateManager`
2. `npm install`
3. `git clone https://github.com/dodying/software-for-softwareUpdateManager`
  并移动 **software** 到 **softwareUpdateManager** 下
4. 从[这里](https://github.com/dodying/softwareUpdateManager/releases/tag/plugins)下载 **plugins.7z**，并解压到 **plugins** 下
5. 复制一份 **config.default.js**，按其中注释修改并存为 **config.js**

##### 其他说明

1. 以下软件，如果`通常版(installer)`与`便携版(portable)`功能相同则一般以绿色版优先(如果安装版的包小许多，则可能以安装版优先)，同时64位优先
2. 大多软件都支持自动安装
3. 带 :money_with_wings: 的为**商业软件** (包括Freemium与Free Persion)， 带 :airplane: 的需**番羽土墙**， 带 :hand: 的需**手动下载/安装**， 带 :pushpin: 的表示**安装目录固定**
4. 代理优先级(前提是设置了代理): `config.urlWithoutProxy > config.urlWithProxy > config.useProxy > software.useProxy`
5. 模式优先级: `config.specialMode > config.mode = config.commercialSoftware`
6. 安装方法并没有一一测试，如果自动安装失败，请尝试手动安装


### Command-Line
#### 命令行

* `--help`
* `--makemd`
* `--search keyword`
* `[--profile name] --list`
* `[--quiet] [--profile name] [--filter name] [ --test | --test-download | --test-install | --check | --backup | --install ]`
* `[--quiet] [--profile name] [ --test | --test-download | --test-install | --check | --backup | --install ] [name]`

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


### TODO

* [x] 支持同一软件的不同版本
* [x] 从 [FileHorse.com](http://www.filehorse.com/) 等网站搜索并生成相应js
* [x] 自动检查安装包类型并安装
* [ ] Request模式下，检查文件是否完整


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

  // ?fixedPath: 'fixedPath',

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
    // or func: async (res, $, fns, choice) => { return version }
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
    // func: async (res, $, fns, choice) => { return url }

    // ?output:
    // save to which extension, format: '.ext'
    // eg: output='.zip', it'll be named as 'Telegram-version.zip'
    // or omitted: extension according to download url
  },
  /**
   * omitted => install manually
   * install: async function(output, iPath, fns, choice)
   * @returns {boolean} if install completed
   * @param {string} output the path to the install pack file.
   * @param {string} iPath the path to the bin file.
   */
  install: function (output, iPath, fns) {
    return fns.install(output, iPath)
  }
  /**
   * beforeInstall: async function(output, iPath, fns)
   * afterInstall: async function(output, iPath, fns)
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


### Supported Search Site
#### 支持的搜索站点

1. FileHorse
2. Pc6
3. Softpedia


### Supported Software
#### 支持的软件

<details>
  <summary>Software List Details</summary>

1. [1Clipboard](http://1clipboard.io/)
2. [3proxy](https://github.com/z3APA3A/3proxy/releases/latest) [84/1,195/242] 3proxy - tiny free proxy server.
3. [3RVX](https://3rvx.com/)
4. [7 Sticky Notes](http://www.7stickynotes.com/download.php)
5. [7+ Taskbar Tweaker](https://rammichael.com/downloads/7tt_setup.exe?changelog)
6. [7-Zip](https://www.7-zip.org/download.html)
7. [Abelssoft/AntiBrowserSpy](https://www.abelssoft.de/en/windows/Security-Privacy/AntiBrowserSpy) :money_with_wings: Your Internet browsing habits are your own business! Keep it that way with AntiBrowserSpy.
8. [Abelssoft/AntiLogger](https://www.abelssoft.de/en/windows/Security-Privacy/Abelssoft-AntiLogger) :money_with_wings: Online crime is booming. Protect yourself with AntiLogger. The utility tracks down and deletes spyware.
9. [Abelssoft/AntiRansomware](https://www.abelssoft.de/en/windows/Security-Privacy/AntiRansomware) :money_with_wings: AntiRansomware protects your files from Trojans and you from being blackmailed!
10. [Abelssoft/Artipic](https://www.abelssoft.de/en/windows/Multimedia/Artipic) :money_with_wings: With Artipic photo editing is a snap. Get results like a professional with only a few clicks.
11. [Abelssoft/CheckDrive](https://www.abelssoft.de/en/windows/System-Utilities/CheckDrive) :money_with_wings: Sluggish hard drive? The hard drive doctor can see a hard drive failure coming and warn you ahead of time!
12. [Abelssoft/Converter4Video](https://www.abelssoft.de/en/windows/Multimedia/Converter4Video) :money_with_wings: This program allows you to convert videos into dozens of different formats.
13. [Abelssoft/Cryptbox](https://www.abelssoft.de/en/windows/Security-Privacy/Cryptbox) :money_with_wings: CryptBox uses 256-bit encryption to tightly safegaurd your data. And it does so with a single click.
14. [Abelssoft/EasyBackup](https://www.abelssoft.de/en/windows/System-Utilities/EasyBackup) :money_with_wings: Meta-Description: Backup easy, fast & reliable
15. [Abelssoft/EverDoc](https://www.abelssoft.de/en/windows/Helpers/EverDoc) :money_with_wings: A paperless office isn’t only a dream anymore. EverDoc is the document management of the future!
16. [Abelssoft/File Organizer](https://www.abelssoft.de/en/windows/Helpers/Abelssoft-File-Organizer) :money_with_wings: Fully automatically clean up the PC or have the mess on the desktop removed? Then have a look at this tool! Try
17. [Abelssoft/FileFusion](https://www.abelssoft.de/en/windows/System-Utilities/FileFusion) :money_with_wings: Find duplicate files and save up to 31% of space. Test for free now!
18. [Abelssoft/FileWing Shredder](https://www.abelssoft.de/en/windows/Security-Privacy/FileWing-Shredder) :money_with_wings: Permanent delete of sensitive data is crucial. With FileWing Shredder, it is also extremely easy.
19. [Abelssoft/Find My Files](https://www.abelssoft.de/en/windows/Helpers/Find-My-Files) :money_with_wings: Find Files Quickly
20. [Abelssoft/FolderVisualizer](https://www.abelssoft.de/en/windows/Helpers/FolderVisualizer) :money_with_wings: Hard disk full? With this tool, you will find the biggest culprits at a glance. Download now!
21. [Abelssoft/GClean](https://www.abelssoft.de/en/windows/Security-Privacy/GClean) :money_with_wings: GClean stops the transmission of usage data and makes anonomyous usage of Google services possible.
22. [Abelssoft/HackCheck](https://www.abelssoft.de/en/windows/Security-Privacy/HackCheck) :money_with_wings: HackCheck warns in case of hacking attacks ☠ Monitors your accounts  🔍 Gives you an alert in case of hacker attack
23. [Abelssoft/JetDrive](https://www.abelssoft.de/en/windows/System-Utilities/JetDrive) :money_with_wings: JetDrive defragments your hard drive and optimizes your RAM and registry. Click here for more info.
24. [Abelssoft/KeyDepot](https://www.abelssoft.de/en/windows/Security-Privacy/KeyDepot) :money_with_wings: Secure passwords and everyday convience are not mutually exclusive - at least not with KeyDepot.
25. [Abelssoft/MovieCut](https://www.abelssoft.de/en/windows/Multimedia/MovieCut) :money_with_wings: With MovieCut video editing is a snap. Get results like a professional with only a few clicks.
26. [Abelssoft/mp3 cutter](https://www.abelssoft.de/en/windows/Multimedia/mp3-cutter) :money_with_wings: Create your own ringtones? This tool allows you to edit MP3 files with just a few clicks.
27. [Abelssoft/MyKeyFinder](https://www.abelssoft.de/en/windows/Helpers/MyKeyFinder) :money_with_wings: Missing your product key? MyKeyFinder finds all installed licence keys and lists them in a clear way!
28. [Abelssoft/PC Fresh](https://www.abelssoft.de/en/windows/System-Utilities/PC-Fresh) :money_with_wings: PC Fresh provides a professional optimization of Windows, allowing you to unleash the full potential of your PC.
29. [Abelssoft/PDFCompressor](https://www.abelssoft.de/en/windows/Helpers/PDFCompressor) :money_with_wings: You can reduce the size of PDFs by up to 80%. Especially great if sending emails is a “big deal” for you.
30. [Abelssoft/Photastic](https://www.abelssoft.de/en/windows/Multimedia/Photastic) :money_with_wings: Improved and repaired Fotos
31. [Abelssoft/PhotoBoost](https://www.abelssoft.de/en/windows/Multimedia/PhotoBoost) :money_with_wings: Optimizes photos with one click
32. [Abelssoft/PriWeb](https://www.abelssoft.de/en/windows/Security-Privacy/PriWeb) :money_with_wings: Surfing the Internet anonymously or doing online banking securely. PriWeb offers premium VPN cover made in Germany. Try it out now for free!
33. [Abelssoft/Recordify](https://www.abelssoft.de/en/windows/Multimedia/Recordify) :money_with_wings: Download and save music for free! Very easily with Recordify! Try it now!
34. [Abelssoft/Registry Cleaner](https://www.abelssoft.de/en/windows/System-Utilities/Abelssoft-Registry-Cleaner) :money_with_wings: Inexplicable Windows error? This utility eliminates stubborn problems and gives your Windows registry a overhaul!
35. [Abelssoft/Screenphoto](https://www.abelssoft.de/en/windows/Multimedia/Screenphoto) :money_with_wings: Create screenshots easily. Multiple modes: Window, scrollable websites, and much more!
36. [Abelssoft/ScreenVideo](https://www.abelssoft.de/en/windows/Multimedia/ScreenVideo) :money_with_wings: The best screen recorder for recording the screen as video. New with moderator and picture-in-picture function. Try it for free now!
37. [Abelssoft/Send2Phone](https://www.abelssoft.de/en/windows/Helpers/Send2Phone) :money_with_wings: Easily send files from PC to mobile – or the other way around. Send2Phone is the key.
38. [Abelssoft/SSD Fresh](https://www.abelssoft.de/en/windows/System-Utilities/SSD-Fresh) :money_with_wings: SSD drives are expensive. This tool optimizes disk access and enhances the lifecycle of your SSD.
39. [Abelssoft/StartupStar](https://www.abelssoft.de/en/windows/System-Utilities/StartupStar) :money_with_wings: Looking for a faster takeoff? StartupStar cuts the brakes on your Windows startup. Learn more here.
40. [Abelssoft/SyncManager](https://www.abelssoft.de/en/windows/Helpers/SyncManager) :money_with_wings: Need to sync files automatically? That’s a job for this tool. Set it up once and it simply works.
41. [Abelssoft/Tagman](https://www.abelssoft.de/en/windows/Multimedia/Tagman) :money_with_wings: Fill in and save missing ID3 tag track details with Tagman, or rename files automatically.
42. [Abelssoft/ToolbarTerminator](https://www.abelssoft.de/en/windows/Security-Privacy/ToolbarTerminator) :money_with_wings: Annoying toolbars cluttering your browser? ToolbarTerminator eliminates these pests with a single click.
43. [Abelssoft/Undeleter](https://www.abelssoft.de/en/windows/Helpers/Abelssoft-Undeleter) :money_with_wings: Accidentally deleted some important files? Undeleter restores deleted files instantly.
44. [Abelssoft/WashAndGo](https://www.abelssoft.de/en/windows/System-Utilities/WashAndGo) :money_with_wings: Hard drive full? PC slow? WashAndGo frees any Windows computer from old, accumulated junk. –
45. [Abelssoft/Win10PrivacyFix](https://www.abelssoft.de/en/windows/Security-Privacy/Win10PrivacyFix) :money_with_wings: Put a cork in Windows 10’s data leakage! This tool shields your personal data from Microsoft’s sticky fingers.
46. [Abelssoft/YouTube Song Downloader](https://www.abelssoft.de/en/windows/Multimedia/YouTube-Song-Downloader) :money_with_wings: Download all the music and videos from YouTube for free and save it with a single click.
47. [Abricotine](https://github.com/brrd/Abricotine/releases/latest) [58/1,822/131] Markdown editor with inline preview.
48. [ACBF Viewer](https://launchpad.net/acbf/+download)
49. [Actiona](https://wiki.actiona.tools/doku.php?id=:en:start)
50. [ActiveCollab-Electron](https://github.com/nurtext/active-collab-desktop/releases/latest) [9/31/11] Unofficial Active Collab Desktop application based on Electron.
51. [ActiveCollab](https://activecollab.com/help/release-notes/)
52. [ActivePresenter](https://atomisystems.com/download/) [Free Personal]
53. [Actual Tools/Actual File Folders](https://www.actualtools.com/filefolders/download/) :money_with_wings:
54. [Actual Tools/Actual Multiple Monitors](https://www.actualtools.com/multiplemonitors/) :money_with_wings:
55. [Actual Tools/Actual Title Buttons](https://www.actualtools.com/titlebuttons/) :money_with_wings:
56. [Actual Tools/Actual Transparent Window](https://www.actualtools.com/transparentwindow/) :money_with_wings:
57. [Actual Tools/Actual Virtual Desktops](https://www.actualtools.com/virtualdesktops/) :money_with_wings:
58. [Actual Tools/Actual Window Guard](https://www.actualtools.com/windowmanager/) :money_with_wings:
59. [Actual Tools/Actual Window Manager](https://www.actualtools.com/windowmanager/) :money_with_wings:
60. [Actual Tools/Actual Window Menu](https://www.actualtools.com/windowmenu/) :money_with_wings:
61. [Actual Tools/Actual Window Minimizer](https://www.actualtools.com/windowminimizer/download/) :money_with_wings:
62. [Actual Tools/Actual Window Rollup](https://www.actualtools.com/windowrollup/) :money_with_wings:
63. [Ad Muncher](https://www.softpedia.com/get/Internet/Popup-Ad-Spyware-Blockers/Ad-Muncher.shtml) :hand: Powerful program which helps individuals block advertisements and popups for some of the most used web browsers, and configure a huge list of parameters
64. [Adguard](https://www.softpedia.com/get/Internet/Popup-Ad-Spyware-Blockers/Adguard.shtml) [Free Personal] One of the best ad blocker and pop-up killers for all web browsers, protects against phishing and reduces both page load time and data usage
65. [Advanced IP Scanner](http://www.advanced-ip-scanner.com/)
66. [Advanced Renamer](https://www.advancedrenamer.com/download)
67. [Advanced REST Client](https://github.com/advanced-rest-client/arc-electron/releases/latest) [30/329/55] Advanced REST Client - electron app.
68. [AIDA64 Engineer](https://www.aida64.co.uk/download) [Free Personal]
69. [AIDA64 Extreme](https://www.aida64.co.uk/download) [Free Personal]
70. [Aignes/AM-DeadLink](https://www.aignes.com/deadlink.htm#)
71. [Aignes/AM-Notebook](https://www.aignes.com/notebook.htm) :money_with_wings:
72. [Aignes/Local Website Archive](https://www.aignes.com/lwa.htm) :money_with_wings:
73. [Aignes/PixiShot](https://www.aignes.com/pixishot.htm)
74. [Aignes/Portable Start Menu](https://www.aignes.com/psmenu.htm)
75. [Aignes/WebSite-Watcher](https://www.aignes.com/download.htm) :money_with_wings:
76. [AIMP](http://www.aimp.ru/?do=download&os=windows)
77. [AirExplorer](https://airexplorer.net/en/download.php) [Free Personal]
78. [AkelPad](https://sourceforge.net/projects/akelpad/files/AkelPad%204/) A simple notepad-like text editor with many features. It is designed to be a small and fast.
79. [Alacritty](https://github.com/jwilm/alacritty/releases/latest) [349/16,188/710] A cross-platform, GPU-accelerated terminal emulator
80. [AlephNote](https://github.com/Mikescher/AlephNote/releases/latest) [10/96/9] Lightweight note taking client for Simplenote or Standard Notes (or simply local storage)
81. [alexnolan/ADO Fielder](http://www.alexnolan.net/software/adofielder.xml)
82. [alexnolan/Chronometask](http://www.alexnolan.net/software/chronometask.xml)
83. [alexnolan/DBF Viewer Plus](http://www.alexnolan.net/software/dbf.xml)
84. [alexnolan/Drive Manager](http://www.alexnolan.net/software/drivemanager.xml)
85. [alexnolan/MDB Viewer Plus](http://www.alexnolan.net/software/mdbplus.xml)
86. [alexnolan/Optical info](http://www.alexnolan.net/software/opticalinfo.htm)
87. [alexnolan/System Spec](http://www.alexnolan.net/software/sysspec.xml)
88. [alexnolan/Window Seizer](http://www.alexnolan.net/software/window_seizer.htm)
89. [allTags](https://alltags.net/?target=download&lang=en_us)
90. [Altair](https://github.com/imolorhe/altair/releases/latest) [25/1,250/55] ✨⚡️ A beautiful feature-rich GraphQL Client for all platforms.
91. [AltDrag](https://github.com/stefansundin/altdrag/releases//latest) [27/529/44] :file_folder: Easily drag windows when pressing the alt key. (Windows)
92. [Aminal](https://github.com/liamg/aminal/releases/latest) [37/1,954/65] A modern cross-platform terminal emulator in Go.
93. [Anki](https://apps.ankiweb.net/)
94. [annie](https://github.com/iawia002/annie/releases/latest) [153/5,913/486] 👾 Fast, simple and clean video downloader.
95. [Ant Download Manager](https://antdownloadmanager.com/download.php) [Free Personal]
96. [Any Video Converter](https://www.any-video-converter.com/products/for_video_ultimate/whatnew.php) [Free Personal]
97. [AnyBurn](http://www.anyburn.com/cn/index.htm)
98. [AnyDesk](https://anydesk.com/platforms/windows) [Freemium]
99. [Ao](https://github.com/klaussinani/ao/releases/latest) [37/979/98] ✔️ Elegant Microsoft To-Do desktop app.
100. [ApexDC++](https://sourceforge.net/projects/apexdc/files/ApexDC%2B%2B/) The pinnacle of file-sharing and chat - an innovative DC client!
101. [APK Messenger](http://www.pc6.com/softview/SoftView_538551.html)
102. [APK-Info](https://github.com/Enyby/APK-Info/releases/latest) [10/71/10] APK-Info is a Windows tool to get detailed info about an apk file.
103. [Apowersoft/ApowerManager](https://www.softpedia.com/get/Mobile-Phone-Tools/Others/Apowersoft-Phone-Manager.shtml) :money_with_wings: A user-friendly and effective program that can help you manage the contents of your mobile phone, be it an Android or iOS device
104. [Apowersoft/ApowerMirror](https://www.softpedia.com/get/Mobile-Phone-Tools/Others/ApowerMirror.shtml) :money_with_wings: Connect your Android or iOS phone to a computer to have the screen of the handheld device mirrored on the PC's monitor and to control the phone using the PC's keyboard and mouse
105. [Apowersoft/ApowerPDF](https://www.softpedia.com/get/Office-tools/PDF/ApowerPDF.shtml) :money_with_wings: Edit and convert PDFs to various file formats with the help of this engaging piece of software that also integrates OCR technology for users working with scanned documents
106. [Apowersoft/ApowerREC](https://www.softpedia.com/get/Multimedia/Video/Video-Recording/ApowerREC.shtml) :money_with_wings: A modern-looking screen recorder that can capture the desktop activity, while also allowing you to take screenshots of specific areas or the entire screen
107. [Apowersoft/APOWERRECOVER](https://www.softpedia.com/get/System/Back-Up-and-Recovery/APOWERRECOVER.shtml) :money_with_wings: Tries to recover photos, videos, documents, archives, and other file types that were previously erased from a particular location on your PC
108. [Apowersoft/ApowerShow](https://www.softpedia.com/get/Multimedia/Video/Encoders-Converter-DIVX-Related/ApowerShow.shtml) :money_with_wings: Combine clips, photos, and music together into a single video and apply one of the available templates to create compelling content
109. [Apowersoft/Apowersoft Android Recorder](https://www.softpedia.com/get/Multimedia/Video/Video-Recording/Apowersoft-Android-Recorder.shtml) :money_with_wings: Cast and record the activity from your Android device with the help of this streamlined and user-friendly Chromecast-based application
110. [Apowersoft/Apowersoft Episode Downloader](https://www.softpedia.com/get/Internet/Download-Managers/Apowersoft-Episode-Downloader.shtml) Search for favorite episodes all over the Internet, download them or watch and record live TV with this powerful software utility
111. [Apowersoft/Apowersoft Free Audio Recorder](https://www.softpedia.com/get/Multimedia/Audio/Audio-Editors-Recorders/Apowersoft-Free-Audio-Recorder.shtml) An intuitive software application that enables users to record surrounding or system sounds, manage their recorded files and edit tags
112. [Apowersoft/Apowersoft Free Screen Capture](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Capture/Apowersoft-Free-Screen-Capture.shtml) Grab screenshots from your desktop or record videos and share them on social network or save it to your PC with this practical program
113. [Apowersoft/Apowersoft HEIC Converter](https://www.softpedia.com/get/Multimedia/Graphic/Image-Convertors/Apowersoft-HEIC-Converter.shtml) :money_with_wings: A converter designed to process Apple's HEIC (High Efficiency Image Format) files, obtaining JPEG images, which can be opened with many more editors
114. [Apowersoft/Apowersoft iPhone iPad Recorder](https://www.softpedia.com/get/Mobile-Phone-Tools/IPhone/iPhone-iPad-Recorder.shtml) :money_with_wings: Connect your iPhone or iPad to your computer and stream real-time images and videos that you can share seamlessly with this utility
115. [Apowersoft/Apowersoft PDF Converter](https://www.softpedia.com/get/Office-tools/PDF/Apowersoft-PDF-Converter.shtml) :money_with_wings: Convert PDFs to other file formats or vice versa with this intuitive application which comes with many more tools and useful features
116. [Apowersoft/Apowersoft Photo Viewer](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Viewers/Apowersoft-Photo-Viewer.shtml) View images from your computer, edit them, capture screenshots and view slideshows by turning to this comprehensive software utility
117. [Apowersoft/Apowersoft Screen Capture Pro](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Capture/Apowersoft-Screen-Capture-Pro.shtml) :money_with_wings: Effortlessly take screenshots and make recording of your desktop's windows or points of interest, edit and then share them on social networks with this app
118. [Apowersoft/Apowersoft Screen Recorder Pro](https://www.softpedia.com/get/Multimedia/Video/Video-Recording/Apowersoft-Free-Screen-Recorder.shtml) :money_with_wings: Record your screen activity to WMV file format, as well as take screenshots, edit them, and save them to PNG, JPEG, BMP, GIF, or TIF file format
119. [Apowersoft/Apowersoft Streaming Video Recorder](https://www.softpedia.com/get/Multimedia/Video/Video-Recording/Apowersoft-Streaming-Video-Recorder.shtml) :money_with_wings: Records videos, TV shows or online movies, providing support for some of the most popular video hosting websites, and allowing you to convert the output to widely-used video formats
120. [Apowersoft/Apowersoft Video Converter Studio](https://www.softpedia.com/get/Multimedia/Video/Encoders-Converter-DIVX-Related/Apowersoft-Video-Converter-Studio.shtml) :money_with_wings: Convert between popular multimedia formats and extract audio tracks from videos with the help of this easy-to-use and intuitive software solution
121. [Apowersoft/Apowersoft Video Download Capture](https://www.softpedia.com/get/Internet/Download-Managers/Apowersoft-YouTube-Downloader.shtml) :money_with_wings: Download videos from various online hosting websites and convert them to other formats, or record your screen to create tutorials
122. [Apowersoft/Apowersoft Video Editor](https://www.softpedia.com/get/Multimedia/Video/Video-Editors/Apowersoft-Video-Editor.shtml) :money_with_wings: A modern-looking video creator that can combine photos and short clips, filters and overlays to create short movies and slideshows
123. [Apowersoft/BeeCut](https://www.softpedia.com/get/Multimedia/Video/Video-Editors/BeeCut.shtml) :money_with_wings: Creating a stunning video from the footage you took with your phone, ready to be posted on social media or blogs, using this application
124. [Apowersoft/Free Music Downloader](https://www.softpedia.com/get/Multimedia/Audio/Other-AUDIO-Tools/Free-Music-Downloader.shtml) :money_with_wings: Download free music from online sources, convert songs to new formats, edit them, or burn them to discs with the help of this application
125. [Apowersoft/ShowMore](https://www.softpedia.com/get/Multimedia/Video/Video-Recording/ShowMore.shtml) Record any activities you are performing on your screen with or without sound and suitable resolution using this simple software solution
126. [Apowersoft/Streaming Audio Recorder](https://www.softpedia.com/get/Multimedia/Audio/Audio-Editors-Recorders/Streaming-Audio-Recorder.shtml) :money_with_wings: Record the sound streams coming from any application currently running on your computer and also convert audio files to various formats
127. [Apowersoft/Windows Shutdown Assistant](https://www.softpedia.com/get/System/Launchers-Shutdown-Tools/Windows-7-Shutdown-Assistant.shtml) :money_with_wings: Automate system tasks, like log off, shut down, restart, hibernate, lock, turn off monitor, run screensaver, open custom file or program, or stop a tool or service, as well as take custom notes on your screen
128. [AppleApplicationSupport](https://www.softpedia.com/get/IPOD-TOOLS/Other-IPOD-tools-Updates/iTunes.shtml) :pushpin: Enables you to manage contents such as music, movies, TV shows and apps on your iOS devices with no more than a few mouse clicks
129. [Arctime](https://arctime.org/download.html) [Free Personal]
130. [aria2-desktop](https://github.com/wapznw/aria2desktop/releases/latest) [10/91/6] 一个漂亮的aria2的UI界面 aria2ui, aria2gui.
131. [aria2](https://github.com/aria2/aria2/releases/latest) [645/14,750/1,642] aria2 is a lightweight multi-protocol & multi-source, cross platform download utility operated in command-line. It supports HTTP/HTTPS, FTP, SFTP, BitTorrent and Metalink.
132. [ArsClip](https://www.softpedia.com/get/Office-tools/Clipboard/ArsClip.shtml) Monitor the clipboard, store all the copied text entries in a single place and browse the clipboard history with this easy-to-use application
133. [Artweaver](https://www.artweaver.de/en/changelog) [Free Personal]
134. [AS SSD Benchmark](https://www.alex-is.de/PHP/fusion/downloads.php?download_id=9)
135. [Ashampoo/Ashampoo 3D CAD Architecture](https://www.softpedia.com/get/Science-CAD/Ashampoo-3D-CAD-Architecture.shtml) :money_with_wings: An extensive CAD software solution for exact and realistic planning of construction projects, so that users can preview their designs before implementing them
136. [Ashampoo/Ashampoo 3D CAD Professional](https://www.softpedia.com/get/Science-CAD/Ashampoo-3D-CAD-Professional.shtml) :money_with_wings: Build and edit both 2D and 3D objects, with this comprehensive CAD utility that is suitable for professional architects and engineers
137. [Ashampoo/Ashampoo ActionCam](https://www.softpedia.com/get/Multimedia/Video/Video-Editors/Ashampoo-ActionCam.shtml) :money_with_wings: Stabilize videos and improve their quality with this capable editor that also features an array of features for color management or distortion control
138. [Ashampoo/Ashampoo Anti-Virus](https://www.softpedia.com/get/Antivirus/Ashampo-AntiVirus.shtml) :money_with_wings: Keep your computer malware-free, as well as functioning at top performance, by using this reliable and user-friendly security solution
139. [Ashampoo/Ashampoo AntiSpy](https://www.softpedia.com/get/Tweak/System-Tweak/Ashampoo-AntiSpy.shtml) Disable tracking features of Windows 10 and prevent third-party applications from accessing your calendar, contacts, emails or messages
140. [Ashampoo/Ashampoo AudioCD MP3 Studio](https://www.softpedia.com/get/CD-DVD-Tools/Audio-CD-DVD-Burning/Ashampoo-AudioCD-MP-Studio.shtml) :money_with_wings: Automatically import album, title and track details for your audio CDs from an online database with the help of this useful multi-purpose software
141. [Ashampoo/Ashampoo Backup Business Server](https://www.softpedia.com/get/System/Back-Up-and-Recovery/Ashampoo-Backup-Business-Server.shtml) :money_with_wings: A dedicated server solution specifically designed for the business environment, providing a backup wizard that can target local or cloud storage
142. [Ashampoo/Ashampoo Backup Business](https://www.softpedia.com/get/System/Back-Up-and-Recovery/Ashampoo-Backup-Business.shtml) :money_with_wings: A reliable data backup solution for the business environment, providing support for both local and cloud backups with AES-256 encryption
143. [Ashampoo/Ashampoo Backup Pro](https://www.softpedia.com/get/System/Back-Up-and-Recovery/Ashampoo-Backup-Pro.shtml) :money_with_wings: Create backup copies of significant files on your computer by turning to this reliable application that features schedule support
144. [Ashampoo/Ashampoo Burning Studio 2019](https://www.softpedia.com/get/CD-DVD-Tools/Data-CD-DVD-Burning/Ashampoo-Burning-Studio-2019.shtml) A fully-featured disc burning and ripping utility that enables you to create all kinds of data CDs and DVDs, as well as backup your files and design case covers
145. [Ashampoo/Ashampoo Burning Studio Elements](https://www.softpedia.com/get/CD-DVD-Tools/Data-CD-DVD-Burning/Ashampoo-Burning-Studio-Elements.shtml) :money_with_wings: Easily and quickly create data discs, burn backups, rip music, create audio CDs or burn already existing film files on Blu-ray Disc
146. [Ashampoo/Ashampoo Burning Studio FREE](https://www.softpedia.com/get/CD-DVD-Tools/Data-CD-DVD-Burning/Ashampoo-Burning-Studio-Free.shtml) A fully-featured disc burning and ripping utility that enables you to create all kinds of data CDs and DVDs, as well as backup your files and design case covers
147. [Ashampoo/Ashampoo Burning Studio](https://www.softpedia.com/get/CD-DVD-Tools/Data-CD-DVD-Burning/Ashampoo-Burning-Studio.shtml) :money_with_wings: Burn a wide range of files to discs, generate ISO images, design covers and save unfinished projects with this reliable application
148. [Ashampoo/Ashampoo ClipFinder HD](https://www.softpedia.com/get/Multimedia/Video/Other-VIDEO-Tools/Ashampoo-ClipFinder.shtml) Find, download and convert video files from YouTube, Veoh, Vimeo,  Daily Motion, Google Videos, and others sources using this straightforward app
149. [Ashampoo/Ashampoo Core Tuner](https://www.softpedia.com/get/System/System-Miscellaneous/Ashampoo-Core-Tuner.shtml) :money_with_wings: An application designed to provide users with the possibility to get the most out of the multi-core processors inside their computers
150. [Ashampoo/Ashampoo Cover Studio](https://www.softpedia.com/get/Authoring-tools/Cover-editors/Ashampoo-Cover-Studio.shtml) One of the easiest ways to create professional-looking disc labels, covers and booklets, courtesy of a series of included themes and templates
151. [Ashampoo/Ashampoo Disk-Space-Explorer 2018](https://www.softpedia.com/get/System/Hard-Disk-Utils/Ashampoo-Disk-Space-Explorer.shtml) Explore disk space consumption and file distribution with the help of this approachable application that illustrates data using pie charts
152. [Ashampoo/Ashampoo Driver Updater](https://www.softpedia.com/get/System/System-Miscellaneous/Ashampoo-Driver-Updater.shtml) :money_with_wings: Scans your computer for outdated drivers and helps you download and install the latest versions, so as to keep your computer functioning at top performance
153. [Ashampoo/Ashampoo Gadge It](https://www.softpedia.com/get/Authoring-tools/Authoring-Related/Ashampoo-Gadge-It.shtml) :money_with_wings: Enhance your desktop with cool self-made gadgets or create modern-looking browser menus with the help of this east to use application
154. [Ashampoo/Ashampoo HDD Control Corporate Edition](https://www.softpedia.com/get/System/Hard-Disk-Utils/Ashampoo-HDD-Control-3-Corporate-Edition.shtml) :money_with_wings: A reliable hard disk analysis and diagnosis application, which offers you a series of powerful tools for disk defragmentation or drive cleaner
155. [Ashampoo/Ashampoo HDD Control](https://www.softpedia.com/get/System/Hard-Disk-Utils/Ashampoo-HDD-Control.shtml) :money_with_wings: A software utility that enables users to monitor, maintain and defragment their hard drives in order to improve the computer’s performance
156. [Ashampoo/Ashampoo Home Design](https://www.softpedia.com/get/Others/Home-Education/Ashampoo-Home-Designer-Pro.shtml) :money_with_wings: Turn your computer into a design studio and planning software, design and decorate the exterior and the interior of your dream house
157. [Ashampoo/Ashampoo Home Designer](https://www.softpedia.com/get/Others/Home-Education/Ashampoo-Home-Designer.shtml) A user-friendly and powerful program that helps you visualize a house renovation in a 3D workspace and customize the rooms with various preset objects
158. [Ashampoo/Ashampoo Internet Accelerator Free](https://www.softpedia.com/get/Tweak/Modem-Tweak/Ashampoo-Internet-Accelerator.shtml) Boost the speed of your internet connection by changing Windows default parameters with this comprehensive app that comes with an intuitive layout
159. [Ashampoo/Ashampoo Internet Accelerator](https://www.softpedia.com/get/Tweak/Modem-Tweak/Internet-Accelerator.shtml) :money_with_wings: Instant Clickfix for your Internet connection alongside some interesting tools to work with in case you experience slow speeds and poor quality
160. [Ashampoo/Ashampoo Magical Defrag](https://www.softpedia.com/get/System/Hard-Disk-Utils/Ashampoo-Magic-Defrag.shtml) :money_with_wings: A simple tool that provides you with the possibility to unleash your computer's hidden performance by defragmenting the hard drive when the computer is idle
161. [Ashampoo/Ashampoo Magical Security](https://www.softpedia.com/get/Security/Encrypting/Ashampoo-Magic-Security.shtml) An intuitive application that helps users protect their sensitive data from unauthorized viewing by offering a powerful encryption algorithm
162. [Ashampoo/Ashampoo Magical Snap Free](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Capture/Ashampoo-Magical-Snap-Free.shtml) Clear-cut program that enables you to take custom snapshots, perform multiple editing operations, apply several effects, save resulted images or send them via e-mail
163. [Ashampoo/Ashampoo Media Sync](https://www.softpedia.com/get/Mobile-Phone-Tools/Others/Ashampoo-Media-Sync.shtml) :money_with_wings: A user-friendly software solution that enables users to effortlessly synchronize the contents of several devices to their computer
164. [Ashampoo/Ashampoo Movie Shrink & Burn](https://www.softpedia.com/get/Multimedia/Video/Video-Editors/Ashampoo-Movie-Shrink-Burn.shtml) An intuitive and user-friendly software solution that comes in handy when you want to burn videos to DVDs or Blu-ray discs, as well as shrink your movies' sizes with ease
165. [Ashampoo/Ashampoo Movie Studio](https://www.softpedia.com/get/Multimedia/Video/Video-Editors/Ashampoo-Movie-Studio.shtml) :money_with_wings: Allows you to edit and combine video clips, transition effects and music files in order to create personalized movies for your enjoyment
166. [Ashampoo/Ashampoo Music Studio](https://www.softpedia.com/get/Multimedia/Audio/Other-AUDIO-Tools/Ashampoo-Music-Studio.shtml) :money_with_wings: Rip, edit, convert, record, repair and burn music to discs with the help of this comprehensive digital music collection application
167. [Ashampoo/Ashampoo MyAutoPlay Menu](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Others/Ashampoo-MyAutoPlay-Menu.shtml) :money_with_wings: This is a useful and effective application that comes in handy for users who need to easily build autoplay CDs, DVDs or thumb drives
168. [Ashampoo/Ashampoo Office](https://www.softpedia.com/get/Office-tools/Office-suites/Ashampoo-Office-2006.shtml) :money_with_wings: An office suite with sufficient options to aid you in creating text documents and presentations, writing mathematical equations, designing tables and charts
169. [Ashampoo/Ashampoo PDF Pro](https://www.softpedia.com/get/Office-tools/PDF/Ashampoo-PDF-Pro.shtml) :money_with_wings: View, edit, and protect PDF files with the help of this comprehensive software utility that should cater to the needs of all users alike
170. [Ashampoo/Ashampoo Photo Card](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Editors/Ashampoo-Photo-Card.shtml) :money_with_wings: Helps you create eye-catching photo cards using images from your computer or webcam stills, while also providing you with extra functions
171. [Ashampoo/Ashampoo Photo Commander FREE](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Editors/Ashampoo-Photo-Commander-Free.shtml) Manage your photo collection, optimize and edit your multimedia files by creating slideshows with background sounds or add different effects and objects to your photos
172. [Ashampoo/Ashampoo Photo Commander](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Viewers/Ashampoo-Photo-Commander.shtml) :money_with_wings: Preview your photos, enhance them using various tools and effects, organize and share them with ease using a feature-rich application
173. [Ashampoo/Ashampoo Photo Converter](https://www.softpedia.com/get/Multimedia/Graphic/Image-Convertors/Ashampoo-Photo-Converter.shtml) :money_with_wings: An all-in-one photo conversion and editing tool that comes with options for resizing images, changing colors and applying effects
174. [Ashampoo/Ashampoo Photo Mailer](https://www.softpedia.com/get/Internet/E-mail/Mail-Utilities/Ashampoo-Photo-Mailer.shtml) :money_with_wings: Assign a short text message to each of your digital images and quickly send them via e-mail to your friends without a lot of effort
175. [Ashampoo/Ashampoo Photo Optimizer 2018](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Editors/Ashampoo-Photo-Optimizer-Free.shtml) Whip your photos into shape with just a click of the mouse by turning to this comprehensive software solution that packs an intuitive layout
176. [Ashampoo/Ashampoo Photo Optimizer](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Editors/Ashampoo-Photo-Optimizer.shtml) :money_with_wings: One click optimization, stunning effects, editing and correction functions for your photo collection, all bundled into a single package
177. [Ashampoo/Ashampoo Photo Recovery](https://www.softpedia.com/get/System/Back-Up-and-Recovery/Ashampoo-GetBack-Photo.shtml) :money_with_wings: A software solution for users who require a fast and effective tool for the retrieval of lost, deleted images, which provides two scanning modes
178. [Ashampoo/Ashampoo Privacy Protector](https://www.softpedia.com/get/Security/Security-Related/Ashampoo-Privacy-Protector.shtml) :money_with_wings: Hide and secure any file, folder or drive on your computer, as well as clear your browsers history with this comprehensive and powerful piece of software
179. [Ashampoo/Ashampoo Red Ex](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Editors/Ashampoo-Red-Ex.shtml) :money_with_wings: A red-eye removal utility that comes with the ability to automatically detect and correct the annoying camera flash effect from your pictures
180. [Ashampoo/Ashampoo Registry Cleaner](https://www.softpedia.com/get/Tweak/Registry-Tweak/Ashampoo-Registry-Cleaner.shtml) :money_with_wings: Optimize your system's registry so as to enhance the performance of your computer and keep it running at top speed with this handy tool
181. [Ashampoo/Ashampoo Slideshow Studio 2017](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Editors/Ashampoo-Slideshow-Studio-Elements.shtml) :money_with_wings: Create cool slideshows the easy way with the help of this powerful slideshow creator that also offers a wide range of personalization features
182. [Ashampoo/Ashampoo Slideshow Studio HD](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Editors/Ashampoo-Slideshow-Studio-HD.shtml) :money_with_wings: Create slideshows from multiple photos on your computer, adding them musical background to make them more appealing to your audience
183. [Ashampoo/Ashampoo Snap Business](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Capture/Ashampoo-Snap-Business.shtml) Capture screenshots or record display activity with this feature-rich utility that allows quick output editing and file uploading, providing OCR recognition and timed actions
184. [Ashampoo/Ashampoo Snap Free](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Capture/Ashampoo-Snap-Free.shtml) :money_with_wings: Powerful video and graphic capturing application that delivers a generous set of features, all bundled inside a modern-looking interface
185. [Ashampoo/Ashampoo Snap](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Capture/Ashampoo-Magical-Snap.shtml) :money_with_wings: Easily capture, illustrate and share your viewing experience by creating and sending screenshots and videos in just a few seconds
186. [Ashampoo/Ashampoo Spectre Meltdown CPU Checker](https://www.softpedia.com/get/Security/Security-Related/Ashampoo-Spectre-Meltdown-CPU-Checker.shtml) Check whether your computer is vulnerable against the Meltdown and Spectre security flaws Intel reported and get advice on the actions to take
187. [Ashampoo/Ashampoo StartUp Tuner](https://www.softpedia.com/get/Tweak/System-Tweak/Ashampoo-StartUp-Tuner.shtml) Finds and displays all programs started automatically by Windows
188. [Ashampoo/Ashampoo Undeleter](https://www.softpedia.com/get/System/Back-Up-and-Recovery/Ashampoo-Undeleter.shtml) :money_with_wings: Recover deleted files and folders from your computer and USB flash drives with a little help from this user-friendly and handy program
189. [Ashampoo/Ashampoo UnInstaller](https://www.softpedia.com/get/Security/Secure-cleaning/Ashampoo-UnInstaller-Platinum-Suite.shtml) :money_with_wings: Advanced programs uninstaller for your computer, providing intelligent monitoring of installed applications and system modifications
190. [Ashampoo/Ashampoo Video Converter](https://www.softpedia.com/get/Multimedia/Video/Encoders-Converter-DIVX-Related/Ashampoo-Video-Converter.shtml) :money_with_wings: A video editor and converter that enables you to encode your videos to a format that is supported by the device you want to play it on
191. [Ashampoo/Ashampoo Video Deflicker](https://www.softpedia.com/get/Multimedia/Video/Video-Editors/Ashampoo-Video-Deflicker.shtml) :money_with_wings: Remove flicker from videos and correct their overall appearance with this application that also features white balance correction and cropping tools
192. [Ashampoo/Ashampoo Video Fisheye Removal](https://www.softpedia.com/get/Multimedia/Video/Video-Editors/Ashampoo-Video-Fisheye-Removal.shtml) :money_with_wings: Correct that annoying lens distortion on videos shot with wide-angle lenses by using this application that features built-in live preview
193. [Ashampoo/Ashampoo Video Optimizer Pro](https://www.softpedia.com/get/Multimedia/Video/Video-Editors/Ashampoo-Video-Optimizer-Pro.shtml) :money_with_wings: Significantly enhance the quality of your videos by correcting shaky footage and optimizing colors and contrasts using this application
194. [Ashampoo/Ashampoo Video Stabilization](https://www.softpedia.com/get/Multimedia/Video/Video-Editors/Ashampoo-Video-Stabilization.shtml) :money_with_wings: Improve your videos by stabilizing them and reduce shakiness with this application that offers a bundle of video processing tools
195. [Ashampoo/Ashampoo Video Styler](https://www.softpedia.com/get/Multimedia/Video/Video-Editors/Ashampoo-Video-Styler.shtml) :money_with_wings: A powerful and user-friendly program that helps you rotate and mirror videos, resize them, apply special effects, as well as adjust the color parameters (brightness, contrast, gamma, saturation)
196. [Ashampoo/Ashampoo Virus Quickscan](https://www.softpedia.com/get/Antivirus/Ashampoo-Virus-Quickscan.shtml) Scan your PC and verify it for any files infected with viruses or spyware with this compact, portable and very easy-to-use application
197. [Ashampoo/Ashampoo WinOptimizer Free](https://www.softpedia.com/get/System/OS-Enhancements/Ashampoo-WinOptimizer.shtml) A powerful and easy to use application that allows you to optimize your computer and its operating system by securing, cleaning and tweaking it
198. [Ashampoo/Ashampoo WinOptimizer](https://www.softpedia.com/get/System/OS-Enhancements/Ashampoo-WinOptimizer-Platinum-Suite.shtml) :money_with_wings: Clean, defragment and optimize your computer in order to have it running at top performance and take advantage of its capabilities
199. [Ashampoo/Ashampoo ZIP Free](https://www.softpedia.com/get/Compression-tools/Ashampoo-ZIP-Free.shtml) With the help of this application you can explore the content of archives without decompressing and create new archives with ease
200. [Ashampoo/Ashampoo ZIP Pro](https://www.softpedia.com/get/Compression-tools/Ashampoo-ZIP-Pro.shtml) :money_with_wings: A powerful file compression, archive managment and encryption suite of tools, with an integrated cloud browser and backup functions
201. [Ashampoo/CutOut](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Editors/CutOut-ashampoo.shtml) :money_with_wings: Create stunning montages and combine elements from your favorite pictures into a collage that looks realistic to your viewers via this tool
202. [AstroGrep](https://sourceforge.net/projects/astrogrep/files/AstroGrep%20%28Win32%29/) A Windows File Searching Utility (grep)
203. [atnsoft/Key Manager](https://atnsoft.com/keymanager/versions/)
204. [atnsoft/Key Remapper](https://atnsoft.com/keyremapper/versions/)
205. [atnsoft/Text Paster](https://atnsoft.com/textpaster/versions/)
206. [Atom](https://github.com/atom/atom/releases/latest) [2,455/48,714/11,633] :atom: The hackable text editor.
207. [ATTO Disk Benchmark](https://www.softpedia.com/get/System/Benchmarks/ATTO-Disk-Benchmark.shtml) Assess the performance of your HDD and run thorough hard disk drive tests to determine read and write speeds by using this powerful application
208. [Audacious](https://audacious-media-player.org/download)
209. [Audacity](https://www.softpedia.com/get/Multimedia/Audio/Audio-Editors-Recorders/Audacity.shtml) Free and open-source multi-track audio editor and recorder with extensive plugin support for effects, generators, analyzers, and more
210. [Audio Router](https://github.com/audiorouterdev/audio-router/releases/latest) [165/2,104/265] Routes audio from programs to different audio devices.
211. [AudioSwitch](https://github.com/sirWest/AudioSwitch/releases/latest) [73/823/67] Switch between default audio input or output + change volume
212. [Authy](https://authy.com/download/) [Free Personal]
213. [AutoDarkMode](https://github.com/Armin2208/Windows-Auto-Night-Mode/releases/latest) [4/185/18] Automatically switches between the dark and light theme of Windows 10
214. [AutoHotkey](https://www.autohotkey.com/download/)
215. [AutoIt](https://www.autoitscript.com/site/autoit/downloads/)
216. [Automatic Image Downloader](https://www.automaticimagedownloader.com/)
217. [AUXPI](https://github.com/aimerforreimu/AUXPI/releases/latest) [21/1,370/146] 🍭 集合多家 API 的新一代图床.
218. [Avant Browser](http://www.avantbrowser.com/download.aspx)
219. [avidemux](https://sourceforge.net/projects/avidemux/files/avidemux/) :hand: A free video editor to cut, filter, and encode projects
220. [Avocode](https://avocode.com/changelog) :money_with_wings:
221. [Axife](https://www.axife.com/downloads.html) :money_with_wings:
222. [AxureRP](https://www.axure.com/release-history) :money_with_wings:
223. [Babun](https://github.com/babun/babun/releases) [293/8,586/546] Babun - a Windows shell you will love!
224. [BaiduCDP](https://github.com/cool2528/baiduCDP/releases/latest) [50/1,246/216] 百度网盘下载神器.
225. [BaiduPCS-Go](https://github.com/iikira/BaiduPCS-Go/releases/latest) [538/14,054/2,003] 百度网盘客户端 - Go语言编写.
226. [BaiduPCS-Web](https://github.com/liuzhuoling2011/baidupcs-web/releases/latest) [100/2,399/407] Contribute to  development by creating an account on GitHub.
227. [Balabolka](http://balabolka.site/data/sizes.js) :hand:
228. [balenaEtcher](https://github.com/balena-io/etcher/releases/latest) [348/14,622/844] Flash OS images to SD cards & USB drives, safely and easily.
229. [Bandisoft Bandizip](https://www.bandisoft.com/bandizip/)
230. [Bandisoft Honeyview](http://www.bandisoft.com/honeyview/)
231. [Basilisk](https://basilisk-browser.org/releasenotes.shtml)
232. [Bdash](https://github.com/bdash-app/bdash/releases/latest) [49/1,263/80] Simple SQL Client for lightweight data analysis.
233. [Beaker](https://github.com/beakerbrowser/beaker/releases/latest) [185/4,753/362] An experimental peer-to-peer Web browser.
234. [BearyChat](https://bearychat.com/releases/client/changelog.json)
235. [BeeBEEP](https://sourceforge.net/projects/beebeep/files/Windows/) You can message and share files inside your intranet without a server.
236. [Beeftext](https://github.com/xmichelo/Beeftext/releases/latest) [8/109/3] A text snippet tool for Windows.
237. [BestSync](http://www.risefly.com/fsedwld.htm) [Free Personal]
238. [BetterExplorer](https://github.com/Gainedge/BetterExplorer/releases/latest) [30/106/30] A Better Explorer filemanager repository.
239. [Betwixt](https://github.com/kdzwinel/betwixt/releases/latest) [85/4,069/128] :zap: Web Debugging Proxy based on Chrome DevTools Network panel.
240. [Beyond Compare](http://scootersoftware.com/download.php) :money_with_wings:
241. [BiglyBT](https://github.com/BiglySoftware/BiglyBT/releases/latest) [39/315/59] Feature-filled Bittorrent client based on the Azureus open source project
242. [BinaryFortress/ClipboardFusion](https://www.clipboardfusion.com/Download/) [Free Personal]
243. [BinaryFortress/DisplayFusion](https://www.displayfusion.com/Download/) [Free Personal]
244. [BinaryFortress/FileSeek](https://www.fileseek.ca/Download/) [Free Personal]
245. [BinaryFortress/HashTools](https://www.binaryfortress.com/HashTools/Download/) [Free Personal]
246. [BinaryFortress/iTunesFusion](https://www.itunesfusion.com/Download/) [Free Personal]
247. [BinaryFortress/LogFusion](https://www.logfusion.ca/Download/) [Free Personal]
248. [BinaryFortress/Notepad Replacer](https://www.binaryfortress.com/NotepadReplacer/Download/)
249. [BinaryFortress/ShellSend](https://www.binaryfortress.com/ShellSend/Download/)
250. [BinaryFortress/TrayStatus](https://www.traystatus.com/Download/) [Free Personal]
251. [BinaryFortress/VoiceBot](https://www.voicebot.net/Download/) [Free Personal]
252. [BinaryFortress/Window Inspector](https://www.binaryfortress.com/WindowInspector/Download/)
253. [BinaryMark/Advanced File Finder](https://www.binarymark.com/products/advanced-file-finder) :money_with_wings: :hand:
254. [BinaryMark/All the Best YouTube Downloader](https://www.binarymark.com/products/best-youtube-video-downloader) :money_with_wings: :hand:
255. [BinaryMark/Batch Docs](https://www.binarymark.com/products/bulk-document-processor) :money_with_wings: :hand:
256. [BinaryMark/Batch Encoding Converter](https://www.binarymark.com/products/batch-encoding-converter) :money_with_wings: :hand:
257. [BinaryMark/Batch File Encrypt](https://www.binarymark.com/products/batch-file-encrypt) :money_with_wings: :hand:
258. [BinaryMark/Batch File Manager](https://www.binarymark.com/products/auto-file-manager) :money_with_wings: :hand:
259. [BinaryMark/Batch File Rename](https://www.binarymark.com/products/batch-file-renamer) :money_with_wings: :hand:
260. [BinaryMark/Batch File Replace](https://www.binarymark.com/products/batch-file-search-replace) :money_with_wings: :hand:
261. [BinaryMark/Batch File Split & Join](https://www.binarymark.com/products/batch-file-split-and-join) :money_with_wings: :hand:
262. [BinaryMark/Batch Files](https://www.binarymark.com/products/batch-files-processor) :money_with_wings: :hand:
263. [BinaryMark/Batch Hex Editor](https://www.binarymark.com/products/batch-hex-editor) :money_with_wings: :hand:
264. [BinaryMark/Batch Image Converter](https://www.binarymark.com/products/batch-image-converter) :money_with_wings: :hand:
265. [BinaryMark/Batch Image Enhancer](https://www.binarymark.com/products/batch-image-enhancer) :money_with_wings: :hand:
266. [BinaryMark/Batch Image Resizer](https://www.binarymark.com/products/batch-image-resizer) :money_with_wings: :hand:
267. [BinaryMark/Batch Image Splitter](https://www.binarymark.com/products/batch-image-splitter) :money_with_wings: :hand:
268. [BinaryMark/Batch Image Watermarker](https://www.binarymark.com/products/batch-image-watermarker) :money_with_wings: :hand:
269. [BinaryMark/Batch Images](https://www.binarymark.com/products/batch-image-processor) :money_with_wings: :hand:
270. [BinaryMark/Batch Photo Face](https://www.binarymark.com/products/batch-photo-face) :money_with_wings: :hand:
271. [BinaryMark/Batch RegEx](https://www.binarymark.com/products/batch-file-regex) :money_with_wings: :hand:
272. [BinaryMark/Batch Text File Editor](https://www.binarymark.com/products/batch-text-editor) :money_with_wings: :hand:
273. [BinaryMark/Batch Word Replace](https://www.binarymark.com/products/batch-word-replace) :money_with_wings: :hand:
274. [BinaryMark/Biorhythms Calculator 2018](https://www.binarymark.com/products/biorhythms-calculator) :money_with_wings: :hand:
275. [BinaryMark/Blogspot & Tumblr Image Downloader](https://www.binarymark.com/products/blogspot-image-downloader) :money_with_wings: :hand:
276. [BinaryMark/Color Picker Pro](https://www.binarymark.com/products/color-picker-pro) :money_with_wings: :hand:
277. [BinaryMark/Database E-Mailer](https://www.binarymark.com/products/database-emailer) :money_with_wings: :hand:
278. [BinaryMark/File Hash Generator](https://www.binarymark.com/products/file-hash-generator) :money_with_wings: :hand:
279. [BinaryMark/Free RegEx Editor](https://www.binarymark.com/products/free-regex-editor) :money_with_wings:
280. [BinaryMark/Password Generator](https://www.binarymark.com/products/password-generator) :money_with_wings: :hand:
281. [BinaryMark/Random Item Picker](https://www.binarymark.com/products/random-item-picker) :money_with_wings: :hand:
282. [BinaryMark/Random Number Generator](https://www.binarymark.com/products/random-number-generator) :money_with_wings: :hand:
283. [BinaryMark/Streaming Video Downloader](https://www.binarymark.com/products/streaming-video-downloader) :money_with_wings: :hand:
284. [BinaryMark/Text to MP3 Converter](https://www.binarymark.com/products/text-to-mp3-converter) :money_with_wings: :hand:
285. [BitComet](https://www.bitcomet.com/en/archive) [Freemium] :airplane:
286. [BitDock](http://www.bitdock.cn/)
287. [BitTorrent](http://blog.bittorrent.com/releases/windows/) [Free Personal]
288. [Bitwarden](https://github.com/bitwarden/desktop/releases/latest) [47/700/80] The desktop vault (Windows, macOS, & Linux).
289. [BleachBit](https://www.bleachbit.org/download/windows)
290. [Blender](https://www.blender.org/download/)
291. [Blue Iris](http://blueirissoftware.com/updates/) :money_with_wings: :hand:
292. [Bochs](https://sourceforge.net/projects/bochs/files/bochs/) Bochs is a portable x86 PC emulation software package that emulates enough of the x86 CPU, related AT hardware, and BIOS to run Windows, Linux,…
293. [Bookmarks](https://www.softpedia.com/get/Internet/Bookmark-Managers/Portable-Bookmarks.shtml) Manage your bookmarks and store them for safekeeping in your PC  with the help of this lightweight and easy-to-use app that requires no internet connection
294. [Boostnote](https://github.com/BoostIO/boost-releases/releases/latest) [49/213/11] 🚀 Boostnote app releases & changelog.
295. [Bootice](https://www.softpedia.com/get/System/Boot-Manager-Disk/Bootice.shtml) Edit your computer's MBR and PBR settings with various built-in tools such as a partition manager, UEFI editor, BCD configurator, and more
296. [BorderlessGaming](https://github.com/Codeusa/Borderless-Gaming/releases/latest) [132/2,169/255] Play your favorite games in a borderless window; no more time consuming alt-tabs.
297. [BotFramework-Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases/latest) [132/1,016/431] Bot Framework Emulator.
298. [BoxedApp Packer](https://www.boxedapp.com/boxedapppacker/changelog.html) :money_with_wings:
299. [Brackets](https://github.com/adobe/brackets/releases/latest) [1,620/29,755/6,401] An open source code editor for the web, written in JavaScript, HTML and CSS.
300. [Brave](https://github.com/brave/brave-browser/releases/latest) [118/2,400/229] Next generation Brave browser for macOS, Windows, Linux, and eventually Android
301. [Brook](https://github.com/txthinking/brook/releases/latest) [439/8,632/1,634] Brook is a cross-platform(Linux/MacOS/Windows/Android/iOS) proxy/vpn software
302. [Brosix](https://www.softpedia.com/get/Internet/Chat/Instant-Messaging/Brosix.shtml) :money_with_wings: A secure and useful instant messaging platform which offers you a wide range of features designed to meet and exceed any communication needs you have
303. [Build Checker App](https://github.com/willmendesneto/build-checker-app/releases/latest) [2/46/5] Application using ReactJS  + NodeJS for to monitor build/deploy status in your Continuous Integration server
304. [Bulk Crap Uninstaller](https://github.com/Klocman/Bulk-Crap-Uninstaller/releases/latest) [32/473/38] Remove large amounts of unwanted applications quickly.
305. [Bulk Image Downloader](https://bulkimagedownloader.com/) :money_with_wings:
306. [BurnAware](http://www.burnaware.com/download.html) :money_with_wings:
307. [Buttercup](https://github.com/buttercup/buttercup-desktop/releases/latest) [71/2,834/199] :key: Javascript Secrets Vault - Multi-Platform Desktop Application
308. [Cacher](https://cacher-download.nyc3.digitaloceanspaces.com/latest.yml)
309. [CAJViewer](http://cajviewer.cnki.net/download.html)
310. [CAJ云阅读](http://cajviewer.cnki.net/cajcloud/)
311. [Calibre](https://github.com/kovidgoyal/calibre/releases/latest) [313/5,777/1,018] The official source code repository for the calibre ebook manager
312. [Cameyo](https://www.softpedia.com/get/System/System-Miscellaneous/Cameyo.shtml) Virtualize the running of various applications on your computer, without the need to install them in order to benefit from the functions
313. [Caprine](https://github.com/sindresorhus/caprine/releases/latest) [110/4,285/398] Elegant Facebook Messenger desktop app.
314. [Capslock+](https://cjkis.me/capslock+/)
315. [Caption](https://github.com/gielcobben/caption/releases/latest) [31/1,122/84] Get Caption, start watching.
316. [Caret](https://caret.io/)
317. [CareUEyes](https://care-eyes.com/release.html)
318. [CashNotify](https://github.com/BaguetteEngineering/download.cashnotify.com/releases/latest) [2/0/0] Host releases for CashNotify 3.
319. [CatLight](https://catlight.io/downloads) :money_with_wings:
320. [CCEnhancer](https://singularlabs.com/software/ccenhancer/download-ccenhancer/)
321. [CCProxy](https://www.youngzsoft.net/ccproxy/proxy-server-download.htm)
322. [CentBrowser](https://www.centbrowser.cn/history.html)
323. [Cerebro](https://github.com/KELiON/cerebro/releases/latest) [157/5,969/360] Open-source productivity booster with a brain.
324. [CerebroApp](https://github.com/KELiON/cerebro/releases/latest) [157/5,969/360] Open-source productivity booster with a brain.
325. [cFos Software/cFos Broadband Connect](https://www.cfos.de/en/download/download.htm) :money_with_wings: :hand:
326. [cFos Software/cFos IPv6 Link](https://www.cfos.de/en/download/download.htm) :money_with_wings: :hand:
327. [cFos Software/cFos Notifier](https://www.cfos.de/en/download/download.htm)
328. [cFos Software/cFos Outlook DAV](https://www.cfos.de/en/download/download.htm) :money_with_wings: :hand:
329. [cFos Software/cFos Personal Net](https://www.cfos.de/en/download/download.htm) :money_with_wings: :hand:
330. [cFos Software/cFos](https://www.cfos.de/en/download/download.htm) :money_with_wings: :hand:
331. [cFos Software/cFosICS](https://www.cfos.de/en/download/download.htm)
332. [cFos Software/cFosSpeed](https://www.cfos.de/en/download/download.htm) :money_with_wings: :hand:
333. [cFos Software/hrPing](https://www.cfos.de/en/ping/ping.htm)
334. [Chameleon/Explorer](http://www.chameleon-managers.com/windows-explorer/) :money_with_wings:
335. [Chameleon/Folder](http://www.chameleon-managers.com/downloads.php)
336. [Chameleon/Shutdown](http://www.chameleon-managers.com/downloads.php)
337. [Chameleon/Startup Manager](http://www.chameleon-managers.com/windows-startup-manager/) :money_with_wings:
338. [Chameleon/Task Manager](http://www.chameleon-managers.com/windows-task-manager/) :money_with_wings:
339. [Chameleon/Volume](http://www.chameleon-managers.com/windows-volume-manager/) :money_with_wings:
340. [Chameleon/Window Manager](http://www.chameleon-managers.com/window-manager/) :money_with_wings:
341. [Chameleon](https://raw.githubusercontent.com/ianmartinez/Chameleon/master/Changelog.txt)
342. [Championify](https://github.com/dustinblackman/Championify/releases/latest) [61/890/127] Import recent item sets from popular aggregators like Champion.gg in to League of Legends to use within game! No hassle.
343. [Charles](https://www.charlesproxy.com/latest-release/download.do)
344. [ChemTable/Autorun Organizer](https://www.chemtable.com/) :hand:
345. [ChemTable/Reg Organizer](https://www.chemtable.com/) :money_with_wings:
346. [ChemTable/Registry Life](https://www.chemtable.com/) :hand:
347. [ChemTable/Soft Organizer](https://www.chemtable.com/) :hand:
348. [CherryTree](https://github.com/giuspen/cherrytree/releases) [74/847/139] cherrytree.
349. [CheVolume](http://www.chevolume.com/Download.aspx) :money_with_wings:
350. [ChromeUpdateSharp](https://csharp.love/chrome-update-tool.html)
351. [CintaNotes](http://cintanotes.com/download/) [Free Personal]
352. [Clash for Windows](https://github.com/Fndroid/clash_for_windows_pkg/releases/latest) [97/1,987/221] A Windows GUI based on Clash.
353. [Clash](https://github.com/Dreamacro/clash/releases) [85/2,642/228] A rule-based tunnel in Go.
354. [Classic Shell](https://sourceforge.net/projects/classicshell/files/) :hand: Start menu and Windows enhancement software
355. [CLaunch](http://hp.vector.co.jp/authors/VA018351/claunch.html)
356. [Clavier](https://github.com/guilryder/clavier-plus/releases/latest) [9/41/3] Clavier+ keyboard shortcuts manager for Windows.
357. [Cleaver](https://blog.getcleaver.com/)
358. [Clementine](https://github.com/clementine-player/Clementine/releases/latest) [152/2,197/447] :tangerine: Clementine Music Player.
359. [clink](https://github.com/mridgers/clink/releases/latest) [137/2,349/214] Bash's powerful command line editing in cmd.exe.
360. [ClipAngel](https://sourceforge.net/projects/clip-angel/files/) Clipboard history capture and paste tool
361. [Clipboard to QR-Code](https://github.com/ramonreschke/clipboard-to-qrcode/releases/latest) [1/12/0] A simple cross-platform app which generates a QR-Code from the Clipboard.
362. [Clipdiary](http://clipdiary.com/) [Freemium]
363. [Clipjump](https://github.com/aviaryan/Clipjump/releases/latest) [29/268/41] :clipboard: Clipboard Manager for Windows, built in AutoHotkey
364. [cloud-torrent](https://github.com/jpillora/cloud-torrent/releases/latest) [215/3,378/1,121] ☁️ Cloud Torrent: a self-hosted remote torrent client
365. [Cloudevo](https://www.evorim.com/en/cloudevo) [Free Personal] :hand:
366. [CloudShot](https://cloudshot.com/whatIsNew.html)
367. [Clover](http://cn.ejie.me/download.html) :hand:
368. [Cmder Mini](https://github.com/cmderdev/cmder/releases/latest) [598/18,170/1,290] Lovely console emulator package for Windows.
369. [CMWTAT Digital Edition](https://github.com/TGSAN/CMWTAT_Digital_Edition/releases/latest) [32/929/128] CloudMoe Windows 10 Activation Toolkit get digital license, the best open source Win 10 activator in GitHub. GitHub 上最棒的开源 Win10 数字权利（数字许可证）激活工具！
370. [CnkiDownloader](https://gitee.com/ishare20/cnkidownloader) :hand:
371. [Cocoon Browser](https://www.softpedia.com/get/Internet/Browsers/Cocoon-Browser.shtml) [Free Personal] Protect your data and privacy from many of the perils of online browsing with the help of this streamlined, Firefox-based browser
372. [Cocos2d-x](http://cocos2d-x.org/download)
373. [CocosCreator](http://cocos2d-x.org/download)
374. [CodeExpander](https://github.com/oncework/codeexpander/releases/latest) [3/91/4] A cross-platform cloud synchronization development tool for developers that includes input enhancement, code snippet management, and Markdown. (专为开发者开发的一个集输入增强、代码片段管理(支持 Markdown)为一体跨平台云同步的开发工具。)
375. [CodeNotes](https://github.com/lauthieb/code-notes/releases/latest) [31/558/59] A simple code snippet & gist manager for developers built with Electron & Vue.js 🚀
376. [Combined Community Codec Pack](http://www.cccp-project.net/download.php?type=cccp64)
377. [ComicRack](http://comicrack.cyolito.com/downloads)
378. [Comics Enhancer Pro](https://www.softpedia.com/get/PORTABLE-SOFTWARE/Multimedia/Graphics/Windows-Portable-Applications-Portable-Comics-Enhancer-Pro.shtml) An easy-to-use and reliable software utility that allows you to enhance the image quality of your scanned comic books and display them as a slideshow
379. [ComicsViewer](https://www.softpedia.com/get/PORTABLE-SOFTWARE/Multimedia/Graphics/Portable-ComicsViewer.shtml) Tiny and portable application for viewing scanned comics, equipped with numerous and intuitive options to please all types of users
380. [ComicTagger](https://github.com/davide-romanini/comictagger/releases) [28/95/29] A cross-platform GUI/CLI app for writing metadata to digital comics (fork)
381. [CommandTrayHost](https://github.com/rexdf/CommandTrayHost/releases/latest) [9/169/17] A command line program monitor systray for Windows
382. [Comodo Inc/Comodo Dragon](https://www.softpedia.com/get/Internet/Browsers/Comodo-Dragon.shtml) Chromium-based web browser which resembles Google Chrome in looks and options while putting emphasis on security via Comodo DNS Servers and other features
383. [Comodo Inc/Comodo IceDragon](https://www.softpedia.com/get/Internet/Browsers/Comodo-IceDragon.shtml) A Mozilla-based browser with Facebook integration, providing secure Internet navigation within a user-friendly and accessible interface
384. [ConEmu](https://github.com/Maximus5/ConEmu/releases/latest) [252/5,945/409] Customizable Windows terminal with tabs, splits, quake-style, hotkeys and more
385. [Connectify Hotspot](https://www.connectify.me/new-release/) :money_with_wings:
386. [Console Calculator](http://www.zoesoft.com/console-calculator/ccalc-downloads/)
387. [ContaCam](https://www.contaware.com/downloads/latest/ContaCam/english/)
388. [Control Panel Plus](https://controlpanelplus.github.io/)
389. [ConyEdit](https://www.conyedit.com/download)
390. [Cool Reader](https://sourceforge.net/projects/crengine/files/CoolReader3/cr3-newui-opengl/) A cross-platform XML/CSS based eBook reader
391. [CopyQ](https://github.com/hluk/CopyQ/releases/latest) [103/1,825/142] Clipboard manager with advanced features.
392. [CopyTranslator](https://github.com/CopyTranslator/CopyTranslator/releases) [151/3,876/471] Foreign language reading and translation assistant based on copy and translate.
393. [cow](https://github.com/cyfdecyf/cow/releases/latest) [434/7,635/1,596] HTTP proxy written in Go. COW can automatically identify blocked sites and use parent proxies to access.
394. [CPU Core Analyzer](https://www.majorgeeks.com/mg/getmirror/cpu_core_analyzer,1.html) CPU Core Analyzer is a lightweight monitoring tool that displays real time information about your PCs CPU and its performance.
395. [CPUID/CPU-Z](https://www.cpuid.com/softwares/cpu-z.html)
396. [CPUID/HWMonitor PRO](https://www.cpuid.com/softwares/hwmonitor-pro.html) :money_with_wings:
397. [CPUID/HWMonitor](https://www.cpuid.com/softwares/hwmonitor.html)
398. [CPUID/Perfmonitor2](https://www.cpuid.com/softwares/perfmonitor-2.html)
399. [Crypter](https://github.com/HR/Crypter/releases/latest) [18/296/41] An innovative, convenient and secure cross-platform encryption app 🔒⬅️ ✨➡️🔓
400. [Crypto-Notepad](https://github.com/Crypto-Notepad/Crypto-Notepad/releases/latest) [8/57/13] :key: Simple notepad for Windows with encryption features
401. [CrystalDiskInfo](https://osdn.net/pkg/crystaldiskinfo/CrystalDiskInfo)
402. [CrystalDiskMark](https://osdn.net/pkg/crystaldiskmark/CrystalDiskMark)
403. [CrystalIDEA/AnyToISO](https://github.com/crystalidea/anytoiso/releases/latest) [1/6/1] Create/Convert/Extract ISO images.
404. [CrystalIDEA/Macs Fan Control](https://github.com/crystalidea/macs-fan-control/releases/latest) [4/128/23] Control fans on Apple computers.
405. [CrystalIDEA/SpeedyFox](https://www.crystalidea.com/speedyfox/release-notes)
406. [CrystalIDEA/Uninstall Tool](https://github.com/crystalidea/uninstall-tool/releases/latest) [5/12/1] Binaries archive/releases of Uninstall Tool.
407. [CubicExplorer](https://www.softpedia.com/get/File-managers/CubicExplorer.shtml) File manager with support for multiple tabs, built-in text editor with syntax highlighting, bookmarks, extensive file search, and others
408. [CudaText](https://sourceforge.net/projects/cudatext/files/release/Windows/) Cross-platform text and code editor
409. [curl](https://curl.haxx.se/windows/)
410. [CuteFTP](https://www.globalscape.com/cuteftp-version-history) :money_with_wings: :hand:
411. [Cydia Impactor](https://cydia.saurik.com/)
412. [Cygwin](http://mirrors.kernel.org/sourceware/cygwin/x86_64/)
413. [Daemon Tools](https://www.softpedia.com/get/CD-DVD-Tools/Virtual-CD-DVD-Rom/DAEMON-Tools.shtml) [Free Personal] Virtual disc emulation tool that helps you create up to 4 virtual drives, mount and unmount images, and generate image files from device contents, while offering support for RMPS, SafeDisc, SecuROM and LaserLock
414. [DanDanPlay](http://dandanplay.com/)
415. [Database .NET](https://fishcodelib.com/Database.htm) [Freemium]
416. [DB Browser for SQLite](https://github.com/sqlitebrowser/sqlitebrowser/releases/latest) [490/11,274/1,299] Official home of the DB Browser for SQLite (DB4S) project. Previously known as "SQLite Database Browser" and "Database Browser for SQLite". Website at:
417. [DBeaver](https://dbeaver.io/download/) [Free Personal]
418. [DBGlass](https://github.com/web-pal/DBGlass/releases/latest) [53/1,226/64] PostgreSQL client built with Electron.
419. [DC++](https://sourceforge.net/projects/dcplusplus/files/) A Windows client for the Direct Connect networks
420. [Decimal BASIC](https://decimalbasic.ninja-web.net/EnglishWindows.htm)
421. [Deleaker](https://www.deleaker.com/changelog.html) :money_with_wings:
422. [Deluge](https://dev.deluge-torrent.org/wiki/ReleaseNotes)
423. [DeskPins](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/DeskPins.shtml) Better organize yourself and improve your workflow with the help of this useful app that allows you to conveniently pin applications to stay on top of other windows
424. [Desktop Dimmer](https://github.com/sidneys/desktop-dimmer/releases/latest) [13/208/13] Enable darker-than-dark dimming for internal and external screens.
425. [Desktop Info](https://www.glenn.delahoy.com/desktopinfo/)
426. [Destroy Windows 10 Spying](https://www.majorgeeks.com/mg/getmirror/destroy_windows_10_spying,1.html) Destroy Windows 10 Spying is a portable app that can block anonymous data being sent, remove apps and more. Video tutorial available.
427. [Detect it Easy](https://github.com/horsicq/DIE-engine/releases/latest) [42/233/59] DIE engine.
428. [DevDocs](https://github.com/egoist/devdocs-desktop/releases/latest) [56/2,010/139] 🗂 A full-featured desktop app for DevDocs.io.
429. [DevHub](https://github.com/devhubapp/devhub/releases/latest) [76/4,913/222] DevHub: TweetDeck for GitHub - Android, iOS, Web & Desktop
430. [Dexpot](https://www.dexpot.de/?id=download)
431. [Diffinity](http://truehumandesign.se/s_diffinity.php)
432. [digimezzo/Dopamine](https://www.digimezzo.com/content/software/dopamine/)
433. [digimezzo/Knowte](https://www.digimezzo.com/content/software/knowte/)
434. [digimezzo/Vitomu](https://www.digimezzo.com/content/software/vitomu/)
435. [Digital Clock](https://sourceforge.net/projects/digitalclock4/files/) beautiful customizable clock with plugins
436. [DigitalLicense](https://gitlab.com/api/v4/projects/7098481/releases)
437. [DigitalVolcano/Duplicate Cleaner Pro](https://www.digitalvolcano.co.uk/dcdownloads.html) :money_with_wings:
438. [DigitalVolcano/Duplicate Cleaner](https://www.digitalvolcano.co.uk/dcdownloads.html)
439. [DigitalVolcano/HashTool](https://www.digitalvolcano.co.uk/hash.html)
440. [DigitalVolcano/TaskCanvas](https://www.digitalvolcano.co.uk/taskcanvasdownload.html) :money_with_wings:
441. [DigitalVolcano/TextCrawler Pro](https://www.digitalvolcano.co.uk/tcdownloads.html) :money_with_wings:
442. [DigitalVolcano/TextCrawler](https://www.digitalvolcano.co.uk/tcdownloads.html)
443. [Dimio/DClean](http://dimio.altervista.org/eng/)
444. [Dimio/Deep Explorer](http://dimio.altervista.org/eng/)
445. [Dimio/Double Finder](http://dimio.altervista.org/eng/)
446. [Dimio/DShutdown](http://dimio.altervista.org/eng/)
447. [Dimio/DSpeech](http://dimio.altervista.org/eng/)
448. [Dimio/DSynchronize](http://dimio.altervista.org/eng/)
449. [Dimio/DTaskManager](http://dimio.altervista.org/eng/)
450. [Dimio/HDHacker](http://dimio.altervista.org/eng/)
451. [dingtalk](https://github.com/nashaofu/dingtalk/releases/latest) [58/1,036/174] 钉钉桌面版，基于electron和钉钉网页版开发，支持Windows、Linux和macOS.
452. [Direct Folders](https://www.codesector.com/downloads) [Free Personal]
453. [Directory Opus](https://www.gpsoft.com.au/DScripts/download.asp) :money_with_wings:
454. [DirectoryMonitor](https://directorymonitor.com/download) [Free Personal]
455. [DirectX Repair](http://www.pc6.com/softview/SoftView_57945.html)
456. [DirSyncPro](https://www.dirsyncpro.org/download.html)
457. [Disable-Nvidia-Telemetry](https://github.com/NateShoffner/Disable-Nvidia-Telemetry/releases/latest) [49/429/20] Windows utility to disable Nvidia's telemetry services
458. [Discord](https://discordapp.com/download)
459. [DiskGenius](http://www.eassos.com/download.php) [Free Personal]
460. [DiskInternals/Access Recovery](https://www.diskinternals.com/access-recovery/) :money_with_wings: Undelete, recover and repair corrupted Access databases in just a few clicks. DiskInternals Access Recovery repairs corrupted Access databases, and undeletes or recovers Access 2000-2007 .mdb and .accdb database files from damaged disks
461. [DiskInternals/Address Book Recovery](https://www.diskinternals.com/wab-recovery/) Looking for an immediate solution to recover your contacts? Look no further! DiskInternals Address Book Recovery will find and recover your contacts automatically for absolutely free!
462. [DiskInternals/Bootable Recovery CD](https://www.diskinternals.com/boot-cd/) Create a bootable CD with Windows XP or Windows 2003 Server CD and a full set of DiskInternals recovery tools. Recover your hard drive by booting into familiar operating system with handy access to data recovery tools.
463. [DiskInternals/CD-DVD Recovery](https://www.diskinternals.com/cd-dvd-recovery/) :money_with_wings: Recover files lost during CD/DVD recording session. Simple, one-button solution.
464. [DiskInternals/Disk Reader for Total Commander](https://www.diskinternals.com/reader-for-tc/) Extracting files from Ext2/Ext3/Ext4, HFS and ReiserFS partitions in Total Commander
465. [DiskInternals/EFS Recovery](https://www.diskinternals.com/efs-recovery/) :money_with_wings: EFS Data Recovery for encrypted files and folders from NTFS partitions. Quickly and easily
466. [DiskInternals/Excel Recovery](https://www.diskinternals.com/excel-recovery/) :money_with_wings: Recover excel file - fast and simple. If your xls or xlsx file is gone or cannot be read, the special recovery software developed by DiskInternals will help you to get them back. DiskInternals Excel Recovery tool repairs deleted Microsoft Excel Worksheets. More than 90% chance of recovering your data - based on 14 years of data recovery experience.
467. [DiskInternals/FAT Recovery](https://www.diskinternals.com/fat-recovery/) :money_with_wings: DiskInternals FAT Recovery is a fully automatic utility that recovers data from damaged disks or unformats the whole drive. The program scans the disk first, then restores the original structure of files and folders.
468. [DiskInternals/Flash Recovery](https://www.diskinternals.com/flash-recovery/) :money_with_wings: Do you have lost video files? Video recovery is possible! Here is the best software for recovering the video that helps you to bring favorite multimedia files back.
469. [DiskInternals/Linux Reader](https://www.diskinternals.com/linux-reader/) A freeware tool for extracting files from Ext2/Ext3/Ext4, hfs and ReiserFS partitions in Windows
470. [DiskInternals/Linux Recovery](https://www.diskinternals.com/linux-recovery/) A freeware recovery solution for Windows restoring deleted Linux Ext2/Ext3 files
471. [DiskInternals/Mail Recovery Express](https://www.diskinternals.com/mail-recovery-express/) :money_with_wings: A potent solution from the data recovery expert that repairs Outlook Express
472. [DiskInternals/Mail Recovery](https://www.diskinternals.com/mail-recovery/) :money_with_wings: Recover and repair deleted or corrupted Outlook Express databases and Vista Windows Mail messages. Even if your email is completely lost, DiskInternals Mail Recovery scans the entire hard disk, locates and recovers the deleted email
473. [DiskInternals/MSSQL Recovery](https://www.diskinternals.com/mssql-recovery/) :money_with_wings: DiskInternals MSSQL Recovery tool is here for damaged or corrupted databases. If only some parts of database are available, MSSQL Recovery will apply advanced database repair algorithms to repair or reconstruct tables and system information
474. [DiskInternals/Music Recovery](https://www.diskinternals.com/music-recovery/) :money_with_wings: Recover any type of media files from your hard drive, i-pod, USB-flash, CD/DVD
475. [DiskInternals/NTFS Recovery](https://www.diskinternals.com/ntfs-recovery/) :money_with_wings: DiskInternals NTFS Recovery is a fully automatic utility that recovers data from damaged disks or unformat whole drive
476. [DiskInternals/Office Recovery](https://www.diskinternals.com/office-recovery/) :money_with_wings: Recover latest versions of deleted documents even after a hard drive failure!
477. [DiskInternals/Outlook Recovery](https://www.diskinternals.com/outlook-recovery/) :money_with_wings: DiskInernals Outlook Recovery restores your access to email after a hard drive failure or data corruption. Recover email and repair damaged Outlook databases.
478. [DiskInternals/Partition Recovery](https://www.diskinternals.com/partition-recovery/) :money_with_wings: Corrupted, deleted or reformatted partitions pose no problem for you if you have DiskInternals Partition Recovery, which supports: FAT12, FAT16, FAT32, VFAT, NTFS, NTFS4 and NTFS5
479. [DiskInternals/RAID Recovery](https://www.diskinternals.com/raid-recovery/) :money_with_wings: Fast automated recovery of data from RAID 0, 1, 0+1, 1+0, 1E, RAID 4, RAID 5, 50, 5EE, 5R, RAID 6, 60 and JBOD. RAID array recovery software for NVidia, Intel, VIA. Apple, Linux NAS, Microsoft Software RAID etc. DiskInternals RAID Recovery™ reconstructs all types of arrays.
480. [DiskInternals/Recovery for iPod](https://www.diskinternals.com/ipod-recovery/) :money_with_wings: Recover lost tunes from iPod MP3 players with an iPod-style tool in just five mouse clicks!
481. [DiskInternals/Recovery Server](https://www.diskinternals.com/recovery-server/) Important files were deleted on a networked computer? A remote PC can’t access a hard drive because of disk corruption? Recover deleted files and fix corrupt partitions remotely with DiskInternals Recovery Server!
482. [DiskInternals/Uneraser](https://www.diskinternals.com/uneraser/) :money_with_wings: Need to undelete files? If you lost any kinds of deleted files and documents - you have a chance to get them back. DiskInternals Uneraser™ will help you in recovering files removed from the recycle bin or lost due to a system crash.
483. [DiskInternals/VMFS Recovery](https://www.diskinternals.com/vmfs-recovery/) :money_with_wings: VMFS recovery software to repair VMDK files from corrupted or healthy WMware® VMFS, ESX, ESXi, vSphere disks. 14 years of successful data recovery. Fully automated or guided recovery.
484. [DiskInternals/ZIP Repair](https://www.diskinternals.com/zip-repair/) DiskInternals ZIP Repair solves the problem of corrupt ZIP files for free. Secure yourself against data loss and fix zip files with a free repair tool
485. [Dism++](http://www.chuyu.me/zh-Hans/index.html)
486. [Display Driver Uninstaller](https://www.majorgeeks.com/mg/getmirror/display_driver_uninstaller,1.html) Display Driver Uninstaller is a graphics driver removal tool that helps remove all remnants of AMD, Nvidia, and Intel graphics card drivers. Video tutorial available.
487. [Ditto](https://ditto-cp.sourceforge.io/)
488. [dnscrypt-proxy](https://github.com/jedisct1/dnscrypt-proxy/releases/latest) [218/3,569/305] dnscrypt-proxy 2 - A flexible DNS proxy, with support for encrypted DNS protocols.
489. [dnSpy](https://github.com/0xd4d/dnSpy/releases/latest) [661/9,590/1,551] .NET debugger and assembly editor.
490. [DocFetcher](https://sourceforge.net/projects/docfetcher/files/docfetcher/) Desktop search application
491. [Dockeron](https://github.com/dockeron/dockeron/releases/latest) [27/555/84] 🤖🤖🤖 Electron + Vue.js for Docker.
492. [DonationCoder/bgmCoder/Ballistic](http://www.dcmembers.com/bgmcoder/download/ballistic/)
493. [DonationCoder/bgmCoder/BaseImage](http://www.dcmembers.com/bgmcoder/download/baseimage/)
494. [DonationCoder/bgmCoder/Calculor](http://www.dcmembers.com/bgmcoder/download/calculor/)
495. [DonationCoder/bgmCoder/CallToAgent](http://www.dcmembers.com/bgmcoder/download/calltoagent/)
496. [DonationCoder/bgmCoder/DropPath](http://www.dcmembers.com/bgmcoder/download/droppath/)
497. [DonationCoder/bgmCoder/Greg](http://www.dcmembers.com/bgmcoder/download/greg/)
498. [DonationCoder/bgmCoder/Iconus](http://www.dcmembers.com/bgmcoder/download/iconus/)
499. [DonationCoder/bgmCoder/Phantom](http://www.dcmembers.com/bgmcoder/download/phantom/)
500. [DonationCoder/bgmCoder/PixCalc](http://www.dcmembers.com/bgmcoder/download/pixcalc/)
501. [DonationCoder/bgmCoder/Protocaller](http://www.dcmembers.com/bgmcoder/download/protocaller-2/)
502. [DonationCoder/bgmCoder/ReRun](http://www.dcmembers.com/bgmcoder/download/rerun/)
503. [DonationCoder/bgmCoder/TextWorx](http://www.dcmembers.com/bgmcoder/download/textworx/)
504. [DonationCoder/bgmCoder/WinClip](http://www.dcmembers.com/bgmcoder/download/winclip/)
505. [DonationCoder/Hamradio/ColorWarlock](http://www.dcmembers.com/hamradio/download/color-warlock/)
506. [DonationCoder/Hamradio/CommandBlocksWarlock](http://www.dcmembers.com/hamradio/download/command-blocks-warlock/)
507. [DonationCoder/Hamradio/CustomizableRemoteAdministrationPanel](http://www.dcmembers.com/hamradio/download/customizable-remote-administration-panel/)
508. [DonationCoder/Hamradio/FileDownloader](http://www.dcmembers.com/hamradio/download/file-downloader/)
509. [DonationCoder/Hamradio/HealthReader](http://www.dcmembers.com/hamradio/download/health-reader/)
510. [DonationCoder/Hamradio/LinkWarlock](http://www.dcmembers.com/hamradio/download/link-warlock/)
511. [DonationCoder/Hamradio/MinecraftPlaces](http://www.dcmembers.com/hamradio/download/minecraft-places/)
512. [DonationCoder/Hamradio/PortableExtensionWarlock](http://www.dcmembers.com/hamradio/download/portable-extension-warlock/)
513. [DonationCoder/Hamradio/SpeedDialImageWarlock](http://www.dcmembers.com/hamradio/download/speed-dial-image-warlock/)
514. [DonationCoder/Hamradio/WeatherStationWarlock](http://www.dcmembers.com/hamradio/download/weather-station-warlock/)
515. [DonationCoder/nod5/30SecondSilencer](http://www.dcmembers.com/nod5/download/30secondsilencer/)
516. [DonationCoder/nod5/BigTimer](http://www.dcmembers.com/nod5/download/bigtimer/)
517. [DonationCoder/nod5/BookCrop](https://github.com/nod5/BookCrop/releases/latest) [1/1/0] AutoHotkey program to quickly crop many same sized images via an overlay preview
518. [DonationCoder/nod5/BookGapCheck](https://github.com/nod5/BookGapCheck/releases/latest) [2/1/0] AutoHotkey program to quickly check if there are gaps or duplicates in a set of book page scan images
519. [DonationCoder/nod5/Everything Efu Explorer](http://www.dcmembers.com/nod5/download/everything-efu-explorer/)
520. [DonationCoder/nod5/FFBookmarkUnpacker](http://www.dcmembers.com/nod5/download/ffbookmarkunpacker/)
521. [DonationCoder/nod5/FileNoter](http://www.dcmembers.com/nod5/download/filenoter/)
522. [DonationCoder/nod5/QuickPicZone](http://www.dcmembers.com/nod5/download/quickpiczone/)
523. [DonationCoder/nod5/Scan Tailor Multi-Core](http://www.dcmembers.com/nod5/download/scan-tailor-multi-core/)
524. [DonationCoder/nod5/SoloCrop](https://github.com/nod5/SoloCrop/releases/latest) [1/1/0] AutoHotkey program to quickly crop many images in sequence
525. [DonationCoder/nod5/Sumatra Earmarks](http://www.dcmembers.com/nod5/download/sumatra-earmarks/)
526. [DonationCoder/nod5/TiffDjvuOcr](http://www.dcmembers.com/nod5/download/tiffdjvuocr/)
527. [DonationCoder/nod5/TwoCamControl](https://github.com/nod5/TwoCamControl/releases/latest) [3/1/0] Windows frontend for chdkptp with two cameras.
528. [DonationCoder/nod5/vmPing](https://github.com/R-Smith/vmPing/releases/latest) [13/96/14] Visual Multi Ping.  Color-coded ping utility for monitoring multiple hosts.
529. [DonationCoder/Skrommel/Accents](http://www.dcmembers.com/skrommel/download/accents/)
530. [DonationCoder/Skrommel/AddUrlTimeStamp](http://www.dcmembers.com/skrommel/download/addurltimestamp/)
531. [DonationCoder/Skrommel/AltEdge](http://www.dcmembers.com/skrommel/download/altedge/)
532. [DonationCoder/Skrommel/AutoClip](http://www.dcmembers.com/skrommel/download/autoclip/)
533. [DonationCoder/Skrommel/Barnacle](http://www.dcmembers.com/skrommel/download/barnacle/)
534. [DonationCoder/Skrommel/BatteryRun](http://www.dcmembers.com/skrommel/download/batteryrun/)
535. [DonationCoder/Skrommel/BigByte](http://www.dcmembers.com/skrommel/download/bigbyte/)
536. [DonationCoder/Skrommel/BlockInput](http://www.dcmembers.com/skrommel/download/blockinput/)
537. [DonationCoder/Skrommel/CacheSort](http://www.dcmembers.com/skrommel/download/cachesort/)
538. [DonationCoder/Skrommel/CapShift](http://www.dcmembers.com/skrommel/download/capshift/)
539. [DonationCoder/Skrommel/Captain](http://www.dcmembers.com/skrommel/download/captain/)
540. [DonationCoder/Skrommel/ClickToDesktop](http://www.dcmembers.com/skrommel/download/clicktodesktop/)
541. [DonationCoder/Skrommel/ClipStep](http://www.dcmembers.com/skrommel/download/clipstep/)
542. [DonationCoder/Skrommel/CloseAndEject](http://www.dcmembers.com/skrommel/download/closeandeject/)
543. [DonationCoder/Skrommel/CloseCd](http://www.dcmembers.com/skrommel/download/closecd/)
544. [DonationCoder/Skrommel/CloseFence](http://www.dcmembers.com/skrommel/download/closefence/)
545. [DonationCoder/Skrommel/CloseMany](http://www.dcmembers.com/skrommel/download/closemany/)
546. [DonationCoder/Skrommel/CloseToQuit](http://www.dcmembers.com/skrommel/download/closetoquit/)
547. [DonationCoder/Skrommel/ColorTaskbar](http://www.dcmembers.com/skrommel/download/colortaskbar/)
548. [DonationCoder/Skrommel/ConfineMouse](http://www.dcmembers.com/skrommel/download/confinemouse/)
549. [DonationCoder/Skrommel/ControlFence](http://www.dcmembers.com/skrommel/download/controlfence/)
550. [DonationCoder/Skrommel/CopyCap](http://www.dcmembers.com/skrommel/download/copycap/)
551. [DonationCoder/Skrommel/CreateShortcutThere](http://www.dcmembers.com/skrommel/download/createshortcutthere/)
552. [DonationCoder/Skrommel/CutAway](http://www.dcmembers.com/skrommel/download/cutaway/)
553. [DonationCoder/Skrommel/DelEmpty](http://www.dcmembers.com/skrommel/download/delempty/)
554. [DonationCoder/Skrommel/DeskLock](http://www.dcmembers.com/skrommel/download/desklock/)
555. [DonationCoder/Skrommel/Desktop](http://www.dcmembers.com/skrommel/download/desktop/)
556. [DonationCoder/Skrommel/DetachVideo](http://www.dcmembers.com/skrommel/download/detachvideo/)
557. [DonationCoder/Skrommel/DimSaver](http://www.dcmembers.com/skrommel/download/dimsaver/)
558. [DonationCoder/Skrommel/DimScreen](http://www.dcmembers.com/skrommel/download/dimscreen/)
559. [DonationCoder/Skrommel/DoOrDel](http://www.dcmembers.com/skrommel/download/doordel/)
560. [DonationCoder/Skrommel/DoOver](http://www.dcmembers.com/skrommel/download/doover/)
561. [DonationCoder/Skrommel/DownloadAndRun](http://www.dcmembers.com/skrommel/download/downloadandrun/)
562. [DonationCoder/Skrommel/DragKing](http://www.dcmembers.com/skrommel/download/dragking/)
563. [DonationCoder/Skrommel/DragLock](http://www.dcmembers.com/skrommel/download/draglock/)
564. [DonationCoder/Skrommel/DropCommand](http://www.dcmembers.com/skrommel/download/dropcommand/)
565. [DonationCoder/Skrommel/EjectCd](http://www.dcmembers.com/skrommel/download/ejectcd/)
566. [DonationCoder/Skrommel/FadingTaskbar](http://www.dcmembers.com/skrommel/download/fadingtaskbar/)
567. [DonationCoder/Skrommel/FastNavKeys](http://www.dcmembers.com/skrommel/download/fastnavkeys/)
568. [DonationCoder/Skrommel/Find](http://www.dcmembers.com/skrommel/download/find/)
569. [DonationCoder/Skrommel/FindFocus](http://www.dcmembers.com/skrommel/download/findfocus/)
570. [DonationCoder/Skrommel/Ghoster](http://www.dcmembers.com/skrommel/download/ghoster/)
571. [DonationCoder/Skrommel/GoneIn60s](http://www.dcmembers.com/skrommel/download/gonein60s/)
572. [DonationCoder/Skrommel/HideDesktop](http://www.dcmembers.com/skrommel/download/hidedesktop/)
573. [DonationCoder/Skrommel/IdleMute](http://www.dcmembers.com/skrommel/download/idlemute/)
574. [DonationCoder/Skrommel/IdleRun](http://www.dcmembers.com/skrommel/download/idlerun/)
575. [DonationCoder/Skrommel/IpUpload](http://www.dcmembers.com/skrommel/download/ipupload/)
576. [DonationCoder/Skrommel/Kill](http://www.dcmembers.com/skrommel/download/kill/)
577. [DonationCoder/Skrommel/LabelControl](http://www.dcmembers.com/skrommel/download/labelcontrol/)
578. [DonationCoder/Skrommel/LiPs](http://www.dcmembers.com/skrommel/download/lips/)
579. [DonationCoder/Skrommel/LowToSleep](http://www.dcmembers.com/skrommel/download/lowtosleep/)
580. [DonationCoder/Skrommel/MicMute](http://www.dcmembers.com/skrommel/download/micmute/)
581. [DonationCoder/Skrommel/MinimOther](http://www.dcmembers.com/skrommel/download/minimother/)
582. [DonationCoder/Skrommel/MonitOff](http://www.dcmembers.com/skrommel/download/monitoff/)
583. [DonationCoder/Skrommel/MonitorOffSaver](http://www.dcmembers.com/skrommel/download/monitoroffsaver/)
584. [DonationCoder/Skrommel/MouseActivate](http://www.dcmembers.com/skrommel/download/mouseactivate/)
585. [DonationCoder/Skrommel/MouseClock](http://www.dcmembers.com/skrommel/download/mouseclock/)
586. [DonationCoder/Skrommel/MouseMark](http://www.dcmembers.com/skrommel/download/mousemark/)
587. [DonationCoder/Skrommel/MoveInactiveWin](http://www.dcmembers.com/skrommel/download/moveinactivewin/)
588. [DonationCoder/Skrommel/MoveOut](http://www.dcmembers.com/skrommel/download/moveout/)
589. [DonationCoder/Skrommel/MultiMonMan](http://www.dcmembers.com/skrommel/download/multimonman/)
590. [DonationCoder/Skrommel/Mute](http://www.dcmembers.com/skrommel/download/mute/)
591. [DonationCoder/Skrommel/NoClose](http://www.dcmembers.com/skrommel/download/noclose/)
592. [DonationCoder/Skrommel/Noise](http://www.dcmembers.com/skrommel/download/noise/)
593. [DonationCoder/Skrommel/NoStrayClicks](http://www.dcmembers.com/skrommel/download/nostrayclicks/)
594. [DonationCoder/Skrommel/OnTop](http://www.dcmembers.com/skrommel/download/ontop/)
595. [DonationCoder/Skrommel/OpeningHours](http://www.dcmembers.com/skrommel/download/openinghours/)
596. [DonationCoder/Skrommel/PasteBinPost](http://www.dcmembers.com/skrommel/download/pastebinpost/)
597. [DonationCoder/Skrommel/PauseProcess](http://www.dcmembers.com/skrommel/download/pauseprocess/)
598. [DonationCoder/Skrommel/PixelNotifier](http://www.dcmembers.com/skrommel/download/pixelnotifier/)
599. [DonationCoder/Skrommel/PlainPaste](http://www.dcmembers.com/skrommel/download/plainpaste/)
600. [DonationCoder/Skrommel/ProcessGuard](http://www.dcmembers.com/skrommel/download/processguard/)
601. [DonationCoder/Skrommel/PushMonitOff](http://www.dcmembers.com/skrommel/download/pushmonitoff/)
602. [DonationCoder/Skrommel/PushToShow](http://www.dcmembers.com/skrommel/download/pushtoshow/)
603. [DonationCoder/Skrommel/PushToTalk](http://www.dcmembers.com/skrommel/download/pushtotalk/)
604. [DonationCoder/Skrommel/RandomScreenSaver](http://www.dcmembers.com/skrommel/download/randomscreensaver/)
605. [DonationCoder/Skrommel/RecentRun](http://www.dcmembers.com/skrommel/download/recentrun/)
606. [DonationCoder/Skrommel/Removable](http://www.dcmembers.com/skrommel/download/removable/)
607. [DonationCoder/Skrommel/RemoveUrlTimeStamp](http://www.dcmembers.com/skrommel/download/removeurltimestamp/)
608. [DonationCoder/Skrommel/ReRun](http://www.dcmembers.com/skrommel/download/rerun/)
609. [DonationCoder/Skrommel/Run](http://www.dcmembers.com/skrommel/download/run/)
610. [DonationCoder/Skrommel/RunAndHide](http://www.dcmembers.com/skrommel/download/runandhide/)
611. [DonationCoder/Skrommel/RunAsTools](http://www.dcmembers.com/skrommel/download/runastools/)
612. [DonationCoder/Skrommel/RunSave](http://www.dcmembers.com/skrommel/download/runsave/)
613. [DonationCoder/Skrommel/RunScreenSaver](http://www.dcmembers.com/skrommel/download/runscreensaver/)
614. [DonationCoder/Skrommel/RunToClose](http://www.dcmembers.com/skrommel/download/runtoclose/)
615. [DonationCoder/Skrommel/ScreamerMenu](http://www.dcmembers.com/skrommel/download/screamermenu/)
616. [DonationCoder/Skrommel/ShiftOff](http://www.dcmembers.com/skrommel/download/shiftoff/)
617. [DonationCoder/Skrommel/ShortcutFolder](http://www.dcmembers.com/skrommel/download/shortcutfolder/)
618. [DonationCoder/Skrommel/ShortcutSync](http://www.dcmembers.com/skrommel/download/shortcutsync/)
619. [DonationCoder/Skrommel/ShortCutter](http://www.dcmembers.com/skrommel/download/shortcutter/)
620. [DonationCoder/Skrommel/ShortcutTip](http://www.dcmembers.com/skrommel/download/shortcuttip/)
621. [DonationCoder/Skrommel/ShowDialogsToo](http://www.dcmembers.com/skrommel/download/showdialogstoo/)
622. [DonationCoder/Skrommel/ShowOff](http://www.dcmembers.com/skrommel/download/showoff/)
623. [DonationCoder/Skrommel/SingleApp](http://www.dcmembers.com/skrommel/download/singleapp/)
624. [DonationCoder/Skrommel/SingleInstance](http://www.dcmembers.com/skrommel/download/singleinstance/)
625. [DonationCoder/Skrommel/SmallMeasure](http://www.dcmembers.com/skrommel/download/smallmeasure/)
626. [DonationCoder/Skrommel/StartClock](http://www.dcmembers.com/skrommel/download/startclock/)
627. [DonationCoder/Skrommel/TakeABreak](http://www.dcmembers.com/skrommel/download/takeabreak/)
628. [DonationCoder/Skrommel/TaskLog](http://www.dcmembers.com/skrommel/download/tasklog/)
629. [DonationCoder/Skrommel/TheEnd](http://www.dcmembers.com/skrommel/download/theend/)
630. [DonationCoder/Skrommel/TicTocTitle](http://www.dcmembers.com/skrommel/download/tictoctitle/)
631. [DonationCoder/Skrommel/TimeStamp](http://www.dcmembers.com/skrommel/download/timestamp/)
632. [DonationCoder/Skrommel/ToddlerTrap](http://www.dcmembers.com/skrommel/download/toddlertrap/)
633. [DonationCoder/Skrommel/TransOther](http://www.dcmembers.com/skrommel/download/transother/)
634. [DonationCoder/Skrommel/TrayScreenSaver](http://www.dcmembers.com/skrommel/download/trayscreensaver/)
635. [DonationCoder/Skrommel/UnderCover](http://www.dcmembers.com/skrommel/download/undercover/)
636. [DonationCoder/Skrommel/UrlHistory](http://www.dcmembers.com/skrommel/download/urlhistory/)
637. [DonationCoder/Skrommel/UsedFonts](http://www.dcmembers.com/skrommel/download/usedfonts/)
638. [DonationCoder/Skrommel/WhatColor](http://www.dcmembers.com/skrommel/download/whatcolor/)
639. [DonationCoder/Skrommel/White](http://www.dcmembers.com/skrommel/download/white/)
640. [DonationCoder/Skrommel/WinLock](http://www.dcmembers.com/skrommel/download/winlock/)
641. [DonationCoder/Skrommel/WinStep](http://www.dcmembers.com/skrommel/download/winstep/)
642. [DonationCoder/Skrommel/WinWarden](http://www.dcmembers.com/skrommel/download/winwarden/)
643. [DonationCoder/Skrommel/ZoneSize](http://www.dcmembers.com/skrommel/download/zonesize/)
644. [DonationCoder/Skrommel/ZoomSaver](http://www.dcmembers.com/skrommel/download/zoomsaver/)
645. [DonationCoder/Skwire/Album Printer](http://www.dcmembers.com/skwire/download/album-printer/)
646. [DonationCoder/Skwire/Anuran](http://www.dcmembers.com/skwire/download/anuran/)
647. [DonationCoder/Skwire/Aspect Ratio Tool for Images](http://www.dcmembers.com/skwire/download/arti/)
648. [DonationCoder/Skwire/Barbecue](http://www.dcmembers.com/skwire/download/barbecue/)
649. [DonationCoder/Skwire/Bestimate](http://www.dcmembers.com/skwire/download/bestimate/)
650. [DonationCoder/Skwire/Birthdays](http://www.dcmembers.com/skwire/download/birthdays/)
651. [DonationCoder/Skwire/Boot Snooze](http://www.dcmembers.com/skwire/download/boot-snooze/)
652. [DonationCoder/Skwire/Chopping List](http://www.dcmembers.com/skwire/download/chopping-list/)
653. [DonationCoder/Skwire/ClipTrap](http://www.dcmembers.com/skwire/download/cliptrap/)
654. [DonationCoder/Skwire/Comic Book Archive Creator](http://www.dcmembers.com/skwire/download/comic-book-archive-creator/)
655. [DonationCoder/Skwire/CovArt Ops](http://www.dcmembers.com/skwire/download/covart-ops/)
656. [DonationCoder/Skwire/Deletist](http://www.dcmembers.com/skwire/download/deletist/)
657. [DonationCoder/Skwire/Dimensions 2 Folders](http://www.dcmembers.com/skwire/download/dimensions-2-folders/)
658. [DonationCoder/Skwire/Drive Letters Tool](http://www.dcmembers.com/skwire/download/drive-letters-tool/)
659. [DonationCoder/Skwire/Drop Zone](http://www.dcmembers.com/skwire/download/drop-zone/)
660. [DonationCoder/Skwire/Earl](http://www.dcmembers.com/skwire/download/earl/)
661. [DonationCoder/Skwire/epCheck](http://www.dcmembers.com/skwire/download/epcheck/)
662. [DonationCoder/Skwire/File Bucket](http://www.dcmembers.com/skwire/download/file-bucket/)
663. [DonationCoder/Skwire/File Punter](http://www.dcmembers.com/skwire/download/file-punter/)
664. [DonationCoder/Skwire/Files 2 Folder](http://www.dcmembers.com/skwire/download/files-2-folder/)
665. [DonationCoder/Skwire/Frameless](http://www.dcmembers.com/skwire/download/frameless/)
666. [DonationCoder/Skwire/IE Proxy Toggle](http://www.dcmembers.com/skwire/download/ie-proxy-toggle/)
667. [DonationCoder/Skwire/KeyCounter](http://www.dcmembers.com/skwire/download/keycounter/)
668. [DonationCoder/Skwire/kLED](http://www.dcmembers.com/skwire/download/kled/)
669. [DonationCoder/Skwire/List Numberer](http://www.dcmembers.com/skwire/download/list-numberer/)
670. [DonationCoder/Skwire/Looper](http://www.dcmembers.com/skwire/download/looper/)
671. [DonationCoder/Skwire/Lucidity](http://www.dcmembers.com/skwire/download/lucidity/)
672. [DonationCoder/Skwire/Media Player Hotkeys](http://www.dcmembers.com/skwire/download/mph/)
673. [DonationCoder/Skwire/Mouse Acceleration Toggler](http://www.dcmembers.com/skwire/download/mat/)
674. [DonationCoder/Skwire/MPCPLed](http://www.dcmembers.com/skwire/download/mpcpled/)
675. [DonationCoder/Skwire/OMDb Tool](http://www.dcmembers.com/skwire/download/omdb-tool/)
676. [DonationCoder/Skwire/PDFInfoGUI](http://www.dcmembers.com/skwire/download/pdfinfogui/)
677. [DonationCoder/Skwire/Piggy Banks](http://www.dcmembers.com/skwire/download/piggy-banks/)
678. [DonationCoder/Skwire/PlayTime](http://www.dcmembers.com/skwire/download/playtime/)
679. [DonationCoder/Skwire/Power Scheme Toggler](http://www.dcmembers.com/skwire/download/power-scheme-toggler/)
680. [DonationCoder/Skwire/RecursiView](http://www.dcmembers.com/skwire/download/recursiview/)
681. [DonationCoder/Skwire/sCheckbook](http://www.dcmembers.com/skwire/download/scheckbook/)
682. [DonationCoder/Skwire/sChecklist](http://www.dcmembers.com/skwire/download/schecklist/)
683. [DonationCoder/Skwire/SCURLed](http://www.dcmembers.com/skwire/download/scurled/)
684. [DonationCoder/Skwire/Sensatronics Tray Tool](http://www.dcmembers.com/skwire/download/sensatronics-tray-tool/)
685. [DonationCoder/Skwire/SFV Ninja](http://www.dcmembers.com/skwire/download/sfv-ninja/)
686. [DonationCoder/Skwire/SigcheckGUI](http://www.dcmembers.com/skwire/download/sigcheckgui/)
687. [DonationCoder/Skwire/sImgurUploader](http://www.dcmembers.com/skwire/download/simguruploader/)
688. [DonationCoder/Skwire/Simple Word Gen](http://www.dcmembers.com/skwire/download/simple-word-gen/)
689. [DonationCoder/Skwire/Size Matters](http://www.dcmembers.com/skwire/download/size-matters/)
690. [DonationCoder/Skwire/sLyrics](http://www.dcmembers.com/skwire/download/slyrics/)
691. [DonationCoder/Skwire/Snap DB](http://www.dcmembers.com/skwire/download/snap-db/)
692. [DonationCoder/Skwire/Spews](http://www.dcmembers.com/skwire/download/spews/)
693. [DonationCoder/Skwire/sPinger](http://www.dcmembers.com/skwire/download/spinger/)
694. [DonationCoder/Skwire/SpinZip](http://www.dcmembers.com/skwire/download/spinzip/)
695. [DonationCoder/Skwire/Splat](http://www.dcmembers.com/skwire/download/splat/)
696. [DonationCoder/Skwire/sPlaylistMaker](http://www.dcmembers.com/skwire/download/splaylistmaker/)
697. [DonationCoder/Skwire/Squeaky Mouse](http://www.dcmembers.com/skwire/download/squeaky-mouse/)
698. [DonationCoder/Skwire/sStockQuote](http://www.dcmembers.com/skwire/download/sstockquote/)
699. [DonationCoder/Skwire/Steam URL Converter](http://www.dcmembers.com/skwire/download/steam-url-converter/)
700. [DonationCoder/Skwire/sTray](http://www.dcmembers.com/skwire/download/stray/)
701. [DonationCoder/Skwire/SubAHK](http://www.dcmembers.com/skwire/download/subahk/)
702. [DonationCoder/Skwire/sWavPlayer](http://www.dcmembers.com/skwire/download/swavplayer/)
703. [DonationCoder/Skwire/sWeather](http://www.dcmembers.com/skwire/download/sweather/)
704. [DonationCoder/Skwire/Switcheroo](http://www.dcmembers.com/skwire/download/switcheroo/)
705. [DonationCoder/Skwire/Tags 2 Folders](http://www.dcmembers.com/skwire/download/tags-2-folders/)
706. [DonationCoder/Skwire/Ten Timer](http://www.dcmembers.com/skwire/download/ten-timer/)
707. [DonationCoder/Skwire/Text 2 Folders](http://www.dcmembers.com/skwire/download/text-2-folders/)
708. [DonationCoder/Skwire/tiffInfoGUI](http://www.dcmembers.com/skwire/download/tiffinfogui/)
709. [DonationCoder/Skwire/TIFFsy Turvy](http://www.dcmembers.com/skwire/download/tiffsy-turvy/)
710. [DonationCoder/Skwire/Trackerr](http://www.dcmembers.com/skwire/download/trackerr/)
711. [DonationCoder/Skwire/Tray Host Checker](http://www.dcmembers.com/skwire/download/tray-host-checker/)
712. [DonationCoder/Skwire/TrayLang](http://www.dcmembers.com/skwire/download/traylang/)
713. [DonationCoder/Skwire/Trout](http://www.dcmembers.com/skwire/download/trout/)
714. [DonationCoder/Skwire/Video 2 MP3](http://www.dcmembers.com/skwire/download/video-2-mp3/)
715. [DonationCoder/Skwire/Volt](http://www.dcmembers.com/skwire/download/volt/)
716. [DonationCoder/Skwire/Wallpaper Welder](http://www.dcmembers.com/skwire/download/wallpaper-welder/)
717. [DonationCoder/Skwire/Waste Not](http://www.dcmembers.com/skwire/download/waste-not/)
718. [DonationCoder/Skwire/Window Hotkey Activator Tool](http://www.dcmembers.com/skwire/download/what/)
719. [DonationCoder/Skwire/Zero Zipper](http://www.dcmembers.com/skwire/download/zero-zipper/)
720. [DOSBox](https://sourceforge.net/projects/dosbox/files/dosbox/) An Open Source DOS emulator to run old DOS games
721. [Double Commander](https://sourceforge.net/projects/doublecmd/files/DC%20for%20Windows%2064%20bit/) Double Commander is a cross platform open source file manager with two panels side by side. It is inspired by Total Commander and features some new ideas.
722. [Driver Genius](http://www.driver-soft.com/download.html) :money_with_wings: :airplane:
723. [DriverPack Solution Network](https://drp.su/api/miscs/products)
724. [DriverPack Solution Online](https://www.softpedia.com/get/System/System-Miscellaneous/DriverPack-Solution-Lite.shtml) Finds outdated drivers on your computer and enables you to download and install the latest versions, so as to keep your system in top shape
725. [Dropbox](https://www.dropboxforum.com/t5/Desktop-client-builds/bd-p/101003016)
726. [DropIt](https://sourceforge.net/projects/dropit/files/DropIt/) A flexible tool to automate processing & organizing files and folders.
727. [DTCP](https://github.com/alchen/DTCP/releases/latest) [4/45/9] Desktop Twitter Client Project.
728. [Duplicate Cleaner](https://www.duplicatecleaner.com/index.html) [Free Personal]
729. [Duplicate File Detective](https://www.duplicatedetective.com/download) :money_with_wings:
730. [duplicati](https://github.com/duplicati/duplicati/releases) [208/4,032/492] Store securely encrypted backups in the cloud!
731. [DupScout](https://www.dupscout.com/downloads.html) [Free Personal]
732. [DxWnd](https://sourceforge.net/projects/dxwnd/files/Latest%20build/) Window hooker to run fullscreen programs in window and much more...
733. [DynVPN](https://dynvpn.com/download/)
734. [EagleGet](http://www.eagleget.com/download-eagleget-portable/)
735. [EarTrumpet-Fork](https://github.com/Nonononoki/EarTrumpet/releases/latest) [0/1/166] EarTrumpet - Volume Control for Windows - With compiled binary!
736. [EasyDrv](https://www.itsk.com/thread-394989-1-1.html) :hand:
737. [EasySysprep](https://www.itsk.com/thread-396278-1-1.html)
738. [EasyU](https://www.itsk.com/thread-396280-1-1.html)
739. [Ebook Reader](https://icecreamapps.com/Ebook-Reader/) [Free Personal]
740. [eDEX-UI](https://github.com/GitSquared/edex-ui/releases/latest) [226/9,836/558] A cross-platform, customizable science fiction terminal emulator with advanced monitoring & touchscreen support.
741. [EF/EF AutoSync](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
742. [EF/EF CheckSum Manager](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
743. [EF/EF Commander](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
744. [EF/EF Duplicate Files Manager](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
745. [EF/EF Duplicate MP3 Finder](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
746. [EF/EF File Catalog](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
747. [EF/EF Find](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
748. [EF/EF Mailbox Manager](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
749. [EF/EF Multi File Renamer](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
750. [EF/EF Process Manager](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
751. [EF/EF StartUp Manager](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
752. [EF/EF System Monitor](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
753. [EF/EF Talk Scriber](http://www.efsoftware.com/dw/e.htm) :money_with_wings:
754. [Eintopf](https://github.com/mazehall/eintopf/releases/latest) [7/62/3] The smartest way to share and administrate docker projects.
755. [ElectronReact](https://github.com/electron-react-boilerplate/electron-react-boilerplate/releases/latest) [262/11,943/1,976] A Foundation for Scalable Cross-Platform Apps.
756. [Elephant](https://github.com/jusu/Elephant/releases/latest) [22/222/25] Notetaker with a classic interface.
757. [EMDB](http://www.emdb.eu/)
758. [EmEditor](https://www.emeditor.com/download/) :money_with_wings:
759. [eMule Morph](https://sourceforge.net/projects/emulemorph/files/MorphXT/) eMule Morph Mod - eMule Modding Project
760. [eMule Plus](https://sourceforge.net/projects/emuleplus/files/eMulePlus/) eMule Plus is an evolution of the original eMule project, created to improve its abilities and features, in both work efficiency and user interface.
761. [eMule](https://sourceforge.net/projects/emule/files/eMule/) A free peer-to-peer (P2P) file sharing client
762. [EndNote](https://www.softpedia.com/get/Office-tools/Other-Office-Tools/EndNote-X.shtml) :pushpin: Organize references and create bibliographies for your research papers, manage your documentation in an easy manner and build your project easier
763. [Enigma Virtual Box unpacker](https://lifeinhex.com/tag/enigma-virtual-box/) :hand:
764. [Enigma Virtual Box](https://enigmaprotector.com/en/downloads/changelogenigmavb.html)
765. [Enpass](https://www.enpass.io/downloads/) [Free Personal]
766. [Epic Games](https://www.epicgames.com/store/zh-CN/)
767. [erickutcher/HTTP Downloader](https://github.com/erickutcher/httpdownloader/releases/latest) [6/17/9] HTTP(S) download manager that uses input/output completion ports (IOCP).
768. [erickutcher/HTTP Proxy](https://github.com/erickutcher/httpproxy/releases/latest) [2/1/6] HTTP(S) proxy that uses input/output completion ports (IOCP).
769. [erickutcher/MD5 Bruteforcer](https://github.com/erickutcher/md5bruteforcer/releases/latest) [2/0/1] Brute force MD5 hash values using CUDA.
770. [erickutcher/Monitor Off](https://github.com/erickutcher/monitoroff/releases/latest) [1/0/0] Turn off your monitor with a simple mouse click or keyboard shortcut.
771. [erickutcher/Thumbcache Viewer](https://github.com/thumbcacheviewer/thumbcacheviewer/releases/latest) [6/37/8] Thumbcache Viewer - Extract Windows Vista, Windows 7, Windows 8, Windows 8.1, and Windows 10 thumbcache database files.
772. [erickutcher/Thumbs Viewer](https://github.com/thumbsviewer/thumbsviewer/releases/latest) [6/33/9] Thumbs Viewer - Extract Windows Thumbs.db database files.
773. [erickutcher/VZ Enhanced 56K](https://github.com/erickutcher/vzenhanced56k/releases/latest) [2/2/1] VZ Enhanced 56K is a 56K based call logger/blocker.
774. [erickutcher/VZ Enhanced](https://github.com/vzenhanced/vzenhanced/releases/latest) [4/2/0] VZ Enhanced is a caller ID notifier that can forward and block phone calls.
775. [ESBCalc](https://www.esbconsult.com/esbcalc/esbcalc.htm)
776. [EssentialPIM](https://www.essentialpim.com/news/version-history) [Free Personal]
777. [Euler Math Toolbox](https://sourceforge.net/projects/eumat/files/Installer/) Numerical and Symbolic Math Tool
778. [Evernote](https://evernote.com/intl/zh-cn/download)
779. [Everything](https://www.voidtools.com/downloads/)
780. [Exact Audio Copy](https://www.softpedia.com/get/Multimedia/Audio/Audio-CD-Rippers-Encoders/Exact-Audio-Copy.shtml) Extract and copy music data, optimize the output, create ID3 tags and set up complex naming rules with the help of this powerful audio tool
781. [Executor](http://www.1space.dk/executor/downloadlinks.html)
782. [Exodus](https://www.exodus.io/download/) :money_with_wings:
783. [Explorer++](https://github.com/derceg/explorerplusplus/releases/latest) :airplane: [81/617/155] Explorer++ is a lightweight and fast file manager for Windows
784. [Ext2Fsd](https://sourceforge.net/projects/ext2fsd/files/Ext2fsd/) A Linux ext2/ext3 file system driver for Windows
785. [ExtendOffice/Kutools for Excel](https://www.extendoffice.com/download/kutools-for-excel.html) :money_with_wings:
786. [ExtendOffice/Kutools for Outlook](https://www.extendoffice.com/download/kutools-for-outlook.html) :money_with_wings:
787. [ExtendOffice/Kutools for Word](https://www.extendoffice.com/download/kutools-for-word.html) :money_with_wings:
788. [ExtendOffice/Office Tab](https://www.extendoffice.com/download/office-tab.html) :money_with_wings:
789. [ExtendOffice/Tabs for Excel](https://www.extendoffice.com/download/excel-workbooks-tabs.html) :money_with_wings:
790. [ExtendOffice/Tabs for PowerPoint](https://www.extendoffice.com/download/powerpoint-presentations-tabs.html) :money_with_wings:
791. [ExtendOffice/Tabs for Word](https://www.extendoffice.com/download.html) :money_with_wings:
792. [Extraterm](https://github.com/sedwards2009/extraterm/releases) [43/1,070/48] The swiss army chainsaw of terminal emulators.
793. [ExtremeCopy](http://www.easersoft.com/product.html) :money_with_wings:
794. [f.lux](https://justgetflux.com/update/v4/windows-download.json)
795. [falcon](https://github.com/plotly/falcon/releases/latest) [54/714/93] Free, open-source SQL client for Windows and Mac 🦅
796. [Far Manager](https://farmanager.com/download.php?l=en)
797. [FastCopy-M](https://github.com/Mapaler/FastCopy-M/releases/latest) [35/395/75] FastCopy-Multilanguage，FastCopy完整支持多国语言版.
798. [FastCopy](https://fastcopy.jp/)
799. [FastKeys](https://www.fastkeysautomation.com/) :money_with_wings:
800. [FastStone/Capture](http://www.faststone.org/FSCapturerDownload.htm) :money_with_wings:
801. [FastStone/Image Viewer](http://www.faststone.org/FSViewerDownload.htm) [Freemium]
802. [FastStone/MaxView](http://www.faststone.org/FSMaxViewDownload.htm) :money_with_wings:
803. [FastStone/Photo Resizer](http://www.faststone.org/FSResizerDownload.htm) [Freemium]
804. [FeedDemon](http://www.bradsoft.com/)
805. [Feedreader](https://www.softpedia.com/get/Internet/News-Newsgroups-Blog-Tools/Feedreader.shtml) A lightweight open-source aggregator that supports RSS and ATOM formats
806. [Felony](https://github.com/henryboldi/felony/releases/latest) [78/3,477/145] 🔑🔥📈 Next Level PGP.
807. [Fenrir/FenrirFS](https://www.fenrir-inc.com/jp/fenrirfs/note.html)
808. [Fenrir/PictBear](https://www.fenrir-inc.com/jp/pictbear/)
809. [Fenrir/Sleipnir](https://www.fenrir-inc.com/jp/sleipnir/note.html)
810. [Fenrir/SnapCrab](https://www.fenrir-inc.com/jp/snapcrab/note.html)
811. [ffmpeg](https://ffmpeg.zeranoe.com/builds/)
812. [Fiddler Web Debugger](https://www.softpedia.com/get/Programming/Debuggers-Decompilers-Dissasemblers/Telerik-Fiddler.shtml) A useful HTTP debugging proxy utility that logs all HTTP traffic between your computer and the Internet and decrypts HTTPS web sessions
813. [FiddlerCap Web Recorder](https://www.softpedia.com/get/Internet/Other-Internet-Related/FiddlerCap-Web-Recorder.shtml) Monitor, capture and save web traffic logs to send them to a debugging tool for troubleshooting, in order to track down any bugs in your web browser or website
814. [FileUploader](http://z-o-o-m.eu/down.htm)
815. [FileVoyager](https://www.filevoyager.com/download/)
816. [FileZilla Server](https://filezilla-project.org/download.php?type=server)
817. [FileZilla](https://filezilla-project.org/download.php?type=client)
818. [Find And Replace@olivierwehner](https://sourceforge.net/projects/findandreplace/files/findandreplace/) Search and replace operations on file content accross multiple files. Recursive operations within entire directory trees. FAR comes with support for…
819. [Find and Replace@zzzprojects](https://github.com/zzzprojects/findandreplace/releases/latest) [14/81/24] fnr.exe - Find And Replace Tool.
820. [firefly-proxy](https://github.com/yinghuocho/firefly-proxy/releases/latest) [369/4,613/877] A proxy software to help circumventing the Great Firewall.
821. [firefox-history-merger](https://github.com/crazy-max/firefox-history-merger/releases/latest) [4/21/1] 🦊 Merge Firefox history from multiple places.sqlite and repair missing favicons
822. [Flamory](https://www.softpedia.com/get/Internet/Bookmark-Managers/Flamory.shtml) Create searchable bookmarks for websites and local applications with this intuitive and flexible program that allows you to save and crop screenshots
823. [FlashFXP](https://www.flashfxp.com/download) :money_with_wings: :pushpin:
824. [FlixGrab](https://www.flixgrab.com/)
825. [fman](https://fman.io/download/thank-you?os=Windows) :money_with_wings: :hand:
826. [Focusky](http://focusky.com/) [Freemium]
827. [FolderSizes](https://www.foldersizes.com/download)
828. [Foobar2000](http://www.foobar2000.org/download)
829. [Fopnu](https://www.fopnu.com/download/windows64.html)
830. [Fork](https://git-fork.com/releasenoteswin)
831. [FormatFactory](http://www.pcfreetime.com/formatfactory/CN/download.html)
832. [Fotosizer](https://www.fotosizer.com/Download) [Free Personal]
833. [FotoSketcher](https://fotosketcher.com/download-fotosketcher/)
834. [Foxit Reader](https://www.softpedia.com/get/Office-tools/PDF/Foxit-PDF-Reader.shtml) View, edit or create PDF files with this rich-featured application, which also offers support for drawing tools, signatures, full screen mode and more
835. [Foxmail](https://www.foxmail.com/)
836. [Franz](https://github.com/meetfranz/franz/releases/latest) [108/2,992/410] Franz is a free messaging app for services like WhatsApp, Slack, Messenger and many more.
837. [freac](https://github.com/enzo1982/freac/releases/latest) [24/190/23] The fre:ac audio converter project.
838. [Free Alarm Clock](http://freealarmclocksoftware.com/) [Free Personal]
839. [Free Download Manager](https://www.freedownloadmanager.org/download.htm)
840. [Free Virtual Keyboard](http://freevirtualkeyboard.com/)
841. [FreeCAD](https://github.com/FreeCAD/FreeCAD/releases/latest) [436/3,840/1,337] This is the official source code of FreeCAD, a free and opensource multiplatform 3D parametric modeler. Issues are managed on our own bug tracker at https://www.freecadweb.org/tracker
842. [FreeCommander](https://freecommander.com/en/downloads/) [Free Personal]
843. [FreeFileSync](https://freefilesync.org/download.php) [Free Personal] :hand:
844. [FreeGate](https://www.softpedia.com/get/Network-Tools/Misc-Networking-Tools/Freegate.shtml) :airplane: Use this powerful software solution to visit your favorite pages while avoiding detection with enhanced speed and history automatically cleared
845. [FreeMAN](https://github.com/matthew-matvei/freeman/releases/latest) [10/147/17] A free, extensible, cross-platform file manager for power users
846. [Freenet](https://github.com/freenet/fred/releases/latest) [75/508/151] Freenet REference Daemon.
847. [Freeter](https://freeter.io/download) [Free Personal]
848. [FreeVimager](https://www.contaware.com/downloads/latest/FreeVimager/english/)
849. [FromScratch](https://github.com/Kilian/fromscratch/releases/latest) [22/491/53] Autosaving Scratchpad. A simple but smart note-taking app
850. [FrostWire](https://github.com/frostwire/frostwire/releases) [28/196/107] An easy to use Cloud Downloader, BitTorrent Client and Media Player. Search, Download, Play, Share
851. [FTPGrab](https://github.com/ftpgrab/ftpgrab/releases/latest) [14/156/33] ⚡ Grab your files periodically from a remote FTP or SFTP server easily
852. [fzf](https://github.com/junegunn/fzf-bin/releases/latest) [11/64/1] Official fzf binaries.
853. [gallery-dl](https://github.com/mikf/gallery-dl/releases/latest) [48/511/64] Command-line program to download image-galleries and -collections from several image hosting sites
854. [Ganache](https://github.com/trufflesuite/ganache/releases/latest) [73/1,586/248] Personal blockchain for Ethereum development.
855. [GARbro](https://github.com/morkt/GARbro/releases/latest) [49/320/42] Visual Novels resource browser.
856. [Geany](https://www.geany.org/Download/Releases)
857. [gedit](http://ftp.gnome.org/pub/GNOME/binaries/win64/gedit/)
858. [Geek Uninstaller](https://geekuninstaller.com/download)
859. [genet](https://github.com/genet-app/genet/releases/latest) [6/163/21] Graphical network analyzer powered by web technologies
860. [GestureSign](https://github.com/TransposonY/GestureSign/releases/latest) [11/142/21] A gesture recognition software for Windows tablet.
861. [Ghost](https://github.com/TryGhost/Ghost-Desktop/releases/latest) [55/1,011/158] ⚡️ Ghost for Desktops.
862. [GhostBuster](https://www.majorgeeks.com/mg/getmirror/ghostbuster,1.html) GhostBuster scans your registry for ghosted devices (hardware no longer connected to the PC) and then removes them with a single mouse click.
863. [GifCam](https://en.softonic.com/download/gifcam/windows/post-download)
864. [Gifsicle](https://eternallybored.org/misc/gifsicle/)
865. [Gillmeister Software/Automatic Email Processor](https://gillmeister-software.com/products/automatic-email-processor/download.aspx)
866. [Gillmeister Software/AutoText Master](https://gillmeister-software.com/products/autotext-master/download.aspx)
867. [Gillmeister Software/Batch Text Replacer](https://gillmeister-software.com/products/batch-text-replacer/download.aspx)
868. [Gillmeister Software/Folder2List](https://www.folder2list.com/download.aspx)
869. [Gillmeister Software/Outlook Attachment Extractor](https://www.outlook-attachment-extractor.com/download.aspx)
870. [Gillmeister Software/Rename Expert](https://www.rename-expert.com/download.aspx)
871. [Gillmeister Software/Word Text Replacer](https://gillmeister-software.com/products/word-text-replacer/download.aspx)
872. [gImageReader](https://github.com/manisandro/gImageReader/releases/latest) [49/436/74] A Gtk/Qt front-end to tesseract-ocr.
873. [GIMP](https://www.gimp.org/downloads/)
874. [Git Extensions](https://github.com/gitextensions/gitextensions/releases) [251/3,862/1,218] Git Extensions is a standalone UI tool for managing git repositories. It also integrates with Windows Explorer and Microsoft Visual Studio (2010/2012/2013/2015/2017).
875. [Git-it](https://github.com/jlord/git-it-electron/releases/latest) [184/2,881/693] :computer: :mortar_board: Git-it is a (Mac, Win, Linux) Desktop App for Learning Git and GitHub
876. [Git](https://github.com/git-for-windows/git/releases/latest) [449/4,360/15,729] A fork of Git containing Windows-specific patches.
877. [GitHub](https://central.github.com/deployments/desktop/desktop/changelog.json)
878. [GitKraken](https://www.gitkraken.com/download) [Freemium]
879. [GitNote](https://github.com/zhaopengme/gitnote/releases/latest) [40/953/47] A modern note taking app based on GIT that does not require a local GIT environment.
880. [Glarysoft/Absolute Uninstaller](https://www.glarysoft.com/absolute-uninstaller/) Absolute Uninstaller is a free tool to uninstall software and remove programs completely from your system without leaving any invalid entries or remnants, so as to keep your system clean and light at peak performance.
881. [Glarysoft/Disk SpeedUp](https://www.glarysoft.com/disk-speedup/) Disk SpeedUp is an easy-to-use and fast-working disk defragmenter to defrag computer and clean up disks, so as to improve overall system performance.
882. [Glarysoft/Glary Disk Cleaner](https://www.glarysoft.com/disk-cleaner/) Glary Disk Cleaner is a Free Disk Cleaning Tool. It can free up disk space in an attempt to help keep your PC clean. You can use Glary Disk Cleaner to clear browser history, Clear browser cache, remove browser cookies, empty recycle bin, and remove temp files.
883. [Glarysoft/Glary Disk Explorer](https://www.glarysoft.com/disk-explorer/) Glary Disk Explorer is a free, simple but powerful free disk analysis tool to allow people to quickly identify large files that could be wasting space and hurting performance.
884. [Glarysoft/Glary Duplicate Cleaner](https://www.glarysoft.com/duplicate-cleaner/) Glary Duplicate Cleaner can make some more room by removing unnecessary or copied files in bulk
885. [Glarysoft/Glary Tracks Eraser](https://www.glarysoft.com/tracks-eraser/) Glary Tracks Eraser is a great internet eraser to protect you with only one click, you can erase all the history tracks safely and completely.
886. [Glarysoft/Glary Undelete](https://www.glarysoft.com/glary-undelete/) Glary Undelete is a free, simple but powerful free data recovery tool to help users undelete files and restore deleted files or lost files. It can recover files like images, audios, videos from local disks or external storage devices quick and easily.
887. [Glarysoft/Glary Utilities Pro](https://www.glarysoft.com/glary-utilities-pro/) :money_with_wings: Glary Utilities is free system utilities to clean and repair registry, defrag disk, remove junk files, fix PC errors, protect privacy, and provides more solutions to other PC problems. It is a free, powerful and all-in-one utility in the world market!
888. [Glarysoft/Glary Utilities](https://www.glarysoft.com/glary-utilities/) Glary Utilities is free system utilities to clean and repair registry, defrag disk, remove junk files, fix PC errors, protect privacy, and provides more solutions to other PC problems. It is a free, powerful and all-in-one utility in the world market!
889. [Glarysoft/Malware Hunter](https://www.glarysoft.com/malware-hunter/) :money_with_wings: Malware Hunter is an award-winning product that provides comprehensive protection against all types of threats, secures your data, protects your privacy and ensures your PC remains virus-free.
890. [Glarysoft/Quick Search](https://www.glarysoft.com/quick-search/) Quick Search is a free and cool desktop search tool to search document and locate a file on local disks easily and instantly. It is a fast-working and highly-efficient local search tool alternative to Windows search.
891. [Glarysoft/Quick Startup](https://www.glarysoft.com/quick-startup/) Quick Startup is an advanced startup manager to speed up your windows boot and solve the problem of slow PC system startup. It gives startup items information, reference and allows to delay auto-startup items.
892. [Glarysoft/Registry Repair](https://www.glarysoft.com/registry-repair/) Registry Repair is the best free registry cleaner to scan windows registry, clean up registry junks, and repair registry errors. It works fastest and safest in the world to make your computer run perfectly and smoothly at peak performance!
893. [Glarysoft/Software Update Pro](https://www.glarysoft.com/software-update/) :money_with_wings: Software Update is the easiest and quickest solution to check and update software installed on your computer. It is specially designed to keep your windows software update all the time and guarantees best performance.
894. [Glarysoft/Software Update](https://www.glarysoft.com/software-update/) Software Update is the easiest and quickest solution to check and update software installed on your computer. It is specially designed to keep your windows software update all the time and guarantees best performance.
895. [glimpses](https://getglimpses.com/)
896. [gMKVExtractGUI](https://sourceforge.net/projects/gmkvextractgui/files/) A GUI in C# .NET 4 for mkvextract (MKVToolNix)
897. [GnuCash](https://gnucash.org/download.phtml)
898. [GnuPG](https://www.gnupg.org/download/index.html)
899. [go-shadowsocks2](https://github.com/shadowsocks/go-shadowsocks2/releases/latest) [112/1,355/581] Next-generation Shadowsocks in Go.
900. [goflyway](https://github.com/coyove/goflyway/releases) [173/3,676/568] An encrypted HTTP server.
901. [golang](https://golang.org/dl/)
902. [GoldSolution/AutoShutdown](https://www.softpedia.com/get/System/Launchers-Shutdown-Tools/PC-Auto-Shutdown.shtml) Program your computer to automatically activate one of its power functions with the help of this lightweight and easy to use application
903. [GoldSolution/Driver Magician](http://www.drivermagician.com/download.htm)
904. [GoldSolution/Easy Macro Recorder](http://www.flashplayerpro.com/MacroRecorder/downloadMacroRecorder.htm)
905. [GoodSync](https://www.goodsync.com/download) :pushpin:
906. [Google Chrome](https://api.pzhacm.org/iivb/cu.json)
907. [Google Drive](https://www.softpedia.com/get/Internet/File-Sharing/Google-Drive.shtml) :airplane: Keep and share anything with this storage utility that integrates into Gmail and Google+, allowing you to open numerous file types in the web browser
908. [Google Earth Pro](https://support.google.com/earth/answer/168344) :pushpin:
909. [Google-Play-Music](https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases/latest) [296/7,707/756] A beautiful cross platform Desktop Player for Google Play Music
910. [GoogleTasks](https://github.com/wixiweb/googletasks-desktop/releases) [5/12/3] A desktop app for Google Tasks (using Electron).
911. [GOST](https://github.com/ginuerzh/gost/releases/latest) [202/2,954/614] GO Simple Tunnel - a simple tunnel written in golang
912. [GottCode/Connectagram](https://gottcode.org/connectagram/)
913. [GottCode/CuteMaze](https://gottcode.org/cutemaze/)
914. [GottCode/FocusWriter](https://gottcode.org/focuswriter/)
915. [GottCode/Gottet](https://gottcode.org/gottet/)
916. [GottCode/Hexalate](https://gottcode.org/hexalate/)
917. [GottCode/Kapow](https://gottcode.org/kapow/)
918. [GottCode/NovProg](https://gottcode.org/novprog/)
919. [GottCode/Peg-E](https://gottcode.org/peg-e/)
920. [GottCode/Simsu](https://gottcode.org/simsu/)
921. [GottCode/Tanglet](https://gottcode.org/tanglet/)
922. [GottCode/Tetzle](https://gottcode.org/tetzle/)
923. [Gpg4win](https://gpg4win.org/download.html)
924. [GPU-Z](https://www.techpowerup.com/download/techpowerup-gpu-z/)
925. [GrabIt](https://shemes.com/index.php?p=download) [Free Personal]
926. [Grammarly](https://www.softpedia.com/get/Office-tools/Other-Office-Tools/Grammarly-Grammarly.shtml) Improve your writing style, correct your spelling errors and other grammatical issues with the help of this streamlined app that has a strong proofreading service behind it
927. [Gridea](https://github.com/getgridea/gridea/releases/latest) [44/1,968/156] ✍️一个静态博客写作客户端 (A static blog writing client).
928. [GroupMe](https://github.com/dcrousso/GroupMe/releases/latest) [5/62/6] Unofficial GroupMe App.
929. [gVim](https://github.com/vim/vim-win32-installer/releases/latest) [87/796/102] Vim Win32 Installer.
930. [Hackolade](https://hackolade.com/download.html) :money_with_wings:
931. [Hain](https://github.com/hainproject/hain/releases/latest) [115/2,995/148] An 'alt+space' launcher for Windows, built with Electron
932. [HakuNeko](https://github.com/manga-download/hakuneko/releases/latest) [11/94/20] Manga Downloader for Linux, Windows & MacOS.
933. [Halite](https://github.com/Eoinocal/Halite/releases/latest) [28/167/39] Halite (named after the mineral) is a C++ BitTorrent client based on the excellent libtorrent library developed by Arvid Norberg.
934. [HamMultiPlayer](http://www.hammultiplayer.org/)
935. [HandBrake](https://handbrake.fr/downloads.php)
936. [HappyPanda X](https://github.com/happypandax/happypandax/releases/latest) [29/150/14] A cross-platform server and client application for managing and reading manga and doujinshi
937. [Hard Disk Sentinel](https://www.hdsentinel.com/download.php) :money_with_wings:
938. [hardseedGO](https://github.com/leonunix/hardseedGO/releases/latest) [3/38/5] 你懂的~.
939. [Harmony](https://github.com/vincelwt/harmony/releases/latest) [Free Personal] [33/772/64] :musical_note: Sleek music player for Spotify, SoundCloud, Google Play Music and your local files
940. [Hasleo Software/BitLocker Anywhere For Windows](https://www.easyuefi.com/bitlocker-anywhere/bitlocker-anywhere-home.html) :money_with_wings:
941. [Hasleo Software/Data Recovery](https://www.easyuefi.com/data-recovery/free-data-recovery.html)
942. [Hasleo Software/WinToHDD](https://www.easyuefi.com/wintohdd/index.html)
943. [Hasleo Software/WinToUSB](https://www.easyuefi.com/wintousb/)
944. [HazteK-Software/Host File Manager](https://updates.haztek-software.com/changes.php?appid=7)
945. [HazteK-Software/Remote Manager](https://updates.haztek-software.com/changes.php?appid=8)
946. [HazteK-Software/SHAsher](https://updates.haztek-software.com/changes.php?appid=6)
947. [HazteK-Software/Simple Phone Book](https://updates.haztek-software.com/changes.php?appid=5)
948. [HazteK-Software/SMTP Mail Sender](https://updates.haztek-software.com/changes.php?appid=4)
949. [HazteK-Software/StorURL](https://updates.haztek-software.com/changes.php?appid=1)
950. [HazteK-Software/TrueIP](https://updates.haztek-software.com/changes.php?appid=2)
951. [HD Tune Pro](http://www.hdtune.com/download.html) [Free Personal]
952. [HDDScan](http://hddscan.com/)
953. [Headset](https://github.com/headsetapp/headset-electron/releases/latest) [28/635/71] Official Headset repo.
954. [Hearthstone-Deck-Tracker](https://github.com/HearthSim/Hearthstone-Deck-Tracker/releases/latest) [233/3,593/991] A deck tracker and deck manager for Hearthstone on Windows
955. [Help+Manual](https://www.helpandmanual.com/downloads.html) :money_with_wings:
956. [HelpNDoc](https://www.helpndoc.com/download/) [Freemium]
957. [HexChat](https://hexchat.github.io/downloads.html)
958. [HFS](http://www.rejetto.com/hfs/?f=dl)
959. [HiddeX](http://dejavu.narod.ru/hiddex.html)
960. [Hide.me](https://hide.me/en/software/windows) [Free Personal]
961. [High Motion Software/BonAView](https://www.highmotionsoftware.com/download-center)
962. [High Motion Software/ImBatch](https://www.highmotionsoftware.com/download-center)
963. [High Motion Software/ImWatcher](https://www.highmotionsoftware.com/download-center)
964. [Hitomi-Downloader](https://github.com/KurtBestor/Hitomi-Downloader-issues/releases/latest) [13/108/36] :cake: Desktop application to download images/videos/music/text from Hitomi.la and other sites.
965. [HNSoft/Clicador](https://www.hnsoft.pt/Clicador)
966. [HNSoft/CSearcher](https://www.hnsoft.pt/Downloads_CSearcher)
967. [HNSoft/cStatus](https://www.hnsoft.pt/Downloads_cstatus)
968. [HostsFileEditor](https://github.com/scottlerch/HostsFileEditor/releases/latest) [47/471/70] Easily edit and manage the hosts file for Windows.
969. [HostsMan](https://www.majorgeeks.com/mg/getmirror/hostsman,1.html) HostsMan is a freeware application that lets you manage your Hosts file with ease.
970. [Hot Alarm Clock](https://hotalarmclock.com/download/) [Free Personal]
971. [HotCorner](https://github.com/taviso/hotcorner/releases/latest) [23/204/32] Tiny Hot Corners for Windows 10.
972. [Hotkey Commander](http://hkcmdr.anymania.com/)
973. [HotspotShield](https://www.softpedia.com/get/Security/Security-Related/Hotspot-Shield.shtml) Gain full access to online content while keeping your virtual identity safe with the help of this powerful and easy to use application
974. [Hourglass](https://github.com/dziemborowicz/hourglass/releases/latest) [15/189/40] The simple countdown timer for Windows.
975. [HTTrack](http://www.httrack.com/page/2/en/index.html)
976. [hub](https://github.com/github/hub/releases/latest) [322/16,086/1,620] A command-line tool that makes git easier to use with GitHub.
977. [Hummingbird](https://github.com/thunkli/hummingbird/releases/latest) [10/277/44] A compression (jpg/png/webp/svg/gif/css/js/html) App, Support for macOS and Windows
978. [HWiNFO](https://www.hwinfo.com/download/)
979. [HxD](https://mh-nexus.de/en/downloads.php?product=HxD20)
980. [Hydrus](https://github.com/hydrusnetwork/hydrus/releases/latest) [79/536/44] A personal booru-style media tagger that can import files and tags from your hard drive and popular websites. Content can be shared with other users via user-run servers.
981. [Hyper](https://github.com/zeit/hyper/releases) [491/29,136/2,374] A terminal built on web technologies.
982. [Hyperionics/FileBox eXtender](http://www.hyperionics.com/files/index.asp) :pushpin:
983. [Hyperionics/HyperCam](http://www.hyperionics.com/hc2/index.asp) :money_with_wings:
984. [Hyperionics/HyperSnap](http://www.hyperionics.com/hsdx/index.asp) :money_with_wings:
985. [igdm](https://github.com/ifedapoolarewaju/igdm/releases/latest) [129/1,188/304] Desktop application for Instagram DMs.
986. [ILSpy](https://github.com/icsharpcode/ILSpy/releases/latest) [643/7,703/1,686] .NET Decompiler.
987. [Image Uploader](https://github.com/zenden2k/image-uploader/releases/latest) [12/75/21] Program for uploading images, screenshots, or any other files to a few dozen file hosting services.
988. [ImageMagick](https://imagemagick.org/script/download.php)
989. [Imagemin](https://github.com/imagemin/imagemin-app/releases/latest) [26/759/51] imagemin as an OS X, Linux and Windows app.
990. [Imagine](http://www.nyam.pe.kr/dev/imagine/)
991. [ImgBurn](https://www.softpedia.com/get/CD-DVD-Tools/Data-CD-DVD-Burning/ImgBurn.shtml) :money_with_wings: Burn data to CDs and DVDs, create images, verify data integrity, and configure numerous settings when using this ultimate image burner
992. [Inboxer](https://github.com/denysdovhan/inboxer/releases/latest) [48/683/75] Unofficial, free and open-source Inbox by Gmail Desktop App
993. [Inkscape](https://inkscape.org/release/)
994. [Inno Setup Unpacker](https://sourceforge.net/projects/innounp/files/innounp/) Unpacker for installations made by Inno Setup
995. [Inno Setup](http://www.jrsoftware.org/isdl.php)
996. [innoextract](https://github.com/dscharrer/innoextract/releases/latest) [19/216/35] A tool to unpack installers created by Inno Setup.
997. [InnoExtractor](http://www.havysoft.cl/descargar.html)
998. [Insomnia](https://github.com/getinsomnia/insomnia/releases/latest) [Free Personal] [158/9,789/553] Cross-platform HTTP and GraphQL Client.
999. [Internet Download Accelerator](https://www.westbyte.com/ida/index.phtml?page=download) [Freemium]
1000. [Internet Download Manager](http://www.internetdownloadmanager.com/) :money_with_wings:
1001. [IObit/Advanced SystemCare](https://www.majorgeeks.com/mg/getmirror/advanced_systemcare,1.html) Advanced SystemCare is a popular and efficient all-in-one computer tweaker that will help clean, optimize, speed up and protect your computer. Video tutorial available.
1002. [IObit/Driver Booster](https://www.majorgeeks.com/mg/getmirror/iobit_driver_booster,1.html) Driver Booster can identify, backup and fix outdated, missing or incorrect drivers on your computer. Video tutorial available.
1003. [IObit/IObit Game Booster](https://www.majorgeeks.com/mg/getmirror/iobit_game_booster,1.html) Designed to help optimize your PC for smoother, more responsive game play in the latest PC games with the touch of a button.
1004. [IObit/IObit Malware Fighter](https://www.majorgeeks.com/mg/getmirror/iobit_malware_fighter,1.html) IObit Malware Fighter 7 is an advanced malware & spyware removal utility that detects and removes the deepest infections and protects your PC from malicious behavior in real time.
1005. [IObit/IObit Toolbox](https://www.majorgeeks.com/mg/getmirror/iobit_toolbox,1.html) IObit Toolbox is a free portable software that system administrators and computer geeks will take along to solve PC problems anytime and anywhere.
1006. [IObit/IObit Undelete](https://www.majorgeeks.com/mg/getmirror/iobit_undelete,1.html) IObit Undelete is a no-nonsense solution for recovering lost or deleted files.
1007. [IObit/IObit Uninstaller](https://www.majorgeeks.com/mg/getmirror/iobit_uninstaller,1.html) IObit Uninstaller helps you remove unwanted programs, Windows apps, and browser plug-ins/toolbars entirely even when Windows "Add or Remove Programs" fails. Video tutorial available.
1008. [IObit/IObit Unlocker](https://www.majorgeeks.com/mg/getmirror/iobit_unlocker,1.html) IObit Unlocker can help if you are trying to delete a file or folder and see messages similar to "Cannot delete file: Access is denied" or "Cannot delete folder." Also available in a portable version.
1009. [IObit/Protected Folder](https://www.majorgeeks.com/mg/getmirror/iobit_protected_folder,1.html) Protected Folder is a folder/file locker which protects user's privacy and important data from theft, loss or leaks. Video tutorial available.
1010. [IObit/Random Password Generator](https://www.majorgeeks.com/mg/getmirror/random_password_generator,1.html) Random Password Generator is designed to create a much securer environment for either important data storage or privacy protection.
1011. [IObit/Smart Defrag](https://www.majorgeeks.com/mg/getmirror/iobit_smartdefrag,1.html) Smart Defrag can defragment files, folder, and entire drives as needed or scheduled. It also features SSD trimming to prolong your SDD performance and life. Video walkthrough available. Also part of Advanced SystemCare Free.
1012. [IObit/Start Menu 8](https://www.majorgeeks.com/mg/getmirror/start_menu_8,1.html) Start Menu 8 is for users who don't like the start screen in Windows 8 & Windows 10. You can bring back both the classic Start button and Start Menu and customize it any way you like.
1013. [IObit/WinMetro](https://www.majorgeeks.com/mg/getmirror/winmetro,1.html) WinMetro is specially designed to bring the Windows 8 Metro UI to Windows 7, Windows Vista and Windows XP.
1014. [iPhotoDraw](http://www.iphotodraw.com/)
1015. [IP雷达](http://www.ipneed.com/main/download.html)
1016. [IrfanView](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Viewers/IrfanView.shtml) With support for a long list of plugins, this minimalistic utility helps you view images, as well as edit and convert them using a built-in batch mode
1017. [Iris](https://github.com/danielng01/Iris-Builds/tree/master/Windows) [Free Personal] :eyes: Builds for Iris. Contribute to danielng01/Iris-Builds development by creating an account on GitHub.
1018. [IronScanner](https://download.openpaper.work/windows/amd64/)
1019. [irreader](http://irreader.fatecore.com/)
1020. [ISx](https://github.com/lifenjoiner/ISx/releases/latest) [6/25/9] ISx is an InstallShield installer extractor.
1021. [itSamples/Advanced Privacy Cleaner Bar](http://www.itsamples.com/advanced-privacy-cleaner.html)
1022. [itSamples/Asterisk Master](http://www.itsamples.com/asterisk-master.html)
1023. [itSamples/Becky! Internet Mail Password Recovery Tool](http://www.itsamples.com/becky-password-recovery.html)
1024. [itSamples/CapsUnlocker](http://www.itsamples.com/caps-unlocker.html)
1025. [itSamples/Color Logo Maker](http://www.itsamples.com/color-logo-maker.html)
1026. [itSamples/Dialup Password Recovery Tool](http://www.itsamples.com/dialup-password-recovery.html)
1027. [itSamples/Disk Activity Indicator](http://www.itsamples.com/disk-activity-indicator.html)
1028. [itSamples/Eudora Password Recovery Tool](http://www.itsamples.com/eudora-password-recovery.html)
1029. [itSamples/EXIF Date Changer](http://www.itsamples.com/exif-date-changer.html)
1030. [itSamples/Firefox Password Recovery Tool](http://www.itsamples.com/firefox-password-recovery.html)
1031. [itSamples/Flash & Pictures Switcher](http://www.itsamples.com/flash-pictures-switcher.html)
1032. [itSamples/Google Chrome Password Recovery Tool](http://www.itsamples.com/google-chrome-password-recovery.html)
1033. [itSamples/Google Talk Password Recovery Tool](http://www.itsamples.com/google-talk-password-recovery.html)
1034. [itSamples/HDD Informer](http://www.itsamples.com/hdd-informer.html)
1035. [itSamples/Host](http://www.itsamples.com/host.html)
1036. [itSamples/HPI Converter](http://www.itsamples.com/hpi-converter.html)
1037. [itSamples/IE History Monitor](http://www.itsamples.com/ie-history-monitor.html)
1038. [itSamples/IE Screenshot](http://www.itsamples.com/ie-screenshot.html)
1039. [itSamples/Link Encoder](http://www.itsamples.com/link-encoder.html)
1040. [itSamples/MSN & Windows Live Recovery Tool](http://www.itsamples.com/msn-windows-live-recovery.html)
1041. [itSamples/Network Activity Indicator for Windows 7](http://www.itsamples.com/network-activity-indicator.html)
1042. [itSamples/Network Lights](http://www.itsamples.com/network-lights.html)
1043. [itSamples/Notification Area Cleaner for Windows 7](http://www.itsamples.com/notification-area-cleaner.html)
1044. [itSamples/Opera Password Recovery Tool](http://www.itsamples.com/opera-password-recovery.html)
1045. [itSamples/Outlook Express Password Recovery Tool](http://www.itsamples.com/outlook-express-password-recovery.html)
1046. [itSamples/Password Viewer](http://www.itsamples.com/password-viewer.html)
1047. [itSamples/Ping Terminal](http://www.itsamples.com/ping-terminal.html)
1048. [itSamples/PocoMail Password Recovery Tool](http://www.itsamples.com/pocomail-password-recovery.html)
1049. [itSamples/Protected Storage Viewer](http://www.itsamples.com/protected-storage-viewer.html)
1050. [itSamples/QR Coder for Internet Explorer](http://www.itsamples.com/qr-coder-ie.html)
1051. [itSamples/RDP Password Recovery Tool](http://www.itsamples.com/rdp-password-recovery.html)
1052. [itSamples/StatusBar Progress for Internet Explorer 11](http://www.itsamples.com/statusbar-progress-ie11.html)
1053. [itSamples/System Files Lister](http://www.itsamples.com/system-files-lister.html)
1054. [itSamples/TaskBar Hider](http://www.itsamples.com/taskbar-hider.html)
1055. [itSamples/TCP Monitor](http://www.itsamples.com/tcp-monitor.html)
1056. [itSamples/The Bat Password Recovery Tool](http://www.itsamples.com/the-bat-password-recovery.html)
1057. [itSamples/Thumbnail Database Cleaner](http://www.itsamples.com/thumbnail-database-cleaner.html)
1058. [itSamples/Thumbnail Database Viewer](http://www.itsamples.com/thumbnail-database-viewer.html)
1059. [itSamples/Time Synchronizer](http://www.itsamples.com/time-synchronizer.html)
1060. [itSamples/Total Commander Password Recovery Tool](http://www.itsamples.com/total-commander-password-recovery.html)
1061. [itSamples/Trillian Password Recovery Tool](http://www.itsamples.com/trillian-password-recovery.html)
1062. [itSamples/WebTricks](http://www.itsamples.com/webtricks.html)
1063. [itSamples/Window Minimizer](http://www.itsamples.com/window-minimizer.html)
1064. [itSamples/Windows Service Master](http://www.itsamples.com/windows-service-master.html)
1065. [iTunes](https://www.softpedia.com/get/IPOD-TOOLS/Other-IPOD-tools-Updates/iTunes.shtml) Enables you to manage contents such as music, movies, TV shows and apps on your iOS devices with no more than a few mouse clicks
1066. [JabRef](https://github.com/JabRef/jabref/releases/latest) [96/1,310/913] Graphical Java application for managing BibTeX and biblatex (.bib) databases
1067. [JAM Software/Exchange Server Toolbox](https://www.jam-software.com/exchange_server_toolbox/) :money_with_wings: The Exchange Server Toolbox enhances the Exchange Server with important security features like spam filter, virus scanner, email backup and a set of rules
1068. [JAM Software/FileList](https://www.jam-software.com/filelist/) Filelist - Command line application for generating lists of files in CSV format
1069. [JAM Software/HeavyLoad](https://www.jam-software.com/heavyload/) HeavyLoad - Benchmark tool for a stress test on your PC
1070. [JAM Software/ServerSentinel](https://www.jam-software.com/serversentinel/) :money_with_wings: ServerSentinel is a network monitoring software. It enables the user to query parameters of distributed computing facilities and to measure latency times while performing service requests.
1071. [JAM Software/ShellBrowser .NET Components](https://www.jam-software.com/shellbrowser_net/) :money_with_wings: The ShellBrowser .NET Controls set gives a programmer easy access to the Windows Shell functionality.
1072. [JAM Software/ShellBrowser Delphi Components](https://www.jam-software.com/shellbrowser_delphi/) :money_with_wings: The ShellBrowser component set gives a Delphi programmer easy access to the Windows Shell functionality.
1073. [JAM Software/ShellBrowser WPF Components](https://www.jam-software.com/shellbrowser_wpf/) :money_with_wings: The ShellBrowser WPF Controls set grants a programmer easy access to the Windows Shell functionality.
1074. [JAM Software/SmartCallMonitor Free](https://www.jam-software.com/smartcallmonitor_free/) Phone monitoring software for TAPI capable hardware: SmartCallMonitor
1075. [JAM Software/SmartCallMonitor Professional](https://www.jam-software.com/smartcallmonitor/) :money_with_wings: Phone monitoring software for TAPI capable hardware: SmartCallMonitor
1076. [JAM Software/SmartPOP2Exchange](https://www.jam-software.com/smartpop2exchange/) :money_with_wings: Download emails from POP3 and IMAP accounts with SmartPOP2Exchange and send emails to Exchange and SMTP servers - spam and virus protection included
1077. [JAM Software/SmartSerialMail Free](https://www.jam-software.com/smartserialmail_free/) SmartSerialMail enables you to send emails automatically to a large number of recipients.
1078. [JAM Software/SmartSerialMail](https://www.jam-software.com/smartserialmail/) :money_with_wings: SmartSerialMail enables you to send emails automatically to a large number of recipients.
1079. [JAM Software/SpaceObServer Remote Client](https://www.jam-software.com/remoteclient/) :money_with_wings: Access SpaceObServer scans in your web browser with the SpaceObServer Web Access.
1080. [JAM Software/SpaceObServer Web Access](https://www.jam-software.com/webaccess/) Access SpaceObServer scans in your web browser with the SpaceObServer Web Access.
1081. [JAM Software/SpaceObServer](https://www.jam-software.com/spaceobserver/) :money_with_wings: SpaceObServer is a hard disk space manager for Windows that stores disk usage information in an SQL database.
1082. [JAM Software/SpamAssassin for Windows](https://www.jam-software.com/spamassassin/) SpamAssassin was ported for Windows by JAM Software. In combination with an MTA (e.g. Hamster or MS Exchange) it's a very powerful anti-spam solution.
1083. [JAM Software/SpamAssassin in a Box](https://www.jam-software.com/spamassassin_in_a_box/) :money_with_wings: SpamAssassin in a Box includes SpamAssassin and a Windows service which can control the spam filter.
1084. [JAM Software/TreeSize Free](https://www.jam-software.com/treesize_free/) TreeSize Free is a free disk space manager for Windows. The software shows you the sizes of folders including all subfolders.
1085. [JAM Software/TreeSize Personal](https://www.jam-software.com/treesize_personal/) :money_with_wings: TreeSize Personal is a powerful and flexible hard disk space manager for Windows 200X/XP/Vista/7 with customizable file search and several exporting possibilities.
1086. [JAM Software/TreeSize Professional](https://www.jam-software.com/treesize/) :money_with_wings: TreeSize Professional is a hard disk space manager for Windows with customizable file search and several exporting and reporting possibilities.
1087. [JAM Software/UltraSearch](https://www.jam-software.com/ultrasearch/) UltraSearch searches files on local NTFS drives. The freeware provides the results within just a few seconds.
1088. [JAM Software/Virtual Treeview](https://www.jam-software.com/virtual-treeview/) Virtual Treeview
1089. [James](https://github.com/james-proxy/james/releases/latest) [42/1,058/95] Web Debugging Proxy Application.
1090. [jasper](https://github.com/jasperapp/jasper/releases/latest) [30/1,012/47] Jasper - A flexible and powerful issue reader for GitHub
1091. [Java](https://java.com/en/download/manual.jsp)
1092. [JetBrains/CLion](https://data.services.jetbrains.com/products/releases?code=CL&latest=true) :money_with_wings:
1093. [JetBrains/DataGrip](https://data.services.jetbrains.com/products/releases?code=DG&latest=true) :money_with_wings:
1094. [JetBrains/dotCover](https://data.services.jetbrains.com/products/releases?code=DC&latest=true) :money_with_wings:
1095. [JetBrains/dotMemory](https://data.services.jetbrains.com/products/releases?code=DM&latest=true) :money_with_wings:
1096. [JetBrains/dotPeek](https://data.services.jetbrains.com/products/releases?code=DPK&latest=true) :money_with_wings:
1097. [JetBrains/dotTrace](https://data.services.jetbrains.com/products/releases?code=DP&latest=true) :money_with_wings:
1098. [JetBrains/GoLand](https://data.services.jetbrains.com/products/releases?code=GO&latest=true) :money_with_wings:
1099. [JetBrains/Hub](https://data.services.jetbrains.com/products/releases?code=HB&latest=true) :money_with_wings:
1100. [JetBrains/IntelliJ IDEA Community](https://data.services.jetbrains.com/products/releases?code=IIC&latest=true)
1101. [JetBrains/IntelliJ IDEA Ultimate](https://data.services.jetbrains.com/products/releases?code=IIU&latest=true) :money_with_wings:
1102. [JetBrains/MPS](https://data.services.jetbrains.com/products/releases?code=MPS&latest=true) :money_with_wings:
1103. [JetBrains/PhpStorm](https://data.services.jetbrains.com/products/releases?code=PS&latest=true) :money_with_wings:
1104. [JetBrains/PyCharm Community](https://data.services.jetbrains.com/products/releases?code=PCC&latest=true)
1105. [JetBrains/PyCharm Edu](https://data.services.jetbrains.com/products/releases?code=PCE&latest=true)
1106. [JetBrains/PyCharm Professional](https://data.services.jetbrains.com/products/releases?code=PCP&latest=true) :money_with_wings:
1107. [JetBrains/ReSharper C++](https://data.services.jetbrains.com/products/releases?code=RC&latest=true) :money_with_wings:
1108. [JetBrains/ReSharper](https://data.services.jetbrains.com/products/releases?code=RS&latest=true) :money_with_wings:
1109. [JetBrains/ReSharperCommandLineTools](https://data.services.jetbrains.com/products/releases?code=RSCLT&latest=true) :money_with_wings:
1110. [JetBrains/ReSharperUltimate](https://data.services.jetbrains.com/products/releases?code=RSU&latest=true) :money_with_wings:
1111. [JetBrains/Rider](https://data.services.jetbrains.com/products/releases?code=RD&latest=true) :money_with_wings:
1112. [JetBrains/RubyMine](https://data.services.jetbrains.com/products/releases?code=RM&latest=true) :money_with_wings:
1113. [JetBrains/TeamCity](https://data.services.jetbrains.com/products/releases?code=TC&latest=true) :money_with_wings:
1114. [JetBrains/Toolbox App](https://data.services.jetbrains.com/products/releases?code=TBA&latest=true)
1115. [JetBrains/Upsource](https://data.services.jetbrains.com/products/releases?code=US&latest=true) :money_with_wings:
1116. [JetBrains/WebStorm](https://data.services.jetbrains.com/products/releases?code=WS&latest=true) :money_with_wings:
1117. [JiJiDownForWPF](http://l.acesheep.com/bili/re.php?callback=?)
1118. [JoclyBoard](https://github.com/mi-g/joclyboard/releases/latest) [4/20/6] Multiplatform 3D/2D desktop application for playing board games
1119. [Joplin](https://github.com/laurent22/joplin/releases/latest) [233/7,434/595] Joplin - a note taking and to-do application with synchronization capabilities for Windows, macOS, Linux, Android and iOS. Forum: https://discourse.joplinapp.org/
1120. [JoyToKey](https://joytokey.net/en/news) :money_with_wings:
1121. [JPEGView](https://sourceforge.net/projects/jpegview/files/jpegview/) Lean and fast image viewer with minimal GUI
1122. [JumpFm](https://github.com/JumpFm/jumpfm/releases/latest) [12/207/22] A file manager that lets you jump.
1123. [K-Lite Codec Pack](https://www.majorgeeks.com/mg/getmirror/k_lite_codec_pack_standard,1.html) K-Lite Codec Pack is a collection of components needed for audio and video playback in DirectShow players such as Windows Media Player, Media Center, and Media Player Classic. Basic, Standard, Full, Mega as well as the latest update.
1124. [Kakapo](https://github.com/bluedaniel/Kakapo-app/releases/latest) [17/354/31] :musical_note: [Web & Desktop] An open source ambient sound mixer
1125. [Kaku](https://github.com/EragonJ/Kaku/releases/latest) [60/942/107] 🎧 Kaku is a highly integrated music player supports different online platform like YouTube, SoundCloud, Vimeo and more. Available on Mac, Windows and Linux.
1126. [Kalkules](https://www.kalkules.com/download/)
1127. [KaplanSoft/ARPMiner](https://www.kaplansoft.com/download.html)
1128. [KaplanSoft/DBConverter](https://www.kaplansoft.com/download.html)
1129. [KaplanSoft/ENUM Resolver](https://www.kaplansoft.com/download.html)
1130. [KaplanSoft/SipCLI](https://www.kaplansoft.com/download.html)
1131. [KaplanSoft/SIPob](https://www.kaplansoft.com/download.html)
1132. [KaplanSoft/SMPPCli](https://www.kaplansoft.com/download.html)
1133. [KaplanSoft/Tekaba](https://www.kaplansoft.com/download.html)
1134. [KaplanSoft/TekCERT](https://www.kaplansoft.com/download.html)
1135. [KaplanSoft/TekConSer](https://www.kaplansoft.com/download.html)
1136. [KaplanSoft/TekENUM](https://www.kaplansoft.com/download.html)
1137. [KaplanSoft/TekFax](https://www.kaplansoft.com/download.html)
1138. [KaplanSoft/TekIVR](https://www.kaplansoft.com/download.html)
1139. [KaplanSoft/TekOTP](https://www.kaplansoft.com/download.html)
1140. [KaplanSoft/TekPhone](https://www.kaplansoft.com/download.html)
1141. [KaplanSoft/TekRADIUS LT](https://www.kaplansoft.com/download.html)
1142. [KaplanSoft/TekRADIUS](https://www.kaplansoft.com/download.html)
1143. [KaplanSoft/TekRecorder](https://www.kaplansoft.com/download.html)
1144. [KaplanSoft/TekSIP Route Server](https://www.kaplansoft.com/download.html)
1145. [KaplanSoft/TekSIP](https://www.kaplansoft.com/download.html)
1146. [KaplanSoft/TekSMTP](https://www.kaplansoft.com/download.html)
1147. [KaplanSoft/TekTape](https://www.kaplansoft.com/download.html)
1148. [KaplanSoft/TekWiFi](https://www.kaplansoft.com/download.html)
1149. [KaplanSoft/TelCLI](https://www.kaplansoft.com/download.html)
1150. [KaplanSoft/WebKilit](https://www.kaplansoft.com/download.html)
1151. [KC Softwares/ApHeMo](https://www.kcsoftwares.com/?download) :money_with_wings:
1152. [KC Softwares/Audiograil](https://www.kcsoftwares.com/?download) :money_with_wings:
1153. [KC Softwares/AVIToolbox](https://www.kcsoftwares.com/?download) :money_with_wings:
1154. [KC Softwares/BATExpert](https://www.kcsoftwares.com/?download)
1155. [KC Softwares/dot11Expert](https://www.kcsoftwares.com/?download) :money_with_wings:
1156. [KC Softwares/DUMo](https://www.kcsoftwares.com/?download) :money_with_wings:
1157. [KC Softwares/HDDExpert](https://www.kcsoftwares.com/?download)
1158. [KC Softwares/IDPhotoStudio](https://www.kcsoftwares.com/?download)
1159. [KC Softwares/Ignition](https://www.kcsoftwares.com/?download)
1160. [KC Softwares/K-ML](https://www.kcsoftwares.com/?download) :money_with_wings:
1161. [KC Softwares/KCleaner](https://www.kcsoftwares.com/?download) [Free Personal]
1162. [KC Softwares/KFK](https://www.kcsoftwares.com/?download)
1163. [KC Softwares/MassCert](https://www.kcsoftwares.com/?download)
1164. [KC Softwares/PhotoToFilm](https://www.kcsoftwares.com/?download) :money_with_wings:
1165. [KC Softwares/PortExpert](https://www.kcsoftwares.com/?download)
1166. [KC Softwares/RAMExpert](https://www.kcsoftwares.com/?download)
1167. [KC Softwares/Startup Sentinel](https://www.kcsoftwares.com/?download)
1168. [KC Softwares/SUMo](https://www.kcsoftwares.com/?download) [Free Personal]
1169. [KC Softwares/Vampix](https://www.kcsoftwares.com/?download)
1170. [KC Softwares/VideoInspector](https://www.kcsoftwares.com/?download)
1171. [KC Softwares/Zer0](https://www.kcsoftwares.com/?download)
1172. [KDE/Amarok](https://community.kde.org/Amarok/GettingStarted/Download/Windows)
1173. [KDE/digiKam](https://mirrors.shu.edu.cn/kde/ftp/stable/digikam/?C=N&O=D)
1174. [KDE/Falkon](https://www.falkon.org/)
1175. [KDE/Kate](https://mirrors.shu.edu.cn/kde/ftp/stable/kate/?C=N&O=D)
1176. [KDE/KDevelop](https://www.kdevelop.org/download)
1177. [KDE/KDiff3](https://sourceforge.net/projects/kdiff3/files/kdiff3/) A graphical text difference analyzer
1178. [KDE/KEXI](https://mirrors.shu.edu.cn/kde/ftp/stable/kexi/win64/)
1179. [KDE/KMyMoney](https://mirrors.shu.edu.cn/kde/ftp/stable/kmymoney/latest/win64/)
1180. [KDE/Krita](https://krita.org/en/download/krita-desktop/)
1181. [KDE/Marble](https://marble.kde.org/install.php)
1182. [KDE/Mover-Sizer](https://www.softpedia.com/get/System/OS-Enhancements/KDE-Mover-Sizer.shtml) Move windows from any mouse cursor position, accurately resize and snap to display borders using simple hotkeys thanks to this lightweight but practical enhancement
1183. [KDE/Umbrello](https://mirrors.shu.edu.cn/kde/ftp/stable/umbrello/latest/win64/)
1184. [KeePass](https://keepass.info/download.html)
1185. [KeePassXC](https://github.com/keepassxreboot/keepassxc/releases/latest) [218/5,563/422] KeePassXC is a cross-platform community-driven port of the Windows application “Keepass Password Safe”.
1186. [Keepmark](https://www.softpedia.com/get/PORTABLE-SOFTWARE/System/File-management/Keepmark.shtml) Keep order and stay organized with your documents and files thanks to the help of this capable repository manager that offers increased customization
1187. [KeeWeb](https://github.com/keeweb/keeweb/releases/latest) [253/7,555/633] Free cross-platform password manager compatible with KeePass
1188. [KeyNote NF](https://github.com/dpradov/keynote-nf/releases/latest) [28/135/43] Tabbed notebook with RichText editor, multi-level notes and strong encryption.
1189. [Keypirinha](https://github.com/Keypirinha/Keypirinha/releases/latest) [26/417/10] A fast keystroke launcher for Windows.
1190. [KindleHelper](https://github.com/qq573011406/KindleHelper/releases/latest) [26/391/100] 全网小说搜索,下载.可自动生成mobi格式小说.
1191. [KingSoft/TypeEasy](http://www.51dzt.com/)
1192. [KingSoft/WPS](http://pc.wps.cn/)
1193. [KingSoft/WPSPDF](http://wpspdf.cn/)
1194. [Kinza](https://www.kinza.jp/en/download/thankyou/windows_x64/)
1195. [Kitematic](https://github.com/docker/kitematic/releases/latest) [370/10,284/1,225] Visual Docker Container Management on Mac & Windows
1196. [KiTTY](https://www.softpedia.com/get/Network-Tools/Telnet-SSH-Clients/9bis-KiTTY.shtml) This application is a fork from version 0.67 of the PuTTY SSH/ Telnet client, providing users with additional features and important enhancements
1197. [KMPlayer](https://www.majorgeeks.com/mg/getmirror/kmplayer,1.html) KMPlayer is a full-featured movie and audio player that supports a wide range of codecs and file formats.
1198. [Kodi](https://kodi.tv/download/849)
1199. [Koko](https://github.com/KokoIRC/koko/releases/latest) [9/307/28] Yet another IRC client for me and you :koko:.
1200. [Koofr](https://koofr.eu/desktop-apps/) [Free Personal]
1201. [Koromo Copy](https://github.com/dc-koromo/koromo-copy/releases/latest) [3/29/2] WPF-based downloader, file-manager program that implements Hitomi Downloader as main function
1202. [LabelPlus](https://github.com/LabelPlus/LabelPlus/releases/latest) [5/38/3] Easy tool for comic translation.
1203. [Lantern](https://www.softpedia.com/get/Internet/Servers/Proxy-Servers/Lantern.shtml) :airplane: Get access to restricted or unavailable websites from anywhere across the world with the help of this efficient tool that can change your IP address
1204. [Last.fm Scrobbler](https://www.last.fm/about/trackmymusic)
1205. [launch4j](https://sourceforge.net/projects/launch4j/files/launch4j-3/) Cross-platform Java executable wrapper for creating lightweight Windows native EXEs. Provides advanced JRE search, application startup configuration…
1206. [LC-Finder](https://github.com/lc-soft/LC-Finder/releases/latest) [17/139/26] An image annotation and object detection tool written in C
1207. [Leanote](http://app.leanote.com/) [Free Personal]
1208. [Lepton](https://github.com/hackjutsu/Lepton/releases/latest) [157/5,611/271] 💻    Democratizing Snippet Management (macOS/Win/Linux)
1209. [LibreCAD](https://github.com/LibreCAD/LibreCAD/releases/latest) [155/1,254/482] LibreCAD is a cross-platform 2D CAD program written in C++11 using the Qt framework. It can read DXF and DWG files and can write DXF, PDF and SVG files. The user interface is highly customizable, and has dozens of translations.
1210. [LibreOffice](https://www.libreoffice.org/download/download/) :airplane:
1211. [LICEcap](https://www.cockos.com/licecap/)
1212. [Light Alloy](http://light-alloy.verona.im/download/)
1213. [lightGallery](https://github.com/sachinchoolur/lightgallery-desktop/releases/latest) [27/872/71] A modern, electron and nodejs based image viewer for Mac, Windows and Linux.
1214. [lightsocks](https://github.com/gwuhaolin/lightsocks/releases/latest) [141/2,546/577] ⚡️一个轻巧的网络混淆代理🌏.
1215. [LightTable](https://github.com/LightTable/LightTable/releases/latest) [474/10,607/900] The Light Table IDE ⛺.
1216. [LimeChat](http://limechat.net/)
1217. [lintalist](https://github.com/lintalist/lintalist/releases/latest) [11/76/15] Searchable interactive texts to copy & paste text, run scripts, using easily exchangeable bundles
1218. [LinuxLive USB Creator](http://www.linuxliveusb.com/en/download)
1219. [Lisk Hub](https://github.com/LiskHQ/lisk-hub/releases/latest) [35/563/52] 🖥 Lisk graphical user interface for desktop.
1220. [Listary](https://www.listary.com/download) [Free Personal]
1221. [Listen1](https://github.com/listen1/listen1_desktop/releases/latest) [71/1,352/311] one for all free music in china (Windows, Mac, Linux desktop)
1222. [LMMS](https://github.com/LMMS/lmms/releases/latest) [219/2,765/484] Cross-platform music production software.
1223. [Locale-Emulator](https://github.com/xupefei/Locale-Emulator/releases/latest) [233/3,498/326] Yet Another System Region and Language Simulator.
1224. [LogMeIn Hamachi](https://www.softpedia.com/get/Internet/File-Sharing/Hamachi.shtml) Networking app which enables computers connected to the Internet to talk directly to each other as a part of the same, secure virtual network
1225. [Loop Drop](https://github.com/mmckegg/loop-drop-app/releases/latest) [32/746/80] MIDI looper, modular synth and sampler app built using Web Audio and Web MIDI APIs
1226. [LopeSoft/FileMenu Tools](https://www.lopesoft.com/index.php/en/filemenutools/download) :money_with_wings:
1227. [LopeSoft/LopeEdit](https://www.lopesoft.com/index.php/en/lopeedit/download) :money_with_wings:
1228. [LosslessCut](https://github.com/mifi/lossless-cut/releases/latest) [93/2,245/142] Save space by quickly and losslessly trimming video and audio files
1229. [Lua for Windows](https://github.com/rjpcomputing/luaforwindows/releases/latest) [130/1,119/231] Lua for Windows is a 'batteries included environment' for the Lua scripting language on Windows. NOTICE: Looking for maintainer.
1230. [LuaBinaries](https://sourceforge.net/projects/luabinaries/files/) LuaBinaries is a distribution of the Lua libraries and executables compiled for several platforms.
1231. [Luna](https://github.com/rvpanoz/luna/releases/latest) [16/696/31] npm management through a modern UI. Created with ReactJS and Redux, Material-UI. Bundled with Webpack. Build on Electron.
1232. [lynx](https://lynx.invisible-island.net/release/breakout/CHANGES)
1233. [Macro Creator](https://github.com/Pulover/PuloversMacroCreator/releases//latest) [42/459/85] Automation Utility - Recorder & Script Generator.
1234. [MadVR](http://madvr.com/)
1235. [Mahou](https://github.com/BladeMight/Mahou/releases/latest) [21/199/27] Mahou(魔法) - The magic layout switcher.
1236. [Mailspring](https://github.com/Foundry376/Mailspring/releases/latest) [150/6,208/382] :love_letter: A beautiful, fast and maintained fork of @Nylas Mail by one of the original authors.
1237. [MakeMKV](http://makemkv.com/download/)
1238. [MAME](https://github.com/mamedev/mame/releases/latest) [311/3,727/904] MAME.
1239. [Mancy](https://github.com/princejwesley/Mancy/releases/latest) [62/2,625/158]  >_ Electron based NodeJS REPL :see_no_evil:.
1240. [MangaRipper](https://github.com/NguyenDanPhuong/MangaRipper/releases/latest) [37/119/37] This software helps you download manga (Japanese Comic) from several websites for your offline viewing.
1241. [Manta](https://github.com/hql287/Manta/releases/latest) [101/4,456/309] 🎉 Flexible invoicing desktop app with beautiful & customizable templates.
1242. [Markdown Edit](https://github.com/mike-ward/Markdown-Edit/releases/latest) [44/654/121] My attempt at a markdown editor for windows.
1243. [Markn](https://github.com/minodisk/markn/releases/latest) [2/132/4] Lightweight markdown viewer.
1244. [MarkRight](https://github.com/dvcrn/markright/releases/latest) [25/911/58] ➡ Electron powered markdown editor with live preview
1245. [MarkText](https://github.com/marktext/marktext/releases/latest) [195/10,118/686] 📝A simple and elegant markdown editor, available for Linux, macOS and Windows.
1246. [Marky](https://github.com/vesparny/marky/releases/latest) [11/348/41] A markdown editor built with Electron and React.
1247. [MassTube](http://www.havysoft.cl/descargar.html) [Free Personal]
1248. [Materialette](https://github.com/mike-schultz/materialette/releases/latest) [32/1,037/61] Materialette - A material design color palette.
1249. [MathType](https://docs.wiris.com/en/mathtype/release_notes/start) :money_with_wings:
1250. [Mattermost](https://github.com/mattermost/desktop/releases/latest) [76/920/338] Mattermost Desktop application for Windows, Mac and Linux
1251. [Maxthon](http://www.maxthon.cn/mx5/changelog/)
1252. [MaxTo](https://maxto.net/)
1253. [Mcool](https://www.softpedia.com/get/Multimedia/Audio/Audio-Players/Mcool.shtml) This straightforward music player offers you the possibility to create multiple playlists, then easily listen to your favorite songs
1254. [MediaInfo](https://mediaarea.net/en/MediaInfo/Download/Windows)
1255. [MEGAcmd](https://raw.githubusercontent.com/meganz/MEGAcmd/master/build/megacmd/megacmd.changes)
1256. [megacmd@t3rm1n4l](https://github.com/t3rm1n4l/megacmd/releases/latest) [46/418/71] A command-line client for mega.co.nz storage service
1257. [MegaDownloader](https://www.softpedia.com/get/Internet/Download-Managers/MegaDownloader.shtml) Grab or retrieve files from MEGA links and enjoy videos online even without a browser installed using this straightforward application
1258. [Megatools](https://megatools.megous.com/)
1259. [MeGUI](https://sourceforge.net/projects/megui/files/megui-stable/) MeGUI is the most comprehensive GUI based ISO MPEG-4 solution. It suports MPEG-4 ASP (xvid), MPEG-4 AVC (x264), AAC, MP2, MP3, Flac, Vorbis, AC3…
1260. [Meld](http://meldmerge.org/)
1261. [MemReduct](https://github.com/henrypp/memreduct/releases/latest) [49/459/101] Lightweight real-time memory management application to monitor and clean system memory on your computer.
1262. [Mendeley](https://www.mendeley.com/release-notes) [Free Personal]
1263. [Mercurial](https://www.mercurial-scm.org/wiki/Download)
1264. [Messenger](https://github.com/aluxian/Messenger-for-Desktop/releases/latest) [119/2,158/296] This is not an official Facebook product, and is not affiliated with, or sponsored or endorsed by, Facebook.
1265. [michael/AllDup](http://www.alldup.de/download_alldup.php)
1266. [michael/AllSync](http://www.alldup.de/download.php)
1267. [Microsoft OneDrive](https://support.office.com/en-us/article/onedrive-release-notes-845dcf18-f921-435e-bf28-4e24b95e5fc0?ui=en-US&rs=en-US&ad=US) :pushpin:
1268. [Microsoft OneNote](https://www.softpedia.com/get/Office-tools/Other-Office-Tools/Microsoft-OneNote.shtml) :pushpin: Collect your information in one easy-to-find place, gather all sorts of data, organize them your own way, and share them with others with just a click
1269. [Midnight Commander](https://sourceforge.net/projects/mcwin32/files/) Native Midnight Commander 4.8.21 for Windows/Win32
1270. [MiKTeX](https://miktex.org/download)
1271. [Min](https://github.com/minbrowser/min/releases/latest) [100/2,957/279] A fast, minimal browser that protects your privacy
1272. [MindGems/Audio Dedupe](https://www.mindgems.com/products/Duplicate-MP3-Finder/Audio-Dedupe-Download.htm) :money_with_wings:
1273. [MindGems/Boss Key](https://www.mindgems.com/products/Boss-Key/boss-key-download.htm) :money_with_wings:
1274. [MindGems/Easy Screen Capture And Annotation ](https://www.mindgems.com/products/Easy-Screen-Capture-AA/ESCAA-Download.htm) :money_with_wings:
1275. [MindGems/Easy Web Gallery Builder](https://www.mindgems.com/products/Easy-Web-Gallery-Builder/Easy_Web_Gallery_Builder-Download.htm) :money_with_wings:
1276. [MindGems/Fast Duplicate File Finder](https://www.mindgems.com/products/Fast-Duplicate-File-Finder/Fast-Duplicate-File-Finder-Download.htm)
1277. [MindGems/Folder Size](https://www.mindgems.com/products/Folder-Size/Folder-Size-Download.htm)
1278. [MindGems/Visual Similarity Duplicate Image Finder](https://www.mindgems.com/products/VS-Duplicate-Image-Finder/VSDIF-Download.htm) :money_with_wings:
1279. [MinGit](https://github.com/git-for-windows/git/releases/latest) [449/4,360/15,729] A fork of Git containing Windows-specific patches.
1280. [MinGW-w64](https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/) A complete runtime environment for gcc
1281. [MiniTool Partition Wizard](https://www.partitionwizard.com/upgrade-history.html) [Free Personal]
1282. [MiniTool Power Data Recovery](https://www.minitool.com/data-recovery-software/upgrade-history.html) [Free Personal]
1283. [MiniTool ShadowMaker](https://www.minitool.com/backup/upgrade-history.html) [Free Personal]
1284. [Miranda IM](https://www.miranda-ng.org/distr/stable/)
1285. [mIRC](https://www.mirc.com/get.html)
1286. [Mirillis/Action](https://mirillis.com/download-action)
1287. [Mirillis/Monflo](https://monflo.mirillis.com/download/thank-you?file=monflopc) :money_with_wings:
1288. [Mirillis/Splash](https://mirillis.com/download-splash-free-hd-video-player)
1289. [mirinsoft/Cleanmgr](http://www.mirinsoft.com/cleanmgrplus/summary/11-cleanmgr/50-cleanmgr)
1290. [mirinsoft/CloneApp for Universal Apps](http://www.mirinsoft.com/ua/summary/13-ca-ua/47-cloneapp-ua)
1291. [mirinsoft/CloneApp](http://www.mirinsoft.com/ca/summary/2-cloneapp/19-cloneapp)
1292. [Mist Browser](https://github.com/ethereum/mist/releases/latest) [757/7,262/1,863] [DEPRECATED] Mist. Browse and use Ðapps on the Ethereum network.
1293. [MiTec/ADO Query](http://www.mitec.cz/index.html) :money_with_wings:
1294. [MiTec/DFM Editor](http://www.mitec.cz/index.html)
1295. [MiTec/DirList](http://www.mitec.cz/index.html)
1296. [MiTec/E-mail History Browser](http://www.mitec.cz/index.html) :money_with_wings:
1297. [MiTec/EXE Explorer](http://www.mitec.cz/index.html)
1298. [MiTec/HexEdit](http://www.mitec.cz/index.html)
1299. [MiTec/Icon Explorer](http://www.mitec.cz/index.html)
1300. [MiTec/InfoBar](http://www.mitec.cz/index.html)
1301. [MiTec/Instant Messaging History Browser](http://www.mitec.cz/index.html) :money_with_wings:
1302. [MiTec/Internet History Browser](http://www.mitec.cz/index.html) :money_with_wings:
1303. [MiTec/JSON Viewer](http://www.mitec.cz/index.html)
1304. [MiTec/Mail Checker](http://www.mitec.cz/index.html)
1305. [MiTec/Mail Viewer](http://www.mitec.cz/index.html)
1306. [MiTec/MSA Query](http://www.mitec.cz/index.html) :money_with_wings:
1307. [MiTec/Network Meter](http://www.mitec.cz/index.html)
1308. [MiTec/Network Scanner](http://www.mitec.cz/index.html)
1309. [MiTec/Paradox Data Editor](http://www.mitec.cz/index.html) :money_with_wings:
1310. [MiTec/PhotoView](http://www.mitec.cz/index.html)
1311. [MiTec/SQLite Query](http://www.mitec.cz/index.html) :money_with_wings:
1312. [MiTec/Structured Storage Viewer](http://www.mitec.cz/index.html)
1313. [MiTec/System Information X](http://www.mitec.cz/index.html)
1314. [MiTec/Task Manager DeLuxe](http://www.mitec.cz/Data/XML/data_tmxvh.xml)
1315. [MiTec/Weather Agent](http://www.mitec.cz/index.html)
1316. [MiTec/Windows File Analyzer](http://www.mitec.cz/index.html) :money_with_wings:
1317. [MiTec/Windows Registry Recovery](http://www.mitec.cz/index.html) :money_with_wings:
1318. [MiTec/XML Viewer](http://www.mitec.cz/index.html)
1319. [Mixxx](https://mixxx.org/download/)
1320. [MKVToolNix](https://mkvtoolnix.download/windows/releases/)
1321. [Mob](https://github.com/zenghongtu/Mob/releases/latest) [3/289/22] Mob - 一个基于 Electron 开发的喜马拉雅 FM 桌面客户端，支持 Mac、Win 和 Linux
1322. [MobaXterm](https://mobaxterm.mobatek.net/download-home-edition.html) [Free Personal]
1323. [Mockoon](https://github.com/255kb/mockoon/releases/latest) [28/1,157/42] Mockoon is the easiest and quickest way to run mock APIs locally. No remote deployment, no account required, open source.
1324. [Moeditor](https://github.com/Moeditor/Moeditor/releases/latest) [101/3,848/265] Your all-purpose markdown editor.
1325. [Mongotron](https://github.com/officert/mongotron/releases/latest) [71/2,526/213] Cross platform Mongo DB management.
1326. [moo0/AntiRecovery](https://www.moo0.com/software/AntiRecovery/) [Freemium]
1327. [moo0/AudioEffecter](https://www.moo0.com/software/AudioEffecter/) [Freemium]
1328. [moo0/AudioPlayer](https://www.moo0.com/software/AudioPlayer/) [Freemium]
1329. [moo0/AudioTypeConverter](https://www.moo0.com/software/AudioTypeConverter/) [Freemium]
1330. [moo0/ColorPicker](https://www.moo0.com/software/ColorPicker/) [Freemium]
1331. [moo0/ConnectionWatcher](https://www.moo0.com/software/ConnectionWatcher/) [Freemium]
1332. [moo0/DiskCleaner](https://www.moo0.com/software/DiskCleaner/) [Freemium]
1333. [moo0/FileMonitor](https://www.moo0.com/software/FileMonitor/) [Freemium]
1334. [moo0/FileShredder](https://www.moo0.com/software/FileShredder/) [Freemium]
1335. [moo0/FontViewer](https://www.moo0.com/software/FontViewer/) [Freemium]
1336. [moo0/HashCode](https://www.moo0.com/software/HashCode/) [Freemium]
1337. [moo0/ImageInColors](https://www.moo0.com/software/ImageInColors/) [Freemium]
1338. [moo0/ImageSharpener](https://www.moo0.com/software/ImageSharpener/) [Freemium]
1339. [moo0/ImageSizer](https://www.moo0.com/software/ImageSizer/) [Freemium]
1340. [moo0/ImageThumbnailer](https://www.moo0.com/software/ImageThumbnailer/) [Freemium]
1341. [moo0/ImageTypeConverter](https://www.moo0.com/software/ImageTypeConverter/) [Freemium]
1342. [moo0/ImageViewer](https://www.moo0.com/software/ImageViewer/) :money_with_wings:
1343. [moo0/Magnifier](https://www.moo0.com/software/Magnifier/) [Freemium]
1344. [moo0/Mp3InfoEditor](https://www.moo0.com/software/Mp3InfoEditor/) [Freemium]
1345. [moo0/MultiDesktop](https://www.moo0.com/software/MultiDesktop/) [Freemium]
1346. [moo0/RightClicker](https://www.moo0.com/software/RightClicker/) :money_with_wings:
1347. [moo0/ScreenShot](https://www.moo0.com/software/ScreenShot/) [Freemium]
1348. [moo0/SimpleTimer](https://www.moo0.com/software/SimpleTimer/) [Freemium]
1349. [moo0/SystemCloser](https://www.moo0.com/software/SystemCloser/) [Freemium]
1350. [moo0/SystemMonitor](https://www.moo0.com/software/SystemMonitor/) [Freemium]
1351. [moo0/TimeStamp](https://www.moo0.com/software/TimeStamp/) [Freemium]
1352. [moo0/TransparentMenu](https://www.moo0.com/software/TransparentMenu/) [Freemium]
1353. [moo0/VideoConverter](https://www.moo0.com/software/VideoConverter/) [Freemium]
1354. [moo0/VideoCutter](https://www.moo0.com/software/VideoCutter/) [Freemium]
1355. [moo0/VideoInfo](https://www.moo0.com/software/VideoInfo/) [Freemium]
1356. [moo0/VideoMinimizer](https://www.moo0.com/software/VideoMinimizer/) [Freemium]
1357. [moo0/VideoToAudio](https://www.moo0.com/software/VideoToAudio/) [Freemium]
1358. [moo0/VoiceRecorder](https://www.moo0.com/software/VoiceRecorder/) [Freemium]
1359. [moo0/WindowMenuPlus](https://www.moo0.com/software/WindowMenuPlus/) [Freemium]
1360. [moo0/WorldTime](https://www.moo0.com/software/WorldTime/) [Freemium]
1361. [moo0/XpDesktopHeap](https://www.moo0.com/software/XpDesktopHeap/) [Freemium]
1362. [Moon FM](https://moon.fm/labs)
1363. [Mosaico](http://www.soulidstudio.com/download/)
1364. [Motrix](https://github.com/agalwood/Motrix/releases) [156/9,231/890] A full-featured download manager.
1365. [Movie Catcher](https://github.com/EvilCult/moviecatcher/releases) [31/567/93] 电影美剧搜索及在线观看离线下载软件，集成热门资源站，借助百度云实现离线下载以及在线播放功能。.
1366. [Mozilla/Firefox](https://www.mozilla.org/en-US/firefox/latest/releasenotes/)
1367. [Mozilla/SeaMonkey](https://www.seamonkey-project.org/releases/)
1368. [Mozilla/Thunderbird](https://www.thunderbird.net/notes/)
1369. [Mp3tag](https://www.mp3tag.de/en/download.html)
1370. [MPC-BE](https://sourceforge.net/projects/mpcbe/files/MPC-BE/Release%20builds/) Media Player Classic - BE
1371. [MPC-HC](https://mpc-hc.org/downloads/)
1372. [MPC-QT](https://github.com/cmdrkotori/mpc-qt/releases/latest) [35/354/30] Media Player Classic Qute Theater.
1373. [MPlayer](http://oss.netfarm.it/mplayer/)
1374. [mps-youtube](https://github.com/mps-youtube/mps-youtube/releases/latest) [201/5,060/423] Terminal based YouTube player and downloader.
1375. [mpv](https://mpv.srsfckn.biz/)
1376. [mRemoteNG](https://github.com/mRemoteNG/mRemoteNG/releases) [234/3,127/583] mRemoteNG is the next generation of mRemote, open source, tabbed, multi-protocol, remote connections manager.
1377. [msys2](http://repo.msys2.org/distrib/x86_64/)
1378. [muCommander](https://github.com/mucommander/mucommander/releases/latest) [47/338/108] A lightweight, cross-platform file manager with a dual-pane interface
1379. [Mullvad](https://github.com/mullvad/mullvadvpn-app/releases/latest) [Free Personal] [23/305/23] The Mullvad VPN client app for desktop and mobile.
1380. [Multi Commander](http://www.multicommander.com/downloads)
1381. [Multrin](https://github.com/sentialx/multrin/releases/latest) [11/219/12] Organize multiple apps in tabs!
1382. [Museeks](https://github.com/martpie/museeks/releases/latest) [48/746/131] 🎵 A simple, clean and cross-platform music player.
1383. [MuseTips/MP3 Cutter and Editor](http://www.musetips.com/free-mp3-cutter-and-editor.html)
1384. [MuseTips/MP3 Ringtone Maker](http://www.musetips.com/free-mp3-ringtone-maker.html)
1385. [MuseTips/Ringtone Maker](http://www.musetips.com/free-ringtone-maker.html)
1386. [MuseTips/Text Filter](http://www.musetips.com/text-filter.html)
1387. [MuseTips/WMA Cutter and Editor](http://www.musetips.com/free-wma-cutter-and-editor.html)
1388. [Music Collection](http://www.gsoft4u.com/downloads)
1389. [music-jojo](https://github.com/liuzhuoling2011/music-jojo/releases/latest) [10/185/27] 一款基于electron-vue的高颜值音乐下载器, 让你能非常优雅的下载音乐.
1390. [MusicBee](https://www.getmusicbee.com/downloads/) [Freemium]
1391. [MusicBrainz Picard](https://picard.musicbrainz.org/downloads/)
1392. [MusicDownloadMan](http://www.pc6.com/softview/SoftView_514519.html)
1393. [MusicLake](https://github.com/sunzongzheng/music/releases/latest) [19/703/72] electron跨平台音乐播放器；可搜网易云、QQ音乐、虾米音乐；支持QQ、微博登录，云歌单; 支持一键导入音乐平台歌单
1394. [MusicPlayer2](https://github.com/zhongyang219/MusicPlayer2/releases/latest) [7/57/26] 这是一款可以播放常见音频格式的音频播放器。支持歌词显示、歌词卡拉OK样式显示、歌词在线下载、歌词编辑、歌曲标签识别、Win10小娜搜索显示歌词、频谱分析、音效设置、任务栏缩略图按钮、主题颜色等功能。 播放内核为BASS音频库(V2.4)。
1395. [My Commander](https://myco.yonan.ro/)
1396. [myBase](http://www.wjjsoft.com/download.html) :money_with_wings:
1397. [MyCard](https://cdn01.moecube.com/downloads/latest.yml)
1398. [MyCrypto](https://github.com/MyCryptoHQ/MyCrypto/releases/latest) [68/638/331] MyCrypto is an open-source, client-side tool for generating ether wallets, handling ERC-20 tokens, and interacting with the blockchain more easily.
1399. [mypaint](https://github.com/mypaint/mypaint/releases/latest) [139/1,193/203] MyPaint is a simple drawing and painting program that works well with Wacom-style graphics tablets.
1400. [Mythicsoft/Agent Ransack](https://www.mythicsoft.com/)
1401. [Mythicsoft/FileLocator Pro](https://www.mythicsoft.com/)
1402. [Nagisa](https://github.com/Project-Nagisa/Nagisa/releases/latest) [5/55/4] An open source file transfer utility on Universal Windows Platform.
1403. [nanDECK](http://www.nand.it/nandeck/)
1404. [Naotu](https://github.com/NaoTu/DesktopNaotu/releases/latest) [87/1,751/236] 桌面版脑图 (百度脑图离线版，思维导图) 跨平台支持 Windows/Linux/Mac OS. (A cross-platform multilingual Mind Map Tool)
1405. [NConvert](https://www.xnview.com/en/nconvert/) [Freemium]
1406. [ndm](https://github.com/720kb/ndm/releases/latest) [31/1,632/90] :computer: npm desktop manager https://720kb.github.io/ndm
1407. [Neard](https://github.com/neard/neard/releases/latest) [37/248/37] 🎲 Portable WAMP software stack.
1408. [NeoSmart/Easy USB Creator](https://neosmart.net/Software/Changelog/21) [Freemium]
1409. [NeoSmart/Easy Window Switcher](https://neosmart.net/Software/Changelog/26) [Freemium]
1410. [NeoSmart/EasyBCD](https://neosmart.net/Software/Changelog/1) [Freemium]
1411. [NeoSmart/iReboot](https://neosmart.net/Software/Changelog/11) [Freemium]
1412. [NeoSmart/LastPass to 1Password Conversion Utility](https://neosmart.net/Software/Changelog/28)
1413. [NeoSmart/ln-win](https://neosmart.net/Software/Changelog/16)
1414. [NeoSmart/NST Downloader](https://neosmart.net/Software/Changelog/15)
1415. [NeoSmart/RunInBash](https://neosmart.net/Software/Changelog/27)
1416. [NeoSmart/ToolTipFixer](https://neosmart.net/Software/Changelog/10)
1417. [NeoSmart/TweakUI](https://neosmart.net/Software/Changelog/6)
1418. [NeoSmart/uptime](https://neosmart.net/Software/Changelog/29)
1419. [NeoSmart/Windows OEM Product Key Tool](https://neosmart.net/Software/Changelog/22)
1420. [Net Transport](http://xi-soft.com/download.htm) :money_with_wings:
1421. [NetBalancer](https://netbalancer.com/download) :money_with_wings:
1422. [NetBeans](https://netbeans.apache.org/download/index.html)
1423. [NetDict](https://www.asm-l.cn/update.json)
1424. [NeteaseMusic](https://music.163.com/download)
1425. [NetLimiter](https://www.netlimiter.com/) :money_with_wings:
1426. [Netron](https://github.com/lutzroeder/netron/releases/latest) [124/4,163/469] Visualizer for deep learning and machine learning models
1427. [NetSpeedMonitor](https://www.softpedia.com/get/Network-Tools/Bandwidth-Tools/NetSpeedMonitor.shtml) A Lightweight Network Monitoring Toolbar for your Windows Taskbar. The app monitors the current speed for uploading and downloading of your Network Interface
1428. [NetSpeedMonitor@hanyizhao](https://github.com/hanyizhao/NetSpeedMonitor/releases/latest) [17/355/47] This is a net speed monitor just like 360 for windows user.
1429. [NetTraffic](https://www.softpedia.com/get/Network-Tools/Network-Monitoring/NetTraffic-Venea.shtml) An easy-to-use network monitoring application for network administrators who want to evaluate statistics in a specific time frame
1430. [Nextcloud](https://nextcloud.com/install/)
1431. [ngrev](https://github.com/mgechev/ngrev/releases/latest) [52/1,043/62] Tool for reverse engineering of Angular applications
1432. [Niffler](https://github.com/grinfans/niffler/releases) [5/16/2] Niffler is a grin gui wallet. support mac/linux/win
1433. [Nimbus Note](https://nimbusweb.me/) [Free Personal]
1434. [NirSoft/Access PassView](https://www.nirsoft.net/utils/accesspv.html) This utility reveals the database password of every password-protected mdb file that created with Microsoft Access 95/97/2000/XP or with Jet Database Engine 3.0/4.0 .It can be very useful if you forgot your Access Database password and you want to recover it.
1435. [NirSoft/ActiveX Compatibility Manager](https://www.nirsoft.net/utils/acm.html) This utility allows you to easily disable/enable ActiveX components on Internet Explorer browser.<br>It disables the desired ActiveX component by setting the &quot;kill bit&quot; of the desired CLSID underthe following Registry key: HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Internet Explorer\ActiveX Compatibility <br>For more information about this Registry key, read <a href="http://support.microsoft.com/default.aspx?kbid=240797" target="ms240797">this Microsoft article</a>
1436. [NirSoft/ActiveXHelper](https://www.nirsoft.net/utils/axhelper.html) ActiveXHelper is a small utility that allows you to view essential information about ActiveX components installed on your computer.You can view the entire (and very large !) list of ActiveX components by loading it fromHKEY_CLASSES_ROOT\CLSID Registry key, or alternatively, display only the ActiveX components that youspecify.In addition, you can temporarily disable specific ActiveX components. When ActiveX components are disabled, they cannot be used by any software, until you enable them again.
1437. [NirSoft/AdapterWatch](https://www.nirsoft.net/utils/awatch.html) AdapterWatch displays useful information about your network adapters:IP addresses, Hardware address, WINS servers, DNS servers, MTU value, Number of bytesreceived or sent, The current transfer speed, and more. In addition, it displays general TCP/IP/UDP/ICMP statistics for your local computer.
1438. [NirSoft/AddrView](https://www.nirsoft.net/utils/addrview.html) AddrView allows you to parse HTML pages and extract most URL addresses stored in them.AddrView extracts URLs of images (&lt;img&gt; tag), links to other files (&lt;a&gt; tag),CSS files, frames, Flash files, and more.<br>You can save the extracted addresses list to text, HTML or XML files, or add theseaddresses to your Favorities.
1439. [NirSoft/AdvancedRun](https://www.nirsoft.net/utils/advanced_run.html) AdvancedRun is a simple tool for Windows that allows you to run a program with different settings that you choose, including - low or high priority, start directory, main window state (Minimized/Maximized), run the program with different user or permissions, Operating system compatibility settings,and environment variables. You can also save the desired settings into a configuration file and then run the program automatically from command-line with the desired settings.
1440. [NirSoft/AllThreadsView](https://www.nirsoft.net/utils/all_threads_view.html) AllThreadsView is a simple tool for Windows that displays a list of all running threads from all processes on your system in one table.For every thread, the following information is displayed:Thread ID, Creation Time, Kernel Time, User Time, Duration, Start Address, Priority, Base Priority, Context Switch Count, Context Switch Change (Since the last refresh), Wait Reason, Process ID, Process Path.
1441. [NirSoft/AlternateStreamView](https://www.nirsoft.net/utils/alternate_data_streams.html) AlternateStreamView is a small utility that allows you to scan your NTFS drive, and find all hidden alternate streams stored in the file system.After scanning and finding the alternate streams, you can extract these streams into the specified folder, delete unwanted streams, or save the streams list into text/html/csv/xml file.
1442. [NirSoft/AltStreamDump](https://www.nirsoft.net/utils/alternate_stream_dump.html) AltStreamDump is a console application (Command Prompt) that dumps the list of NTFS alternate streams found in the current directory.By using a few command-line options, you can also instruct AltStreamDump to displaysthe alternate streams list of other folders and to scan subfolders in the desired folder depth.
1443. [NirSoft/AppAudioConfig](https://www.nirsoft.net/utils/app_audio_config.html) Starting from Windows Vista, you are allowed to change the sound volume of every application separately, and after you exit from the application, the last settings are saved in the Registry under HKEY_CURRENT_USER\Software\Microsoft\Internet Explorer\LowRegistry\Audio\PolicyConfig\PropertyStore so in the next time you run the application, your last settings are used.<br>This tool displays your current audio settings of every application on your system, and allows you to easily change the setting of multiple applications at once.You can change the mute/unmute status, the sound volume level, and the right/left audio balance of the application.
1444. [NirSoft/AppCompatibilityView](https://www.nirsoft.net/utils/app_compatibility_view.html) AppCompatibilityView is a simple tool that displays the list of all programs that run with different compatibility settings, stored in the Registry underHKEY_CURRENT_USER\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers and HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers keys. <br>It also allows you to easily modify or delete the compatibility settings of multiple applications at once.
1445. [NirSoft/AppCrashView](https://www.nirsoft.net/utils/app_crash_view.html) AppCrashView is a small utility for Windows Vista and Windows 7 that displays the details of all application crashes occurred in your system.The crashes information is extracted from the .wer files created by the Windows Error Reporting (WER) component of the operating system every time that a crash is occurred.AppCrashView also allows you to easily save the crashes list to text/csv/html/xml file.
1446. [NirSoft/AppNetworkCounter](https://www.nirsoft.net/utils/app_network_counter.html) AppNetworkCounter is a simple tool for Windows that counts and displays the number of TCP/UDP bytes and packets sent and received by every application on your system.For every application, the following information is displayed: the number of sent and received bytes, number of sent and received packets, number of sent/received IPv4 bytes, and number of sent/received IPv6 bytes. It also displays the version information of the application - Product Name, Product Version, File Description, and Company Name.
1447. [NirSoft/AppReadWriteCounter](https://www.nirsoft.net/utils/app_read_write_counter.html) AppReadWriteCounter is a tool for Windows that counts and displays the current file read/write operations of every application running on your system.It displays the number of read/write bytes, the number of read/write operations, current calculated read/write speed, and the details about the application (product name, product version, and so on) that makes the file read/write operations.
1448. [NirSoft/AsterWin IE](https://www.nirsoft.net/utils/asterie.html) 
1449. [NirSoft/AtNow](https://www.nirsoft.net/utils/atnow.html) AtNow is a command-line utility that schedules programs and commands to run in the near future.<br>By default, the commands are executed within 70 seconds or less from the moment that you run the AtNow utility with the desired command.
1450. [NirSoft/BatteryInfoView](https://www.nirsoft.net/utils/battery_information_view.html) BatteryInfoView is a small utility for laptops and netbook computers that displaysthe current status and information about your battery.The displayed battery information includes the battery name,  manufacture name, serial number, manufacture date, power state (charging/discharging),current battery capacity, full charged capacity, voltage, charge/discharge rate, and more...<br>BatteryInfoView also provides a log window, which adds a new log line containing the battery status every 30 seconds orany other time interval that you choose.
1451. [NirSoft/BlueScreenView](https://www.nirsoft.net/utils/blue_screen_view.html) BlueScreenView scans all your minidump files created during 'blue screen of death' crashes, and displays the information about all crashes in one table.For each crash, BlueScreenView displays the minidump filename, the date/time of the crash, the basic crashinformation displayed in the blue screen (Bug Check Code and 4 parameters), and the details of the driver or modulethat possibly caused the crash (filename, product name, file description, and file version).<br>For each crash displayed in the upper pane, you can view the details of the device drivers loaded during the crash in the lower pane.BlueScreenView also mark the drivers that their addresses found in the crash stack, so you can easily locate the suspected drivers that possibly caused the crash.
1452. [NirSoft/BluetoothCL](https://www.nirsoft.net/utils/bluetoothcl.html) BluetoothCL is a small console application that dumps all current detected bluetooth devices into the standard output.For each Bluetooth device, the following information is displayed: MAC Address, Name, Major Device Type, Minor Device Type, and optionally the company name of the device (if external file of MAC addresses - oui.txt is provided)
1453. [NirSoft/BluetoothLogView](https://www.nirsoft.net/utils/bluetooth_log_view.html) BluetoothLogView is a small utility that monitors the activity of Bluetooth devices around you, and displays a log of Bluetooth devices on the main window.Every time that a new Bluetooth device arrives to your area and when the device leaves your area, a new log line is added with the following information:Device Name, Device Address, Event Time, Event Type ('Device Arrival' or 'Device Left'), Device Type, and the company that created the device.  BluetoothLogView also allows you to specify a description for every device (according to its MAC address) that will appear under the 'Description' column.
1454. [NirSoft/BluetoothView](https://www.nirsoft.net/utils/bluetooth_viewer.html) BluetoothView is a small utility that runs in the background, and monitor the activity of Bluetooth devices around you.For each detected Bluetooth device, it displays the following information: Device Name, Bluetooth Address, Major Device Type, Minor Device Type, First Detection Time, Last Detection Time, and more.<br>BluetoothView can also notify you when a new Bluetooth device is detected, by displaying a balloon in your taskbar or by playing a small beep sound.
1455. [NirSoft/BrowserAddonsView](https://www.nirsoft.net/utils/web_browser_addons_view.html) BrowserAddonsView is a simple tool that displays the details of all Web browser addons/plugins installed in your system. BrowserAddonsView can scan and detect the addons of most popular Web browsers: Chrome, Firefox, and Internet Explorer. For Chrome and Firefox,BrowserAddonsView detects and scans all Web browser profiles if there are multiple profiles.
1456. [NirSoft/BrowsingHistoryView](https://www.nirsoft.net/utils/browsing_history_view.html) BrowsingHistoryView is a utility that reads the history data of 4 different Web browsers (Internet Explorer, Mozilla Firefox, Google Chrome, and Safari)and displays the browsing history of all these Web browsers in one table.The browsing history table includes the following information: Visited URL, Title, Visit Time, Visit Count, Web browser and User Profile.BrowsingHistoryView allows you to watch the browsing history of all user profiles in a running system, as well as to getthe browsing history from external hard drive.<br>You can also export the browsing history into csv/tab-delimited/html/xml file from the user interface, or from command-line, without displaying any user interface.
1457. [NirSoft/BulkFileChanger](https://www.nirsoft.net/utils/bulk_file_changer.html) BulkFileChanger is a small utility that allows you to create files list from multiple folders, and then make some action on them - Modify their created/modified/accessed time, change their file attribute(Read Only, Hidden, System), run an executable with these files as parameter, and copy/cut paste into Explorer.
1458. [NirSoft/BulletsPassView](https://www.nirsoft.net/utils/bullets_password_view.html) BulletsPassView is a password recovery tool that reveals the passwords stored behind the bullets in the standard password text-box of Windows operating system and Internet Explorer Web browser.After revealing the passwords, you can easily copy them to the clipboard or save them into text/html/csv/xml file.
1459. [NirSoft/ChromeCacheView](https://www.nirsoft.net/utils/chrome_cache_view.html) ChromeCacheView is a small utility that reads the cache folder of Google Chrome Web browser,and displays the list of all files currently stored in the cache.For each cache file, the following information is displayed: URL, Content type, File size, Last accessed time, Expiration time, Server name, Server response, and more.<br>You can easily select one or more items from the cache list, and then extract the files to another folder, or copy the URLs list to the clipboard.
1460. [NirSoft/ChromeCookiesView](https://www.nirsoft.net/utils/chrome_cookies_view.html) ChromeCookiesView is an alternative to the standard internal cookies viewer of Google Chrome Web browser.it displays the list of all cookies stored by Google Chrome Web browser, and allows you to easily delete unwanted cookies. It also allows you export the cookies into text/csv/html/xml file.<br>For every cookie, the following information is displayed:Host Name, Path, Name, Value, Secure (Yes/No), HTTP Only Cookie (Yes/No), Last Accessed Time, Creation Time, Expiration Time.
1461. [NirSoft/ChromeHistoryView](https://www.nirsoft.net/utils/chrome_history_view.html) ChromeHistoryView is a small utility that reads the history data file of Google Chrome Web browser, and displays the list of all visited Web pages in the last days. For each visited Web page, the following information is displayed:URL, Title, Visit Date/Time, Number of visits, number of times that the user typed this address (Typed Count), Referrer, and Visit ID. <br>You can select one or more history items, and them export them into html/xml/csv/text file, or copy the information to the clipboard and paste it into Excel.
1462. [NirSoft/ChromePass](https://www.nirsoft.net/utils/chromepass.html) ChromePass is a small password recovery tool for Windows that allows you to view the user names and passwords stored by Google Chrome Web browser.For each password entry, the following information is displayed: Origin URL, Action URL, User Name Field, Password Field, User Name, Password, and Created Time.It allows you to get the passwords from your current running system, or from a user profile stored on external drive.<br>You can select one or more items and then save them into text/html/xml file or copy them to the clipboard.
1463. [NirSoft/CleanAfterMe](https://www.nirsoft.net/utils/clean_after_me.html) CleanAfterMe allows you to easily clean files and Registry entries that are automatically created by the Windows operating system during your regular computer work.<br>With CleanAfterMe, you can clean the cookies/history/cache/passwords of Internet Explorer,the 'Recent' folder, the Registry entries that record the last opened files, the temporary folder of Windows, the event logs, the Recycle Bin, and more.
1464. [NirSoft/Clipboardic](https://www.nirsoft.net/utils/clipboardic.html) Clipboardic is a small utility that listen to the clipboard activity, and each time that you copy something into the clipboard,it automatically save the copied data into Windows clipboard file (.clp).Later, when you need the copied data again, you can simply select the right clipboard file, and Clipboardic will automatically insert it into theclipboard.<br>Clipboardic also allows you to easily share the clipboard data between multiple computers on your local network.
1465. [NirSoft/Content Advisor Password Remover](https://www.nirsoft.net/utils/conadvpass.html) Content Advisor is a feature in Internet Explorer that allows supervisors to restrict the web sites that the users can browse. The supervisor can set a password in order to prevent from other users from changing the Content Advisor properties.If the supervisor forgets the password, he cannot change the Content Advisor properties in the regular way. The simplest way to solve this problem is to delete the password in the Registry.The password is stored in HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\Ratings. The "Key" value represents the encrypted password. <br>Advanced users can easily delete the password from the registry and thus they don't need this utility. User who doesn't want to deal with the registry, can use my utility for deleting the Content Advisor Password.
1466. [NirSoft/ControlMyMonitor](https://www.nirsoft.net/utils/control_my_monitor.html) ControlMyMonitor allows you view and modify the settings of your monitor (Also known as 'VCP Features'), like brightness, contrast, sharpness, red/green/blue color balance, and more... You can modify the monitor settings from the GUI and from command-line. You can also export all settings of your monitor into a configuration file and then laterload the same configuration back into your monitor.
1467. [NirSoft/CountryTraceRoute](https://www.nirsoft.net/utils/country_traceroute.html) CountryTraceRoute is a Traceroute utility, similar to the tracert tool of Windows, but with graphical user interface, and it's also much faster than tracert of Windows.CountryTraceRoute also displays the country of the owner of every IP address found in the Traceroute.<br>After the Traceroute is completed, you can select all items (Ctrl+A) and then save them into csv/tab-delimited/html/xml file with 'Save Selected Items' option (Ctrl+S)or copy them to the clipboard (Ctrl+C) and then paste the result into Excel or other spreadsheet application.
1468. [NirSoft/CredentialsFileView](https://www.nirsoft.net/utils/credentials_file_view.html) CredentialsFileView is a simple tool for Windows that decrypts and displays the passwords and other data stored inside Credentials files of Windows.You can use it to decrypt the Credentials data of your currently running system, as well as the Credentials data stored on external hard drive.
1469. [NirSoft/CSVFileView](https://www.nirsoft.net/utils/csv_file_view.html) CSVFileView is a simple CSV file viewer/converter utility that allows you to easilyview the content of CSV or tab-delimited file created by NirSoft utilities or by any other software, in a simple table viewer.You can sort the lines according to one of the fields, remove unwantedfields and change their order, and then save the result back intoCSV file, tab-delimited file, XML file, or HTML report.
1470. [NirSoft/CurrPorts](https://www.nirsoft.net/utils/cports.html) CurrPorts is network monitoring software that displays the list of all currently opened TCP/IP and UDP ports on your local computer.For each port in the list, information about the process that opened the port is also displayed, including the process name, full path of the process, version information of the process (product name, file description, and so on), the time that the process was created, and the user thatcreated it.<br>In addition, CurrPorts allows you to close unwanted TCP connections, kill the process that opened the ports, andsave the TCP/UDP ports information to HTML file , XML file, or to tab-delimited text file.<br>CurrPorts also automatically mark with pink color suspicious TCP/UDP ports owned by unidentified applications (Applicationswithout version information and icons)
1471. [NirSoft/CurrProcess](https://www.nirsoft.net/utils/cprocess.html) CurrProcess utility displays the list of all processes currently running on your system.For each process, you can view the list of all modules (DLL files) that the process loads into memory.for all processes and modules, additional useful information is also displayed: product name, version, company name, description of the file, the size of the file, and more.<br>In addition, CurrProcess allows you to do the following actions: <ul><li>Change the priority of a process.<li>Kill a process.<li>Dump memory of process into a text file.<li>Create HTML report containing information about a process with the list of all modules that it loads into memory.<li>Save the list of all running processes into text or HTML file.<li>Copy process or module information to the clipboard.</ul>
1472. [NirSoft/CustomExplorerToolbar](https://www.nirsoft.net/utils/custom_explorer_toolbar.html) CustomExplorerToolbar is small utility for Windows 7 only, which allows you to easily customize the toolbar of Windows Explorer, and add buttons that were existed in previous versions of Windows,  like Copy, Cut, Paste, Select All, and more.<br>This utility also allows you to remove the toolbar buttons that youpreviously added.
1473. [NirSoft/CustomizeIE](https://www.nirsoft.net/utils/ctie.html) The CustomizeIE utility allows you to easily add, edit and delete additional toolbar buttons and menu items in Internet Explorer. (Version 5.0 and above)
1474. [NirSoft/DataProtectionDecryptor](https://www.nirsoft.net/utils/dpapi_data_decryptor.html) DataProtectionDecryptor is a powerful tool for Windows that allows you to decrypt passwords and other information encrypted by the DPAPI (Data Protection API) system of Windows operating system.You can use this tool to decrypt DPAPI data on your current running system and to decrypt DPAPI data stored on external hard drive.
1475. [NirSoft/DeviceIOView](https://www.nirsoft.net/utils/device_io_view.html) DeviceIOView allows you to watch the data transfer between a software or service and a device driver (DeviceIoControl calls).For each call to a device driver, the following information is displayed:Handle, Control Code, number of input bytes, number of output bytes, the name of the device handle,and all the input/output bytes, displayed as Hex dump.
1476. [NirSoft/DevManView](https://www.nirsoft.net/utils/device_manager_view.html) DevManView is an alternative to the standard Device Manager of Windows, which displays all devices and their properties in flat table, instead of tree viewer.In addition to displaying the devices of your local computer, DevManView also allows you view the devices list of another computer on your network, as long as you have administrator access rights to this computer.<br>DevManView can also load the devices list from external instance of Windows and disable unwanted devices.This feature can be useful if you have Windows operating system with booting problems, and you want to disable the problematic device.
1477. [NirSoft/Dialupass](https://www.nirsoft.net/utils/dialupass.html) This utility enumerates all dialup/VPN entries on your computers, and displays their logon details: User Name, Password, and Domain.You can use it to recover a lost password of your Internet connection or VPN.<br>Dialupass also allows you to save the dialup/VPN list into text/html/csv/xml file, or copy it to the clipboard.
1478. [NirSoft/DiskCountersView](https://www.nirsoft.net/utils/disk_counters_view.html) DiskCountersView displays the system counters of each disk drive in your system, including the total number of read/write operations and the total number of read/write bytes. It also displays general drive information, like disk name, partition number, partition location, and so on.
1479. [NirSoft/DiskSmartView](https://www.nirsoft.net/utils/disk_smart_view.html) DiskSmartView is a small utility that retrieves the <a href="http://en.wikipedia.org/wiki/S.M.A.R.T." target="SMART">S.M.A.R.T</a> information (S.M.A.R.T = Self-Monitoring, Analysis, and Reporting Technology) from IDE/SATA disks.This information includes the disk model/firmware/serial number, cylinders/heads, power-on hours (POH), internal temperature,disk errors rate, and more.You can use the S.M.A.R.T information retrieved by DiskSmartView to find out whether there is any significant problem in your disk drive.
1480. [NirSoft/DLL Export Viewer](https://www.nirsoft.net/utils/dll_export_viewer.html) This utility displays the list of all exported functions and their virtual memory addresses for the specified DLL files.You can easily copy the memory address of the desired function, paste it into your debugger, and set a breakpoint for this memory address.When this function is called, the debugger will stop in the beginning of this function.<br>For example: If you want to break each time that a message box is going to be displayed, simply put breakpoints on the memory addresses of message-box functions: MessageBoxA, MessageBoxExA, and MessageBoxIndirectA (or MessageBoxW, MessageBoxExW, and MessageBoxIndirectW in unicode based applications)When one of the message-box functions is called, your debugger should break in the entry point of that function, and then you canlook at call stack and go backward into the code that initiated this API call.
1481. [NirSoft/DNSDataView](https://www.nirsoft.net/utils/dns_records_viewer.html) This utility is a GUI alternative to the NSLookup tool that comes with Windows operating system.It allows you to easily retrieve the DNS records (MX, NS, A, SOA) of the specified domains.You can use the default DNS server of your Internet connection, or use any other DNS server that you specify.After retrieving the DNS records for the desired domains, you can save them into text/xml/html/csv file.
1482. [NirSoft/DNSQuerySniffer](https://www.nirsoft.net/utils/dns_query_sniffer.html) DNSQuerySniffer is a network sniffer utility that shows the DNS queries sent on your system.For every DNS query, the following information is displayed:Host Name, Port Number, Query ID, Request Type (A, AAAA, NS, MX, and so on), Request Time, Response Time, Duration,Response Code, Number of records, and  the content of the returned DNS records.<br>You can easily export the DNS queries information to csv/tab-delimited/xml/html file, or copy the DNS queries to the clipboard, and then pastethem into Excel or other spreadsheet application.
1483. [NirSoft/DomainHostingView](https://www.nirsoft.net/utils/domain_hosting_view.html) DomainHostingView is a utility for Windows that collects extensive information about a domain by using a series of DNS and WHOIS queries,and generates HTML report that can be displayed in any Web browser.<br>The information displayed by the report of DomainHostingView includes: the hosting company or data center that hosts the Web server, mail server, and domain name server (DNS) of the specified domain,the created/changed/expire date of the domain, domain owner, domain registrar that registered the domain, list of all DNS records, and more...
1484. [NirSoft/DotNetResourcesExtract](https://www.nirsoft.net/utils/dot_net_resources_extract.html) DotNetResourcesExtract is a small utility that scan dll/exe files of .NET applications, and extract all .NET embedded resources (Bitmaps, Gifs, HTML files, and so on) stored in them into the folder that you specify.
1485. [NirSoft/DownTester](https://www.nirsoft.net/utils/download_speed_tester.html) DownTester allows you to easily test your Internet download speed in multiple locations around the world.It automatically test the download speed of the URLs that you choose, one after another.It moves to the next download URL after the specified number of seconds has been elapsedor after it downloads the specified amount of KB - just according to your preferences.<br>After the download test is finished, you can easily save the result into text/html/xml/csv file, or copy it to the clipboard and paste it into Excel and other applications.
1486. [NirSoft/DriveLetterView](https://www.nirsoft.net/utils/drive_letter_view.html) DriveLetterView is a simple utility that allows you to view the list of all drive letter assignments in your system, including local drives, remote network drives, CD/DVD drives, and USB drives - even if they are not currently plugged.It also allows you to easily change a drive letter of USB devices and remote network shares, aswell as to delete a drive letter of USB device that is not plugged.You can also use DriveLetterView to export the list of all drives into text/csv/html/xml file.
1487. [NirSoft/DriverView](https://www.nirsoft.net/utils/driverview.html) DriverView utility displays the list of all device drivers currently loadedon your system. For each driver in the list, additional useful information is displayed:load address of the driver, description, version, product name, company that created the driver, and more.
1488. [NirSoft/DumpEDID](https://www.nirsoft.net/utils/dump_edid.html) DumpEDID is a small console application that extract the EDID (&quot;Extended display identification data&quot;)records from your computer, analyze it, and dump it into the console window.EDID record provide essential information about your monitor: manufacture week/year, monitor manufacturer,monitor model, supported display modes, and so on...<br>You can also get the EDID records of a remote computer, if you login to this computer with administrator rights.<h4 class="utilsubject">License</h4>This utility is released as freeware. You are allowed to freely distribute this utility via floppy disk, CD-ROM, Internet, or in any other way, as long as you don't charge anything for this.  If you distribute this utility, you must include all files inthe distribution package, without any modification !
1489. [NirSoft/EdgeCookiesView](https://www.nirsoft.net/utils/edge_cookies_view.html) EdgeCookiesView is a tool for Windows that displays the cookies stored by newer versions of Microsoft Edge Web browser (Starting from Fall Creators Update 1709 of Windows 10).It also allows you to select one or more cookies and then export them to tab-delimited, csv file, html file, or to a file in cookies.txt format.You can read the cookies from the current running system or from the WebCacheV01.dat database on external hard drive.
1490. [NirSoft/EncryptedRegView](https://www.nirsoft.net/utils/encrypted_registry_view.html) EncryptedRegView is a tool for Windows that scans the Registry of your current running system or the Registry of external hard drive you choose and searches for data encrypted with DPAPI (Data Protection API). When it finds encrypted data in the Registry, it tries to decrypt it and displays the decrypted data in the main window of EncryptedRegView.With this tool, you may find passwords and other secret data stored in the Registry by Microsoft products as well as by 3-party products.
1491. [NirSoft/Enterprise Manager PassView](https://www.nirsoft.net/utils/empv.html) Enterprise Manager is a graphical tool that allows you to easily configure and manageyour SQL Server. If you connect your SQL Server by using the SQL Server authentication,and you don't select the "Always prompt for login name and password" option, the passwordand the user-name are stored on your Registry.
1492. [NirSoft/ESEDatabaseView](https://www.nirsoft.net/utils/ese_database_view.html) ESEDatabaseView is a simple utility that reads and displays the data stored inside Extensible Storage Engine (ESE) database (Also known as 'Jet Blue' or .edb file).It displays a list of all tables available in the opened database file, allows you to choose the desired table to view, and then when you choose a table, it displays all records found in the selected table.ESEDatabaseView also allows you to easily choose one or more records, and then export them into comma-delimited/tab-delimited/html/xml file, or copy the records to the clipboard (Ctrl+C) and then paste them into Excel or other spreadsheet application.
1493. [NirSoft/EventLogChannelsView](https://www.nirsoft.net/utils/event_log_channels_view.html) EventLogChannelsView is a simple tool for Windows 10/8/7/Vista that shows the list of all event log channels on your system, includingthe channel name, event log filename, enabled/disabled status, current number of events in the channel, and more...<br>It also allows you to easily make some actions on multiple channels at once: enable/disable channels, set their maximum file size, and clear all events stored in the channels.
1494. [NirSoft/EventLogSourcesView](https://www.nirsoft.net/utils/event_log_sources_view.html) EventLogSourcesView is a simple tool that displays the list of all event log sources installed on your system.For every event log source, the following information is displayed:Event Source Name, Event Type, DLL/EXE Files containing the event message strings, Registry Modified Time, and version information taken from the DLL/EXE file (Product Name, Company, File Description,File Version)
1495. [NirSoft/ExecutedProgramsList](https://www.nirsoft.net/utils/executed_programs_list.html) ExecutedProgramsList is a simple tool that displays a list of programs and batch files that you previously executed on your system.For every program, ExecutedProgramsList displays the .exe file, the created/modified time of the .exe file,  and the current version information of the program (product name, product version, company name) if it's available.For some of the programs, the last time execution time of the program is also displayed.
1496. [NirSoft/ExeInfo](https://www.nirsoft.net/utils/exeinfo.html) The ExeInfo utility shows general information about executable files (*.exe), dynamic-link libraries (*.dll),ocx files, and drivers files. It can recognize all major types of executables, includingMS-DOS files, New Executable files (16-bit) and Portable Executable files (32-bit).
1497. [NirSoft/ExifDataView](https://www.nirsoft.net/utils/exif_data_view.html) ExifDataView is a small utility that reads and displays the Exif data stored inside .jpg image files generated by digital cameras.The EXIF data includes the name of the company created the camera, camera model, the date/time that the photograph was taken, Exposure Time, ISO Speed, GPS information (for digital cameras with GPS), and more.
1498. [NirSoft/FastResolver](https://www.nirsoft.net/utils/fastresolver.html) FastResolver is a small utility that resolves multiple host names into IP addresses and vice versa.You can simply type the list of IP addresses or host name that you want to resolve, or alternatively, you can specify IP addresses range that you want to scan.For local network, FastResolver also allows you to get the MAC address of all IP addresses that you scan.FastResolver is a multithreaded application, so it can resolve dozens of addresses within a few seconds.
1499. [NirSoft/FavoritesView](https://www.nirsoft.net/utils/faview.html) FavoritesView displays the list of all your Favorties (of Internet Explorer browser) and bookmarks (of Netscape/Mozilla browsers)in a single page. Each line in the list specifies the title of the item, the URL address, the created/modified date of the bookmark item, and the folder name.You select one or more of these bookmarks, and then copy them to the clipboard, delete them (Only for Internet Explorer Favorites), export them to tab-delimited text file, HTML file, or XML file.FavoritesView also allows you to locate duplicate URL addresses in your Favorites/Bookmarks or find specific item by specifying the URL or the title.
1500. [NirSoft/FBCacheView](https://www.nirsoft.net/utils/facebook_cache_viewer.html) FBCacheView is a simple tool that scans the cache of your Web browser (Internet Explorer, Firefox, or Chrome), and lists all images displayed in Facebook pages that you previously visited, including profile pictures, images uploaded to Facebook,and images taken from other Web sites. For every Facebook image, the following information is displayed: URL of the image, Web browser that was used to visit the page, image type, date/time of the image, visit time, image file size, and external URL (For images taken from another Web site).
1501. [NirSoft/FileAccessErrorView](https://www.nirsoft.net/utils/file_access_error_view.html) FileAccessErrorView is a diagnostic tool for Windows that displays information about errors occur while programs running on your systemtry to open/read/write/delete a file.FileAccessErrorView displays the filename that the application tried to open/read/write/delete, the process id/name of the application, the error code (NTSTATUS code), the description of the error code, the number of times that this error occurred, and the timestamp of this error.
1502. [NirSoft/FileActivityWatch](https://www.nirsoft.net/utils/file_activity_watch.html) FileActivityWatch is a tool for Windows that displays information about every read/write/delete operation of files occurs on your system.For every file, FileActivityWatch displays the number of read/write bytes, number of read/write/delete operations, first and last read/write timestamp, and the name/ID of the process responsible for the file operation.
1503. [NirSoft/FileTypesMan](https://www.nirsoft.net/utils/file_types_manager.html) FileTypesMan is an alternative to the 'File Types' tab in the 'Folder Options' of Windows.It displays the list of all file extensions and types registered on your computer.For each file type, the following information is displayed: Type Name, Description, MIME Type, Perceived Type, Flags, Browser Flags, and more.<br>FileTypesMan also allows you to easily edit the properties and flags of each file type, as well as it allows you to add, edit, and remove actions in a file type.
1504. [NirSoft/FirefoxDownloadsView](https://www.nirsoft.net/utils/firefox_downloads_view.html) This utility displays the list of the latest files that you downloaded with Firefox.For every download record, the following information is displayed:Download URL, Download Filename (with full path), Referrer, MIME Type, File Size, Start/End Time, Download Duration, and Average Download Speed.
1505. [NirSoft/FlashCookiesView](https://www.nirsoft.net/utils/flash_cookies_view.html) FlashCookiesView is a small utility that displays the list of cookie files created by Flash component (Local Shared Object) in your Web browser.For each cookie file, the lower pane of FlashCookiesView displays the content of the file in readable format or as Hex dump.<br>You can also select one or more cookie files, and then copy them to the clipboard, save them to text/html/xml file or delete them.
1506. [NirSoft/FolderChangesView](https://www.nirsoft.net/utils/folder_changes_view.html) FolderChangesView is a simple tool that monitors the folder or disk drive that you choose and lists every filename that is being modified, created, or deleted while the folder is being monitored.<br>You can use FolderChangesView with any local disk drive or with a remote network share, as long as you have read permission to the selected folder.
1507. [NirSoft/FoldersReport](https://www.nirsoft.net/utils/folrep.html) The FoldersReport utility scans a drive or a base folder that you select, and displays essential information for each folder that it finds: The size of all files inside the folder, The real files size on the disk, number of files inside the folder, number of hidden files, number of compressed files,and number of subfolders.You can use this utility to easily find out which folders use the most space in your drive.You can scan the folders of your local drives, CD-ROM drives, and network resourceson a remote computer.
1508. [NirSoft/FolderTimeUpdate](https://www.nirsoft.net/utils/folder_time_update.html) FolderTimeUpdate is a simple tool for Windows that scans all files and folders under the base folder you choose, and updatesthe 'Modified Time' of every folder according the latest modified time of the files stored in it.<br>This tool might be useful if, for example, you backup a cluster of folders and then restore them into another disk,but the backup program doesn't restore the original modified time of the folders.
1509. [NirSoft/FullEventLogView](https://www.nirsoft.net/utils/full_event_log_view.html) FullEventLogView is a simple tool for Windows 10/8/7/Vista that displays in a table the details of all events from the event logs of Windows, including the event description.It allows you to view the events of your local computer, events of a remote computer on your network, and events stored in .evtx files.It also allows you to export the events list to text/csv/tab-delimited/html/xml file from the GUI and from command-line.
1510. [NirSoft/GACView](https://www.nirsoft.net/dot_net_tools/gac_viewer.html) GACView is an alternative to the standard .NET assembly viewer on Windows Explorer.In addition to the standard columns, GACView displays additional information for each assembly,like modified date, file size, full path of the assembly file, file version, and so on.GACView also allows you to delete an assembly the cannot be uninstalled in the regular way.
1511. [NirSoft/GDIView](https://www.nirsoft.net/utils/gdi_handles.html) GDIView is a unique tool that displays the list of GDI handles (brushes, pens, fonts, bitmaps, and others) opened by every process. It displays the total count for each type of GDI handle, as well as detailed information about each handle.<br>This tool can be useful for developers that need to trace GDI resources leak in their software.
1512. [NirSoft/GUIPropView](https://www.nirsoft.net/utils/gui_prop_view.html) GUIPropView displays extensive information about all windows currently opened on your system. The upper pane of GUIPropView displays all top level windows, and when you select a window in the upper pane, the lower panedisplays the list of all child windows of the selected top level window.<br>You can also select one or more windows and then do some actions on them like close, hide, show, minimize, maximize, disable, enable, and so on...
1513. [NirSoft/HandleCountersView](https://www.nirsoft.net/utils/handle_counters_view.html) HandleCountersView is a simple tool for Windows that shows the current number of handles (File, Directory, Token, Job, Thread, and so on...) opened by everyprocess running on your system and the change in number of handles since the last time that you reset the counters.
1514. [NirSoft/HashMyFiles](https://www.nirsoft.net/utils/hash_my_files.html) HashMyFiles is small utility that allows you to calculate the MD5 and SHA1 hashes of one or more files in your system.You can easily copy the MD5/SHA1 hashes list into the clipboard, or save them into text/html/xml file.<br>HashMyFiles can also be launched from the context menu of Windows Explorer, and display the MD5/SHA1 hashesof the selected file or folder.
1515. [NirSoft/HeapMemView](https://www.nirsoft.net/utils/heap_memory_view.html) HeapMemView is a small utility that allows you to view the content of all memory blocks allocated in the heap of theprocess that you select.<br>This tool can be useful for developers that need to trace memory leaks in their software.
1516. [NirSoft/HostedNetworkStarter](https://www.nirsoft.net/utils/wifi_hotspot_starter.html) HostedNetworkStarter is a simple tool for Windows 7 and later that allows you to easily create a wifi hotspot with your wireless network adapter, using the Wifi hosted network feature of Windows operating system.With the wifi hotspot created by this tool, you can allow any device with wifi support to access the network and the Internet connection available in your computer.
1517. [NirSoft/HotKeysList](https://www.nirsoft.net/utils/hot_keys_list.html) HotKeysList is a simple tool for Windows that displays the list of hot keys that are currently registered on your system.You can use this tool to easily determine which hot keys on your system are available to use.
1518. [NirSoft/HTMLAsText](https://www.nirsoft.net/utils/htmlastext.html) HTMLAsText utility converts HTML documents to simple text files, by removing all HTML tags and formatting the text according to your preferences.
1519. [NirSoft/HtmlDocEdit](https://www.nirsoft.net/utils/html_doc_edit.html) HtmlDocEdit is a simple HTML designer/editor based on the Internet Explorer browser, that allowsyou to easily edit HTML files without any knowledge in HTML.with HtmlDocEdit you can change the font/color of selected text, add images, add links, add ordered and unordered lists, and more...
1520. [NirSoft/HTTPNetworkSniffer](https://www.nirsoft.net/utils/http_network_sniffer.html) HTTPNetworkSniffer is a packet sniffer tool that captures all HTTP requests/responses sent between the Web browser and the Web server and displays them in a simple table.For every HTTP request, the following information is displayed:Host Name, HTTP method (GET, POST, HEAD), URL Path, User Agent, Response Code, Response String, Content Type,Referer, Content Encoding, Transfer Encoding, Server Name, Content Length, Cookie String, and more...
1521. [NirSoft/IconsExtract](https://www.nirsoft.net/utils/iconsext.html) The IconsExtract utility scans the files and folders on your computer, and extract the icons and cursors stored in EXE, DLL, OCX, CPL, and in other file types. You can save the extracted icons to ICO files (or CUR files for cursors), or copy the image of a single icon into the clipboard.
1522. [NirSoft/IE PassView](https://www.nirsoft.net/utils/internet_explorer_password.html) IE PassView is a small utility that reveals the passwords stored by Internet Explorer Web browser.It supports all versions of Internet Explorer, from version 4.0 and up to 11.0, as well as Microsoft Edge Browser.<br>For each password that is stored by Internet Explorer, the following information is displayed:Web address, Password Type (AutoComplete, Password-Protected Web Site, or FTP), Storage Location(Registry, Credentials File, or Protected Storage), and the user name/password pair.You can select one or more items from the passwords list and export them into text/html/csv/xml file.<br>IE PassView also allows you to extract the passwords of Internet Explorer and  Microsoft Edge from external hard drive.
1523. [NirSoft/IECacheView](https://www.nirsoft.net/utils/ie_cache_viewer.html) IECacheView is a small utility that reads the cache folder of Internet Explorer, and displays the list of all files currently stored in the cache.For each cache file, the following information is displayed: Filename, Content Type, URL, Last Accessed Time, Last Modified Time, Expiration Time, Number Of Hits, File Size, Folder Name, and full path of the cache filename.You can easily save the cache information into text/html/xml file, or copy the cache table to the clipboard and thenpaste it to another application, like Excel or OpenOffice Spreadsheet.
1524. [NirSoft/IECompo](https://www.nirsoft.net/utils/iecompo.html) This small utility displays the list of Internet Explorer components that are installedon your computer.
1525. [NirSoft/IECookiesView](https://www.nirsoft.net/utils/iecookies.html) IECookiesView is a small utility that displays the details of all cookies that Internet Explorer stores on your computer. <br>In addition, It allows you to do the following actions: <ul><li>Sort the cookies list by any column you want, by clicking the column header. A second click sorts the column in descending order. <li>Find a cookie in the list by specifying the name of the Web site. <li>Select and delete the unwanted cookies.<li>Save the cookies to a readable text file.<li>Copy cookie information into the clipboard.<li>Automatically refresh the cookies list when a Web site sends you a cookie.<li>Display the cookies of other users and from other computers.<li>Open the IECookiesView utility directly from Internet Explorer toolbar.<li>Change the content of a cookie !<li>Export your cookies to Netscape/Mozilla cookies file. <li>Block specific Web sites from using cookies through the cookies blocking mechanism of Internet Explorer 6.0.</ul>
1526. [NirSoft/IEDesignMode](https://www.nirsoft.net/utils/ie_design_mode.html) IEDesignMode Adds a new menu item into the context menu of Internet Explorer that allows you to easily switch the active Internet Explorer window to design mode.<br>When a Web page in in design mode, you can change the location of images and other objects,change the current text, paste a new text into the Web page, and so on.After you made your changes, you can easily switch back to non-design mode and/or save the modified Web page to HTML file.
1527. [NirSoft/IEHistoryView](https://www.nirsoft.net/utils/iehv.html) Each time that you type a URL in the address bar or click on a link in Internet Explorer browser,the URL address is automatically added to the history index file.When you type a sequence of characters in the address bar, Internet Explorer automaticallysuggests you all URLs that begins with characters sequence that you typed (unless AutoComplete feature for Web addresses is turned off). However, Internet Explorer doesn't allow you to view and edit the entire URL list that itstores inside the history file.
1528. [NirSoft/ImageCacheViewer](https://www.nirsoft.net/utils/image_cache_viewer.html) ImageCacheViewer is a simple tool that scans the cache of your Web browser (Internet Explorer, Firefox, or Chrome), and lists the images displayed in the Web sites that you recently visited.<br>For every cached image file, the following information is displayed:URL of the image, Web browser that was used to visit the page, image type, date/time of the image,browsing time, and file size.<br>When selecting a cache item in the upper pane of ImageCacheViewer, the image is displayed in the lower pane,and you can copy the image to the clipboard by pressing Ctrl+M.
1529. [NirSoft/InjectedDLL](https://www.nirsoft.net/utils/injected_dll.html) InjectedDLL is a small utility that displays the list of DLLs that are automatically injected on every process in your system.
1530. [NirSoft/InsideClipboard](https://www.nirsoft.net/utils/inside_clipboard.html) Each time that you copy something into the clipboard for pasting it into another application, the copied data is saved into multiple formats.The main clipboard application of Windows only display the basic clipboard formats, like text and bitmaps, but doesn'tdisplay the list of all formats that are stored in the clipboard.<br>InsideClipboard is a small utility that displays the binary content of all formats that are currently stored in theclipboard, and allow you to save the content of specific format into a binary file.
1531. [NirSoft/InstalledCodec](https://www.nirsoft.net/utils/installed_codec.html) InstalledCodec is a small utility displays the list of all Codec drivers and DirectShow filters currently installed on your system.For each component the following information is displayed: Display Name, Type, Disabled Status, Installed/Modified Time,Description, Company Name, Filename, and more...<br> It allows you to easily disable or enable any Codec/DirectShow component or export the list into text/xml/html file.
1532. [NirSoft/InstalledDriversList](https://www.nirsoft.net/utils/installed_drivers_list.html) InstalledDriversList is a simple tool for Windows that lists all device drivers that are currently installed on your system.For every device driver, the following information is displayed:Driver Name, Display Name, Description, Startup Type, Driver type, Driver Group, Filename, File Size, Modified/Created Time of the driver file, and version information of the driver file.<br>If the driver is currently running on Windows kernel, the following information is also displayed:Base Memory Address, End Address, Memory Size, and Load Count.
1533. [NirSoft/InstalledPackagesView](https://www.nirsoft.net/utils/installed_packages_view.html) InstalledPackagesView is a tool for Windows that displays the list of all software packages installed on your system with Windows Installer, and lists thefiles, Registry keys, and .NET Assemblies associated with them. For every installed software, the following information is displayed: Display Name, Display Version, Install Date, Registry Time, Estimated Size, Install Location, Install Source, MSI Filename (In C:\Windows\Installer), and more...<br>You can watch the installed software packages information from your local system or from another system on external hard-drive.
1534. [NirSoft/IPInfoOffline](https://www.nirsoft.net/utils/ip_country_info_offline.html) IPInfoOffline Allows you to view information about IP addresses, without connecting any external server.It uses a compressed IP addresses database that is stored inside the exe file.<br>For each IP address, the following information is displayed:IP block range, Organization (RIPE, ARIN, APNIC, LACNIC or AFRINIC), Assigned Date, Country Name, and Country Code.After retrieving the information about the desired IP addresses, You can copy the information to the clipboard,or save it into text/html/xml/csv file.
1535. [NirSoft/IPNetInfo](https://www.nirsoft.net/utils/ipnetinfo.html) IPNetInfo is a small utility that allows you to easily find all available information about an IP address:The owner of the IP address, the country/state name, IP addresses range, contact information (address, phone, fax, and email), and more.
1536. [NirSoft/JavaScript Animator Express](https://www.nirsoft.net/utils/jsae.html) This utility allows you to easily create animation from image files (GIFs and JPGs) on yourlocal drive. The animation is achieved by creating a simple HTML page with JavaScript animation,and running it on your default browser.
1537. [NirSoft/JumpListsView](https://www.nirsoft.net/utils/jump_lists_view.html) JumpListsView is a simple tool that displays the information stored by the 'Jump Lists' feature of Windows 7 and Windows 8.For every record found in the Jump Lists, the following information is displayed:The filename that the user opened, the date/time of the file opening event, the ID of the application that was used to open the file, the size/time/attributes of the file on the time that the file was opened, and more...<br>You can also export the Jump Lists records to csv/tab-delimited/xml/html file.
1538. [NirSoft/KeyboardStateView](https://www.nirsoft.net/utils/keyboard_state_view.html) KeyboardStateView is a simple tool for Windows that displays the current state and virtual key code of every key you press.It also allows you to view the current state of all keyboard keys.<br>For every key, the following information is displayed: Key Name (VK_XXXX ), Description, Key Code (Decimal), Key Code (Hexadecimal), Key Pressed Status, Key Toggled Status (Useful for Num Lock, Caps Lock), andlast time that the key was pressed.
1539. [NirSoft/LastActivityView](https://www.nirsoft.net/utils/computer_activity_view.html) LastActivityView is a tool for Windows operating system that collects information from various sources on a running system,and displays a log of actions made by the user and events occurred on this computer.The activity displayed by LastActivityView includes: Running .exe file, Opening open/save dialog-box, Opening file/folder from Explorer or other software, software installation, system shutdown/start, application or system crash, network connection/disconnection and more...
1540. [NirSoft/LiveContactsView](https://www.nirsoft.net/utils/live_messenger_contacts.html) LiveContactsView is a small utility that allows you to view the details of all contacts in your Windows Live Messenger.For each contact, LiveContactsView display the following fields: Email address, nickname, quick name, first name, last name, and more.You can easily select one or more contacts and then export them into text/xml/html/csv file, or copy them into the clipboard and then paste them into Excel or to other spreadsheet application.
1541. [NirSoft/LiveTcpUdpWatch](https://www.nirsoft.net/utils/live_tcp_udp_watch.html) LiveTcpUdpWatch is a tool for Windows that displays live information about all TCP and UDP activity on your system.Every line in the main table of LiveTcpUdpWatch displays the protocol (TCP/UDP/IPv4/IPv6), local/remote IP address, local/remote port, number of sent/received bytes, number of sent/received packets, connect/disconnect time (For TCP only), and the process (ID and path) responsible for this activity.
1542. [NirSoft/LoadedDllsView](https://www.nirsoft.net/utils/loaded_dll_view.html) LoadedDllsView is a simple tool for Windows that scans all running processes on your system and displays the list of all DLL files loaded by these processes and the number of processes that load each DLL in the list.When selecting a DLL file in the upper pane of LoadedDllsView, the lower pane displays the list of all processes that use the selected DLL file.You can also select one or more DLL files and then export the list into comma-delimited/tab-delimited/html/xml file.
1543. [NirSoft/LSASecretsDump](https://www.nirsoft.net/utils/lsa_secrets_dump.html) LSASecretsDump is a small console application that extract the LSA secrets from the Registry, decrypt them, and dump them into the console window.<br>The LSA secrets key is located under HKEY_LOCAL_MACHINE\Security\Policy\Secrets and may contain yourRAS/VPN passwords, Autologon password, and other system passwords/keys.
1544. [NirSoft/LSASecretsView](https://www.nirsoft.net/utils/lsa_secrets_view.html) LSASecretsView is a small utility that displays the list of all LSA secrets stored in the Registry on your computer.<br>The LSA secrets key is located under HKEY_LOCAL_MACHINE\Security\Policy\Secrets and may contain yourRAS/VPN passwords, Autologon password, and other system passwords/keys.
1545. [NirSoft/MACAddressView](https://www.nirsoft.net/utils/mac_address_lookup_find.html) MACAddressView is a MAC address lookup tool that allows you to easily find the company details (company name, address, and country) according to the MAC address of a product. <br>MACAddressView also allows you to find MAC address records according to the company name, company address, or country name.After finding the desired MAC address records, you can save them into text/xml/HTML/csv file or copythem to the clipboard and paste them into Excel or other applications.
1546. [NirSoft/Mail PassView](https://www.nirsoft.net/utils/mailpv.html) Mail PassView is a small password-recovery tool that reveals the passwordsand other account details for the following email clients:<br><ul><li> Outlook Express<li> Microsoft Outlook 2000 (POP3 and SMTP Accounts only)<li> Microsoft Outlook 2002/2003/2007/2010/2013/2016 (POP3, IMAP, HTTP and SMTP Accounts)<li> Windows Mail<li> Windows Live Mail<li> IncrediMail<li> Eudora<li> Netscape 6.x/7.x (If the password is not encrypted with master password)<li> Mozilla Thunderbird (If the password is not encrypted with master password)<li> Group Mail Free<li> Yahoo! Mail - If the password is saved in Yahoo! Messenger application.<li> Hotmail/MSN mail - If the password is saved in MSN/Windows/Live Messenger application.<li> Gmail - If the password is saved by Gmail Notifier application, Google Desktop, or by Google Talk.</ul>
1547. [NirSoft/MessenPass](https://www.nirsoft.net/utils/mspass.html) MessenPass is a password recovery tool that reveals the passwords of the following instant messenger applications:<ul><li>MSN Messenger<li>Windows Messenger (In Windows XP)<li>Windows Live Messenger (In Windows XP/Vista/7)<li>Yahoo Messenger (Versions 5.x and 6.x)<li>Google Talk<li>ICQ Lite 4.x/5.x/2003<li>AOL Instant Messenger v4.6 or below, AIM 6.x, and AIM Pro.<li>Trillian<li>Trillian Astra<li>Miranda<li>GAIM/Pidgin<li>MySpace IM<li>PaltalkScene<li>Digsby</ul>MessenPass can only be used to recover the passwords for the current logged-on user on your local computer, and it only works if you chose the remember your password in one of the above programs.You cannot use this utility for grabbing the passwords of other users.
1548. [NirSoft/MetarWeather](https://www.nirsoft.net/utils/mweather.html) The MetarWeather utility decodes METAR weather reports from around the world, and displays them in a simple weather report table.  You can save the weather report into text, HTML or XML files.MetarWeather can decode METAR reports from a text file, or download the latestreports directly from the Internet.
1549. [NirSoft/MIMEView](https://www.nirsoft.net/utils/mimeview.html) This utility displays the list of all MIME types defined in your system.For each MIME type, information about the associated file extension and installed plugin is also displayed.
1550. [NirSoft/MMCSnapInsView](https://www.nirsoft.net/utils/mmc_snapins_view.html) MMCSnapInsView is a simple tool for Windows that displays the details of all MMC snap-ins installed on your system, includingname, description, CLSID, dll file, product name, company name, file version, and more...<br>You can also select multiple MMC snap-ins and then open them in MMC application.
1551. [NirSoft/MonitorInfoView](https://www.nirsoft.net/utils/monitor_info_view.html) MonitorInfoView is a small utility that displays essential information about your monitor:manufacture week/year, monitor manufacturer,monitor model, supported display modes, and more...<br>The information is extracted from the EDID (&quot;Extended display identification data&quot;) records stored on your computer.<br>You can also view the monitor information of multiple computers on your network, if you login to these computers withadministrator rights.
1552. [NirSoft/MUICacheView](https://www.nirsoft.net/utils/muicache_view.html) Each time that you start using a new application, Windows operating system automatically extract the application name from the version resource of the exe file,and stores it for using it later, in Registry key known as the 'MuiCache'.
1553. [NirSoft/MultiMonitorTool](https://www.nirsoft.net/utils/multi_monitor_tool.html) MultiMonitorTool is a small tool that allows you to do some actions related to working with multiple monitors.With MultiMonitorTool, you can disable/enable monitors, set the primary monitor, save and load the configuration of all monitors, and move windows from one monitorto another. You can do these actions from the user interface or from command-line, without displaying user interface.MultiMonitorTool also provides a preview window, which allows you to watch a preview of every monitor on your system.
1554. [NirSoft/MyEventViewer](https://www.nirsoft.net/utils/my_event_viewer.html) MyEventViewer is a simple alternative to the standard event viewer of Windows.As opposed to Windows event viewer, MyEventViewer allows you to watch multiple event logs in one list,as well as the event description and data are displayed in the main window, instead of opening a new one.Also, with MyEventViewer you can easily select multiple event items and then save them to HTML/Text/XML file,or copy them to the clipboard (Ctrl+C) and then paste them into Excel.
1555. [NirSoft/MyLastSearch](https://www.nirsoft.net/utils/my_last_search.html) MyLastSearch utility scans the cache and history files of your Web browser, and locate all search queries that youmade with the most popular search engines (Google, Yahoo and MSN) and with popular social networking sites (Twitter, Facebook, MySpace).The search queries that you made are displayed in a table with the following columns: Search Text, Search Engine, Search Time, Search Type (General, Video, Images), Web Browser, and the search URL.<br>You can select one or more search queries and then copy them to the clipboard or save them into text/html/xml file.
1556. [NirSoft/MZCacheView](https://www.nirsoft.net/utils/mozilla_cache_viewer.html) MZCacheView is a small utility that reads the cache folder of Firefox/Mozilla/Netscape Web browsers,and displays the list of all files currently stored in the cache.For each cache file, the following information is displayed: URL, Content type, File size, Last modified time,Last fetched time, Expiration time, Fetch count, Server name, and more.<br>You can easily select one or more items from the cache list, and then extract the files to another folder, or copy the URLs list to the clipboard.
1557. [NirSoft/MZCookiesView](https://www.nirsoft.net/utils/mzcv.html) MZCookiesView is an alternative to the standard 'Cookie Manager' provided byNetscape and Mozilla browsers. It displays the details of all cookies stored inside the cookies file (cookies.txt) in one table, and allows you to save the cookies list intotext, HTML or XML file, delete unwanted cookies, and backup/restore the cookies file.
1558. [NirSoft/MZHistoryView](https://www.nirsoft.net/utils/mozilla_history_view.html) MZHistoryView is a small utility that reads the history data file (history.dat)of Firefox/Mozilla/Netscape Web browsers, and displays the list of all visited Web pagesin the last days. For each visited Web page, the following information is displayed:URL, First visit date, Last visit date, Visit counter, Referrer, Title, and Host name.<br>You can also easily export the history data to text/HTML/Xml file.
1559. [NirSoft/NetBScanner](https://www.nirsoft.net/utils/netbios_scanner.html) NetBScanner is a network scanner tool that scans all computers in the IP addresses range you choose, using NetBIOS protocol.For every computer located by this NetBIOS scanner, the following information is displayed:IP Address, Computer Name, Workgroup or Domain, MAC Address, and the company that manufactured the network adapter (determined according to the MAC address).NetBScanner also shows whether a computer is a Master Browser.You can easily select one or more computers found by NetBScanner, and then export the list into csv/tab-delimited/xml/html file.
1560. [NirSoft/NetConnectChoose](https://www.nirsoft.net/utils/net_connect_choose.html) NetConnectChoose is a simple tool that allows you to easily choose the default Internet connection that will be used by all Internet applications,when you have more than a single Internet connection on the same time. (Each connection on different network adapter)<br>It also displays extensive information about every active network/Internet connection, including network adapter name, MAC Address, Name Servers, MTU, Interface Speed, current incoming/outgoing data speed, number of received/sent packets, received/sent bytes, and more...
1561. [NirSoft/NetResView](https://www.nirsoft.net/utils/netresview.html) NetResView is a small utility that displays the list of all network resources (computers, disk shares, and printer shares) on your LAN.As opposed to &quot;My Network Places&quot; module of Windows, NetResView display all network resources from all domains/workgroups in one screen, and including admin/hidden shares.
1562. [NirSoft/NetRouteView](https://www.nirsoft.net/utils/network_route_view.html) NetRouteView is a GUI alternative to the standard route utility (Route.exe) of Windows operating system.It displays the list of all routes on your current network, including the destination, mask, gateway, interface IP address, metric value,type, protocol, age (in seconds), interface name, and the MAC address.<br>NetRouteView also allows you to easily add new routes, as well as to remove or modify existing static routes.
1563. [NirSoft/Network Password Recovery](https://www.nirsoft.net/utils/network_password_recovery.html) When you connect to a network share on your LAN or to your .NET Passport account, Windows allows you to save your password in order to use it in each time that you connect the remote server.This utility recovers all network passwords stored on your system for the current logged-on user.It can also recover the passwords stored in Credentials file of external drive, as long as you know the last log-on password.
1564. [NirSoft/NetworkConnectLog](https://www.nirsoft.net/utils/network_connect_log.html) NetworkConnectLog is a simple utility that repeatedly scans your local area network (Using ARP and Netbios protocols) and add a new logline every time that a new computer or device connects to your network, and when a computer or device disconnects from your network.<br>After the connect/disconnect log lines are accumulated, you can easily export the log lines to comma-delimited/tab-delimited/html/xml file.
1565. [NirSoft/NetworkCountersWatch](https://www.nirsoft.net/utils/network_counters_watch.html) NetworkCountersWatch is a tool for Windows that displays system counters for every network interface on your system. The system counters include the number of incoming/outgoing bytes, number of incoming/outgoing packets, number of broadcast packets, and more.You can also initialize all counters to zero at any time in order to watch the network counters for specific event.NetworkCountersWatch also calculates and displays the current download speed and upload speed on your network interface.
1566. [NirSoft/NetworkInterfacesView](https://www.nirsoft.net/utils/network_interfaces.html) NetworkInterfacesView is a simple tool that displays the list of all network adapters/interfaces installed on your system.It displays network interfaces that are currently active, as well as network interfaces that have been installed previously, and nowthey are not connected (like USB wireless network adapters).<br>For every network interface found on your system, the following information is displayed (if it's stored in the Registry):Device Name, Connection Name, IP Address, Subnet Mask, Default Gateway, DHCP Server, Status, MAC Address and more...<br>You can select one or more network interface items and then export them to xml/html/csv/tab-delimited file, or copy them into the clipboard and then paste theminto Excel or other spreadsheet application.
1567. [NirSoft/NetworkLatencyView](https://www.nirsoft.net/utils/network_latency_view.html) NetworkLatencyView is a simple tool for Windows that listens to the TCP connections on your system and calculates the network latency (in milliseconds) for every new TCP connectiondetected on your system. For every IP address, NetworkLatencyView displays up to 10 network latency  values, and their average. The latency value calculated by NetworkLatencyView is very similar to the result you get from pinging to the same IP address.<br>NetworkLatencyView also allows you to easily export the latency information to text/csv/tab-delimited/html/xml file, or copy the information to the clipboard and thenpaste it to Excel or other application.
1568. [NirSoft/NetworkOpenedFiles](https://www.nirsoft.net/utils/network_opened_files.html) NetworkOpenedFiles is a simple tool for Windows that displays the list of all files that are currently opened by other computers on your network.For every opened filename, the following information is displayed:Filename, user name, computer name (On Windows 7/2008 or later), Permissions information (Read/Write/Create), locks count, file owner, file size, file attributes, and more...
1569. [NirSoft/NetworkTrafficView](https://www.nirsoft.net/utils/network_traffic_view.html) NetworkTrafficView is a network monitoring tool that captures the packets pass through your network adapter,and displays general statistics about your network traffic. The packets statistics is grouped by theEthernet Type, IP Protocol, Source/Destination Addresses, and Source/Destination ports.For every statistics line, the following information is displayed:Ethernet Type (IPv4, IPv6, ARP), IP Protocol (TCP, UDP, ICMP), Source Address, Destination Address, Source Port,Destination Port, Service Name (http, ftp, and so on), Packets Count, Total Packets Size, Total Data Size, Data Speed, Maximum Data Speed, Average Packet Size, First/Last Packet Time, Duration, and process ID/Name (For TCP connections).
1570. [NirSoft/NetworkUsageView](https://www.nirsoft.net/utils/network_usage_view.html) NetworkUsageView extracts and displays the network usage information stored in the SRUDB.dat database of Windows 8 and Windows 10.The network usage data is collected every hour by Windows operating systems and includes the following information:The name and description of the service or application, the name and SID of the user, the network adapter, and the total number of bytes sent and received by the specified service/application.
1571. [NirSoft/NirCmd](https://www.nirsoft.net/utils/nircmd.html) NirCmd is a small command-line utility that allows you to do some useful tasks withoutdisplaying any user interface. By running NirCmd with simple command-line option, you canwrite and delete values and keys in the Registry, write values into INI file, dial to yourinternet account or connect to a VPN network, restart windows or shut down the computer, create shortcut to a file, change the created/modified date of a file, change your displaysettings, turn off your monitor, open the door of your CD-ROM drive, and more...
1572. [NirSoft/NirExt](https://www.nirsoft.net/utils/nirext.html) The NirExt utility add 3 useful context menu extensions to your Windows Explorer environment:<ul><li><span class="special2">Folder Properties: </span>This option is available in the context menu when you right-click on a folder in your file system.It allows you change the icon of any folder you want, and change the text that appears when the mouse cursor moves over the folder.
1573. [NirSoft/NK2Edit](https://www.nirsoft.net/utils/outlook_nk2_edit.html) 
1574. [NirSoft/NTFSLinksView](https://www.nirsoft.net/utils/ntfs_links_view.html) Starting from Windows Vista, Microsoft uses symbolic links and junction points of NTFS file system in order to make changes in the folders structure of Windows and keep the compatibility of applications written for older versions of Windows.This utility simply shows you a list of all symbolic links and junctions in the specified folder, and their target paths. It also allows you to save the symbolic links/junctions list into text/html/xml/csv file.
1575. [NirSoft/OfficeIns](https://www.nirsoft.net/utils/officeins.html) OfficeIns is a small utility that displays the details of all installed Microsoft Office (Word, Excel, Outlook, and so on...) add-ins on your computer,and allows you to disable / enable them.
1576. [NirSoft/OfflineRegistryFinder](https://www.nirsoft.net/utils/offline_registry_finder.html) OfflineRegistryFinder is a tool for Windows that allows you to scan Registry files from external drive and find the desired Registry keys/values/data according to the search criteria you define. After OfflineRegistryFinder displays the search result, you can easily select one or more items and then export them into a .reg filethat can be used to import in the RegEdit tool of Windows.
1577. [NirSoft/OfflineRegistryView](https://www.nirsoft.net/utils/offline_registry_view.html) OfflineRegistryView is a simple tool for Windows that allows you to read offline Registry files from external drive and view the desired Registry key in .reg file format.
1578. [NirSoft/OpenedFilesView](https://www.nirsoft.net/utils/opened_files_view.html) OpenedFilesView displays the list of all opened files on your system.For each opened file, additional information is displayed: handle value, read/write/delete access, file position, the process that opened the file, and more...<br>Optionally, you can also close one or more opened files, or close the process that opened these files.
1579. [NirSoft/OpenSaveFilesView](https://www.nirsoft.net/utils/open_save_files_view.html) OpenSaveFilesView is a simple tool that displays the list of files that you previously opened with the standard open/save dialog-box of Windows.For every file in the list, the following information is displayed: Filename, Extension, Order (The order that the files were opened for every file extension), Open Time (Available only for the last opened file of every file type), File Modified/Created Time, File Size, and File Attributes.
1580. [NirSoft/OpenWithView](https://www.nirsoft.net/utils/open_with_view.html) OpenWithView is a small utility that displays the list of all available applications in the 'Open With' dialog-box of Windows, and allows you to easily disable/enable the applications in the list.When application is disabled, it won't be displayed in the 'Other Programs' section of the 'Open With' dialog-box.<br>This utility can be useful if your 'Open With' window displays too much applications, and you want toremove the applications that you don't use frequently.
1581. [NirSoft/OperaCacheView](https://www.nirsoft.net/utils/opera_cache_view.html) OperaCacheView is a small utility that reads the cache folder of Opera Web browser, and displays the list of all files currently stored in the cache.For each cache file, the following information is displayed: URL, Content type, File size, Last accessed time, and last modified time in the server. <br>You can easily select one or more items from the cache list, and then extract the files to another folder, or copy the URLs list to the clipboard.
1582. [NirSoft/OperaPassView](https://www.nirsoft.net/utils/opera_password_recovery.html) OperaPassView is a small password recovery tool that decrypts the content of the Opera Web browser password file (wand.dat) and displays the list of all Web site passwords stored in this file.You can easily select one or more passwords in the OperaPassView window, and then copy the passwords list to the clipboard and save it intotext/html/csv/xml file.
1583. [NirSoft/OutlookAddressBookView](https://www.nirsoft.net/utils/outlook_address_book_view.html) OutlookAddressBookView is a simple utility that displays the details of all recipients stored in the address books ofMicrosoft Outlook.For every recipient entry, the following information is displayed:Email Address, Display Name, Address Type (MS-Exchange or SMTP), Street Address, Phone Number, Created Time,Modified Time (Works only with address books of Exchange server), and more...  <br>You can easily select one or more recipients from the list and export them into tab-delimited/comma-delimited/xml/html file,or copy them to the clipboard and then paste the list into Excel.
1584. [NirSoft/OutlookAttachView](https://www.nirsoft.net/utils/outlook_attachment.html) OutlookAttachView scans all messages stored in your Outlook, and displays the list of all attached files that it finds.You can easily select one or more attachments and save all of them into the desired folder, as well as you can delete unwanted large attachments thattake too much disk space in your mailbox. You can also save the list of attachments into xml/html/text/csv file.
1585. [NirSoft/OutlookStatView](https://www.nirsoft.net/utils/outlook_statistics.html) OutlookStatView scans your Outlook mailbox, and display a general statistics about the users that you communicate via emails.For each user/email, the following information is displayed: The number of outgoing messages that you sent to the user (separated by to/cc/bcc),the number of incoming message that the user sent to you, the total size of messages sent by the user, the email client software used by this user, and the time range that you send/received emails with the specified user.
1586. [NirSoft/Password Security Scanner](https://www.nirsoft.net/utils/password_security_scanner.html) This utility scans the passwords stored by popular Windows applications (Microsoft Outlook, Internet Explorer, Mozilla Firefox, and more...)and displays security information about all these passwords.The security information of every stored password includes the total number of characters, number of numeric characters, number of lowercase/uppercase characters, number of repeating characters,and password strength.You can use this tool to determine whether the passwords used by other users are secured enough,without watching the passwords themselves.
1587. [NirSoft/PasswordFox](https://www.nirsoft.net/utils/passwordfox.html) PasswordFox is a small password recovery tool that allows you to view the user names and passwords stored by Mozilla Firefox Web browser.By default, PasswordFox displays the passwords stored in your current profile, but you can easily select to watch the passwordsof any other Firefox profile.For each password entry, the following information is displayed: Record Index, Web Site, User Name, Password, User Name Field, Password Field, and the Signons filename.
1588. [NirSoft/pcANYWHERE Hosts Scanner](https://www.nirsoft.net/utils/pcanyscan.html) This small utility can scan any range of 2 IP addresses and show the list of pcANYWHEREhosts within that range. It finds the pcANYWHERE hosts by sending a specific UDP packetto all hosts in the specified range. <br> You can use this scanner for checking if there are pcANYWHERE hosts running on your TCP/IP network.  <br>Be aware that this utility can only detect pcANYWHERE hosts that listens on TCP/IP network.It cannot detect pcANYWHERE hosts on other networks.
1589. [NirSoft/PCAnywhere PassView](https://www.nirsoft.net/utils/pcanypass.html) Symantec pcANYWHERE has 2 different types of passwords:<br><ol><li> For all types of items: pcANYWHERE allows you to protect an item with a password (in "Protect item" tab). If an item is protected with a password, pcANYWHERE doesn't allow you modify or view the item's properties (depending on what you choose in the protection options). <li> In remote control items and caller items: pcANYWHERE saves the login name and password details, for using them during the remote control sessions.</ol><br>This utility can recover instantly both types of passwords.
1590. [NirSoft/PingInfoView](https://www.nirsoft.net/utils/multiple_ping_tool.html) PingInfoView is a small utility that allows you to easily ping multiple host names and IP addresses, and watch the result in one table.It automatically ping to all hosts every number of seconds that you specify, and displays the number of succeed and failed pings, as wellas the average ping time.You can also save the ping result into text/html/xml file, or copy it to the clipboard.
1591. [NirSoft/PreviousFilesRecovery](https://www.nirsoft.net/utils/previous_files_recovery.html) PreviousFilesRecovery is a simple tool for Windows 10/8/7/Vista that allows you to scan the shadow copies of your local hard drive and find deleted files as well asolder versions of existing files. If the file you need is found in the shadow copies of Windows, you can easily recover it by copying it into existing folder on your drive.
1592. [NirSoft/ProcessActivityView](https://www.nirsoft.net/utils/process_activity_view.html) ProcessActivityView creates a summary of all files and folders that the selected process tries to access.For each file that the process access, the following information is displayed:Number of times that the file was opened and closed, number of read/write calls, total number ofread/write bytes, the dll that made the last open-file call, and more...
1593. [NirSoft/ProcessTCPSummary](https://www.nirsoft.net/utils/process_tcp_summary.html) ProcessTCPSummary is a simple tool for Windows that displays a summary of all process that have TCP connections or listening UDP ports.For every process, this tool displays the total number of TCP connections, number of TCP connections for each status (Established, Listening, Syn-Sent, Syn-Received...),number of IPv4 TCP connections, number of IPv6 TCP connections, common port numbers, and more...<br>If you run ProcessTCPSummary as Administrator, you can also watch the number of TCP/UDP bytes sent and received by every process as well as the current send/receive speed.
1594. [NirSoft/ProcessThreadsView](https://www.nirsoft.net/utils/process_threads_view.html) ProcessThreadsView is a small utility that displays extensive informationabout all threads of the process that you choose.The threads information includes the ThreadID, Context Switches Count, Priority, Created Time,User/Kernel Time, Number of Windows, Window Title, Start Address, and more.<br>When selecting a thread in the upper pane, the lower pane displays the following information:Strings found in the stack, stack modules addresses, call stack, and processor registers.<br>ProcessThreadsView also allows you to suspend and resume one or more threads.
1595. [NirSoft/ProduKey](https://www.nirsoft.net/utils/product_cd_key_viewer.html) ProduKey is a small utility that displays the ProductID and the CD-Key of Microsoft Office (Microsoft Office 2003, Microsoft Office 2007),Windows (Including Windows 8/7/Vista), Exchange Server, and SQL Server installed on your computer.You can view this information for your current running operating system, or for anotheroperating system/computer - by using command-line options.  This utility can be useful if you lost the product key of your Windows/Office, and you wantto reinstall it on your computer.
1596. [NirSoft/Protected Storage PassView](https://www.nirsoft.net/utils/pspv.html) Protected Storage PassView is a small utility that reveals the passwords stored on yourcomputer by Internet Explorer, Outlook Express and MSN Explorer. The passwords are revealed by readingthe information from the Protected Storage.<br>Starting from version 1.60, this utility reveals all AutoComplete strings stored in Internet Explorer, not only the AutoComplete password, as in the previous versions.
1597. [NirSoft/PstPassword](https://www.nirsoft.net/utils/pst_password.html) PstPassword is a small utility for Windows that recover lost password of Outlook .PST (Personal Folders) file.
1598. [NirSoft/QuickSetDNS](https://www.nirsoft.net/utils/quick_set_dns.html) QuickSetDNS is a simple tool that allows you to easily change the DNS servers that are used for your Internet connection.You can set the desired DNS servers from the user interface, by choosing from a list of DNS servers that you defined, orfrom command-line, without displaying any user interface.
1599. [NirSoft/RecentFilesView](https://www.nirsoft.net/utils/recent_files_view.html) Each time that you open a file from Windows Explorer or from a standard open/save dialog-box, the name of the file that you opened is recorded by the operating system.Some of the names are saved into the 'Recent' folder. Other are saved into the Registry.<br>This utility display the list of all recently opened files, and allows you to deleteunwanted filename entries.You can also save the files list into text/html/xml file.
1600. [NirSoft/RegDllView](https://www.nirsoft.net/utils/registered_dll_view.html) RegDllView is a small utility that displays the list of all registered dll/ocx/exe files (COM registration).For each registered file, you can view the last date/time that it was registered, and the list of all registration entries (CLSID/ProgID).<br>RegDllView also allows you to unregister dll/ocx files that you don't need on your system anymore.If you have dll/ocx files that don't exist on your system anymore, but their registration entries are stillexist in your Registry, you can manually remove these entries by using 'Delete All Entries For Selected Files' option.<br>Starting from version 1.35, RegDllView also allows you to register dll/ocx files (like regsvr32), simply by dragging one or more files from Explorer folder into the window of RegDllView.
1601. [NirSoft/RegFileExport](https://www.nirsoft.net/utils/registry_file_offline_export.html) RegFileExport is a small console application that allows you to easily extract datafrom offline Registry file located on another disk drive.RegFileExport read the Registry file, ananlyze it, and then export the Registry data into a standard .reg file of Windows. You can export the entire Registry file, or only a specific Registry key.
1602. [NirSoft/RegFromApp](https://www.nirsoft.net/utils/reg_file_from_application.html) RegFromApp monitors the Registry changes made by the application that you selected, and creates a standard RegEdit registration file (.reg) that contains all the Registry changes made by the application.You can use the generated .reg file to import these changes with RegEdit when it's needed.
1603. [NirSoft/RegistryChangesView](https://www.nirsoft.net/utils/registry_changes_view.html) RegistryChangesView is a tool for Windows that allows you to take a snapshot of Windows Registry and later compare it with another Registry snapshots, with the current Registry or with Registry files stored in a shadow copy created by Windows.When comparing 2 Registry snapshots, you can see the exact changes made in the Registry between the 2 snapshots, and optionally export the Registry changes into a standard .reg file of RegEdit.<br>
1604. [NirSoft/RegScanner](https://www.nirsoft.net/utils/regscanner.html) RegScanner is a small utility that allows you to scan the Registry, find the desired Registry valuesthat match to the specified search criteria, and display them in one list.After finding the Registry values, you can easily jump to the right value in RegEdit, simply bydouble-clicking the desired Registry item.You can also export the found Registry values into a .reg file that can be used in RegEdit.
1605. [NirSoft/Remote Desktop PassView](https://www.nirsoft.net/utils/remote_desktop_password.html) Remote Desktop PassView is a small utility that reveals the password stored by  Microsoft Remote Desktop Connection utility inside the .rdp files.
1606. [NirSoft/ResourcesExtract](https://www.nirsoft.net/utils/resources_extract.html) ResourcesExtract is a small utility that scans dll/ocx/exe files and extract all resources(bitmaps, icons, cursors, AVI movies, HTML files, and more...) stored in them into the folder that you specify.<br>You can use ResourcesExtract in user interface mode, or alternatively, you can run ResourcesExtract in command-line mode without displaying any user interface.
1607. [NirSoft/RouterPassView](https://www.nirsoft.net/utils/router_password_recovery.html) Most modern routers allow you to backup the configuration of the router into a file,and then restore the configuration from the file when it's needed.
1608. [NirSoft/RTMPDumpHelper](https://www.nirsoft.net/utils/rtmp_dump_helper.html) RTMPDumpHelper is a small utility that can help you to easily download RTMP video/audio streams.By combining this utility and the proxy server of <a href="http://rtmpdump.mplayerhq.hu" target="rtmpdump">RTMPDump toolkit</a>, you can simply open a Web page containing RTMP video stream in your favorite Web browser, and while watching the video, it'll be saved to your disk automatically as .flv or .mp4 file.<br>RTMP is a streaming protocol used by Hulu, justin.tv, and by many live streaming Web sites.
1609. [NirSoft/RunAsDate](https://www.nirsoft.net/utils/run_as_date.html) RunAsDate is a small utility that allows you to run a program in the date and time that you specify.This utility doesn't change the current system date and time of your computer, but it only injects the date/time that you specify into the desired application.<br>You can run multiple applications simultaneously, each application works with different date and time,while the real date/time of your system continues to run normally.
1610. [NirSoft/RunFromProcess](https://www.nirsoft.net/utils/run_from_process.html) RunFromProcess is a command-line utility that allows you to run a program  from another process that you choose.<br>The program that you run will be executed as a child of the specified process and it'llrun with the same user and security context of the specified parent process.
1611. [NirSoft/SafariCacheView](https://www.nirsoft.net/utils/safari_cache_view.html) SafariCacheView is a simple utility for Windows that reads and parses the cache file of Safari Web browser(cache.db) and displays the list of all cached files in a simple table.Every cache information line includes the following information:Filename, Content Type, URL, Content Length, Server Name, Server Time, Expiration Time, Last Modified Time, Content Encoding, and Referrer.
1612. [NirSoft/SafariHistoryView](https://www.nirsoft.net/utils/safari_history_view.html) SafariHistoryView is a simple utility for Windows that reads and parses the history file of Safari Web browser(history.plist) and displays the browsing history in a simple table.Every browsing history line includes the following information: URL, Web Page Title, Last Visit Time, Visit Count, Redirected To URL, and Record Index.<br>SafariHistoryView allows you to easily export the browsing history data into text/csv/html/xml file, or copythe data to the clipboard and then paste it into Excel.
1613. [NirSoft/SearchFilterView](https://www.nirsoft.net/utils/search_filter_view.html) When you search the content of files with Windows search, it uses the right search IFilter plugin according to the file extension. This utility allows you to easily view the search filters installed on your system and the file extensions that are associated with them, as well as it allows you to easily add or remove file extensions for these filters.
1614. [NirSoft/SearchMyFiles](https://www.nirsoft.net/utils/search_my_files.html) SearchMyFiles is an alternative to the standard &quot;Search For Files And Folders&quot; module of Windows.It allows you to easily search files in your system by wildcard, by last modified/created/last accessed time, by file attributes, by file content (text or binary search), and by the file size.SearchMyFiles allows you to make a very accurate search that cannot be done with Windows search. For Example: You can searchall files created in the last 10 minutes with size between 500 and 700 bytes.<br>After you made a search, you can select one or more files, and save the list into text/html/csv/xml file, or copy the list to the clipboard.
1615. [NirSoft/SecuritySoftView](https://www.nirsoft.net/utils/security_software_view.html) SecuritySoftView is a simple tool that displays the AntiVirus, AntiSpyware, and Firewall programs that are currently installed on your system and registered with the security center of Windows operating system.
1616. [NirSoft/SeqDownload](https://www.nirsoft.net/utils/seqdownload.html) 
1617. [NirSoft/ServiWin](https://www.nirsoft.net/utils/serviwin.html) ServiWin utility displays the list of installed drivers and services on your system.For some of them, additional useful information is displayed: file description, version,product name, company that created the driver file, and more.<br>In addition, ServiWin allows you to easily stop, start, restart, pause, and continueservice or driver, change the startup type of service or driver (automatic, manual, disabled,boot or system), save the list of services and drivers to file, or view HTML report ofinstalled services/drivers in your default browser.
1618. [NirSoft/ShadowCopyView](https://www.nirsoft.net/utils/shadow_copy_view.html) ShadowCopyView is simple tool for Windows 10/8/7/Vista that lists the snapshots of your hard drive created by the 'Volume Shadow Copy' service of Windows.Every snapshot contains an older versions of your files and folders from the date that the snapshot was created, you can browsethe older version of your files and folders, and optionally copy them into a folder on your disk.
1619. [NirSoft/ShellBagsView](https://www.nirsoft.net/utils/shell_bags_view.html) Each time that you open a folder in Explorer, Windows automatically save the settings of this folder into the Registry.This utility displays the list of all folder settings saved by Windows.For each folder, the following information is displayed: The date/time that you opened it, the entry number, display mode (Details, Icons, Tiles, and so on...), the last position of the window, and the last size of the window.
1620. [NirSoft/ShellExView](https://www.nirsoft.net/utils/shexview.html) Shell Extensions are in-process COM objects which extend the abilities of Windows operating system. Most shell extensions are automatically installed by the operating system, but there arealso many other applications that install additional shell extension components. For example: If you install WinZip on your computer, you'll see a special WinZip menuwhen you right-click on a Zip file. This menu is created by adding a shell extension to the system.
1621. [NirSoft/ShellMenuNew](https://www.nirsoft.net/utils/shell_menu_new.html) ShellMenuNew is a small utility that displays the list of all menu items in the 'New' submenu of Windows Explorer.It allows you to easily disable unwanted menu items, so this 'New' submenu will display only the items that you need.
1622. [NirSoft/ShellMenuView](https://www.nirsoft.net/utils/shell_menu_view.html) ShellMenuView is a small utility that displays the list of static menu items that appeared in the context menu when you right-click a file/folder on Windows Explorer, andallows you to easily disable unwanted menu items.
1623. [NirSoft/ShortcutsMan](https://www.nirsoft.net/utils/shman.html) ShortcutsMan displays the details about all shortcuts that you have on your desktopand under your start menu.Broken shortcuts (shortcuts that point to file that doesn't exist) are automatically painted with pink color.You select one or more shortcuts, and then delete them, resolve them or save the shortcut's detailsto HTML/Text/XML file.
1624. [NirSoft/SimpleProgramDebugger](https://www.nirsoft.net/utils/simple_program_debugger.html) SimpleProgramDebugger is a simple debugging tool for Windows that attaches to existing running program or starts a new program in debugging mode, and thendisplays all major debugging events occurs while the program is running, including Exception, Create Thread, Create Process, Exit Thread, Exit Process,Load DLL, Unload Dll, and Debug String.<br>After the debugging events are accumulated, you can easily export them into comma-delimited/tab-delimited/xml/html file or copy them to theclipboard and then paste them into Excel or any other spreadsheet application.
1625. [NirSoft/SimpleWMIView](https://www.nirsoft.net/utils/simple_wmi_view.html) SimpleWMIView is a simple tool for Windows that displays the result of WMI queries in a simple table, and allows you to easily export the datato text/csv/tab-delimited/html/xml file, or to copy the selected items to the clipboard and then paste them to Excel or other spreadsheet application.With SimpleWMIView you can get extensive information about your system, like a list of running processes, services, drivers, user accounts, hardware,  and so on...
1626. [NirSoft/SiteShoter](https://www.nirsoft.net/utils/web_site_screenshot.html) SiteShoter is a small utility that allows you to save a screenshot of any Web page into a file.It automatically creates hidden window of Internet Explorer, loads the desired Web page, and than save the entire content of the Web page into an image file (.png, .jpg, .tiff, .bmp or .gif).You can also use SiteShoter to convert .html file on your local drive into image file.<br>You can use SiteShoter in user interface mode, or alternatively, you can run SiteShoter in command-line mode without displayingany user interface.
1627. [NirSoft/SkypeContactsView](https://www.nirsoft.net/utils/skype_contacts_view.html) SkypeContactsView is a simple tool that displays the list of all Skype contacts stored in the local database file of Skype.<br>For each contact, one or more of the following fields are displayed:Skype Name, Full Name, Display Name, Gender, ID, Birthday, Profile Time, Last Online Time, Last Used Time, Phone, Emails, and more...<br>SkypeContactsView also allows you to export the contacts list into text/tab-delimited/comma-delimited/xml/html file, or copy them to the clipboardand then paste them into Excel or other spreadsheet application.
1628. [NirSoft/SkypeLogView](https://www.nirsoft.net/utils/skype_log_view.html) SkypeLogView reads the log files created by Skype application, and displays the details of incoming/outgoing calls, chat messages, and filetransfers made by the specified Skype account. You can select one or more items from the logs list, and then copy them to the clipboard, or export them into text/html/csv/xml file.
1629. [NirSoft/SmartSniff](https://www.nirsoft.net/utils/smsniff.html) SmartSniff is a network monitoring utility that allows you to capture TCP/IP packets that pass through your network adapter, and view the captured data as sequence of conversations between clients and servers.You can view the TCP/IP conversations in Ascii mode (for text-based protocols, likeHTTP, SMTP, POP3 and FTP.) or as hex dump. (for non-text base protocols, like DNS)<br>SmartSniff provides 3 methods for capturing TCP/IP packets :<ol><li>Raw Sockets (Only for Windows 2000/XP or greater): Allows you to capture TCP/IP packets on your network without installinga capture driver. This method has some <a href="#problems">limitations and problems</a>.<li><a href="http://www.winpcap.org/" target="winpcap">WinPcap Capture Driver</a>:Allows you to capture TCP/IP packets on all Windows operating systems. (Windows 98/ME/NT/2000/XP/2003/Vista)In order to use it, you have to download and install WinPcap Capture Driver from<a href="http://www.winpcap.org/install/default.htm" target="winpcap">this Web site</a>. (WinPcap is a free open-source capture driver.)<br>This method is generally the preferred way to capture TCP/IP packets with SmartSniff, andit works better than the Raw Sockets method.<li>Microsoft Network Monitor Driver (Only for Windows 2000/XP/2003): Microsoft provides a free capture driver under Windows 2000/XP/2003 that can be used by SmartSniff,but this driver is not installed by default, and you have to manually install it, by using one of the following options:<ul><li><span class="special2">Option 1:</span> Install it from the CD-ROM of Windows 2000/XP according to the <a href="http://www.microsoft.com/windows/windows2000/en/advanced/help/app_netmon.htm" target="app_netmon">instructions in Microsoft Web site</a><li><span class="special2">Option 2 (XP Only) : </span> Download and install the <a href="http://www.microsoft.com/downloads/details.aspx?familyid=49ae8576-9bb9-4126-9761-ba8011fabf38&displaylang=en" target="sptools">Windows XP Service Pack 2 Support Tools</a>.One of the tools in this package is netcap.exe. When you run this tool in the first time, the Network Monitor Driverwill automatically be installed on your system.</ul><li>Microsoft Network Monitor Driver 3: Microsoft provides a new version of Microsoft Network Monitor driver (3.x) that is also supported under Windows 7/Vista/2008.Starting from version 1.60, SmartSniff can use this driver to capture the network traffic.<br>The new version of Microsoft Network Monitor (3.x) is available to download from <a href="http://www.microsoft.com/downloads/details.aspx?FamilyID=983b941d-06cb-4658-b7f6-3088333d062f&displaylang=en" target="driver">Microsoft Web site</a>.</ul>
1630. [NirSoft/SniffPass](https://www.nirsoft.net/utils/password_sniffer.html) SniffPass is small password monitoring software that listens to your network, capturethe passwords that pass through your network adapter, and display them on the screen instantly.SniffPass can capture the passwords of the following Protocols:POP3, IMAP4, SMTP, FTP, and HTTP (basic authentication passwords).<br>You can use this utility to recover lost Web/FTP/Email passwords.
1631. [NirSoft/SocketSniff](https://www.nirsoft.net/utils/socket_sniffer.html) SocketSniff allows you to watch the Windows Sockets (WinSock) activity of the selected process.<br>For each created socket, the following information is displayed:socket handle, socket type, local and remote addresses, local and remote ports, total number of send/receive bytes, and more.You can also watch the content of each send or receive call, in Ascii mode or as Hex Dump.
1632. [NirSoft/SoundVolumeView](https://www.nirsoft.net/utils/sound_volume_view.html) SoundVolumeView is a simple tool for Windows Vista/7/8/2008/10 that displays general information and current volume level for all active sound components on your system, andallows you to mute and unmute them instantly. <br>SoundVolumeView also allows you to save a sound profile into a file, containing the current volume level and the mute/unmute state of all sound components, as well as the default sound devices,and then later, load the same file to restore exactly the same volume levels and settings.<br>There is also extensive command-line support, which allows you to save/load profiles, change current volume of every sound component, and mute/unmute  every sound component,without displaying any user interface.
1633. [NirSoft/SpecialFoldersView](https://www.nirsoft.net/utils/special_folders_view.html) Windows operating system have dozens of special folders that are used for storing application settings and files, storing Internet files, saving temporary files, storing shortcuts to other files, and so on.<br>This utility displays the list of all special folders in your system, and allows you to easilyjump to the right folder simply by double-clicking the folder item.You can also save the list of all folder paths into text/html/xml file.
1634. [NirSoft/StartBlueScreen](https://www.nirsoft.net/utils/start_blue_screen.html) This utility, just as it sounds, allows your to crash the Windows operating system by initiating a Blue Screen of Deathaccording to 5 parameters that you specify from command-line.
1635. [NirSoft/SysExporter](https://www.nirsoft.net/utils/sysexp.html) SysExporter utility allows you to grab the data stored in standard list-views, tree-views, list boxes, combo boxes, text-boxes, and WebBrowser/HTML controls fromalmost any application running on your system, and export it to text, HTML or XML file.<br>Here's some examples for data that you can export with SysExporter:<ul><li>The files list inside archive file (.zip, .rar, and so on) as displayed by WinZip or 7-Zip File Manager. <li>The files list inside a folder.<li>The event log of Windows.<li>The list of emails and contacts in Outlook Express. <li>The Registry values displayed in the right pane of the Registry Editor.<li>The data displayed by SysInternals utilities (Registry Monitor, File Monitor, Process Explorer, and others.) <li>The text inside a standard message-box of Windows.<li>The HTML inside any instance of Internet Explorer.</ul>
1636. [NirSoft/TableTextCompare](https://www.nirsoft.net/utils/csv_file_comparison.html) TableTextCompare is a small utility that allows you to easily compare 2 tab-delimited orcomma-delimited (csv) files, and find out the difference between the 2 files.You can use this tool for comparing 2 different snapshots of data, created by other NirSoft utilities, like DriverView, ServiWin, USBDeview, CurrPorts, WirelessNetView, ShellExView, andmany others...<br>For example, You can use DriverView utility to save 2 snapshots of loaded drivers list into a tab-delimited file,and then use TableTextCompare to easily find out which device drivers were added, removed, or changed since the time that the first snapshot was taken.
1637. [NirSoft/TagsReport](https://www.nirsoft.net/utils/tagsrep.html) TagsReport reads HTML file and displays statistical information about thetags the appears in it. You can use this utility to locate problems in your HTML page.<br>For Example: If the end counter value for &lt;table&gt; tag is different from thestart counter value, something is possibly wrong in your HTML file, because every&lt;table&gt; tag must have a closing tag (&lt;/table&gt;)
1638. [NirSoft/TaskSchedulerView](https://www.nirsoft.net/utils/task_scheduler_view.html) TaskSchedulerView is a simple tool for Windows Vista/7/8/10 that displays in a single table the list of all tasks from the Task Scheduler of Windows.It also allows you to easily disable/enable mutiple tasks at once.For every task, the following information is displayed: Task Name, Description, Status, Hidden (Yes/No), Last Run/Next Run Times, Task Folder, EXE filename or COM handler of the task, number of missed runs, and more...
1639. [NirSoft/TcpLogView](https://www.nirsoft.net/utils/tcp_log_view.html) TcpLogView is a simple utility that monitors the opened TCP connections on your system, and adds a new log line every time that a TCP connection is opened or closed.For every log line, the following information is displayed: Even Time, Event Type (Open, Close, Listen), Local Address, Remote Address, Remote Host Name, Local Port, Remote Port, Process ID,Process Name, and the country information of the Remote IP (Requires to download IP to country file separately.)
1640. [NirSoft/TimeZonesView](https://www.nirsoft.net/utils/time_zones_view.html) TimeZonesView is a simple tool for Windows that displays all world time zones. For every time zone, the following information is displayed:name, description, current date/time in this time zone and date/time that daylight saving time begins and ends.
1641. [NirSoft/TurnedOnTimesView](https://www.nirsoft.net/utils/computer_turned_on_times.html) TurnedOnTimesView is a simple tool that analyses the event log of Windows operating system, and detects the time ranges that your computer was turned on.For every period of time that the computer was turned on, the following information is displayed:Startup Time, Shutdown Time, Duration, Shutdown Reason, Shutdown Type, Shutdown Process, and Shutdown Code.<br>TurnedOnTimesView allows you to get this information from your local computer, and from remote computer on your network if you have enough privilege to read the event log of Windows remotely.
1642. [NirSoft/TurnFlash](https://www.nirsoft.net/utils/tflash.html) Many Web sites today use the Macromedia Flash component for creating animated ads.These ads consumes additional bandwidth and sometimes even slow down your computer.Unfortunately, Internet Explorer doesn't provide a simple way to disable the Flashcomponent. Furthermore, if you refuse to install the Flash component, Internet Explorerwill constantly ask you to install Flash in each time that you enter into a Web page that contains a Flash object.
1643. [NirSoft/TurnFlash2](https://www.nirsoft.net/utils/tflash2.html) Many Web sites today use the Macromedia Flash component for creating animated ads.These ads consumes additional bandwidth and sometimes even slow down your computer.Unfortunately, Internet Explorer doesn't provide a simple way to disable the Flashcomponent. Furthermore, if you refuse to install the Flash component, Internet Explorer will constantly ask you to install Flash in each time that youenter into a Web page that contains a Flash object. This utility allows you to easily disable and enable the Flash component in Internet Explorer browser (Version 5.00 and above). When you disable flash with this utility, all new windows in Internet Explorer will be opened withoutusing the Flash component. The disabling of Flash doesn't affect the windows thatare already opened.While the Flash Component is disabled, Internet Explorer will not ask you to download  and install it. However, the disabling of the Flash component might cause a script error in some Web pages.Be aware that in Windows NT, 2000 and XP, this utility will not work if you don't have permission to write to the Registry keys of Internet Explorer.
1644. [NirSoft/UninstallView](https://www.nirsoft.net/utils/uninstall_view.html) UninstallView is a tool for Windows that collects information about all programs installed on your system and displays the details of the installed programs in one table.You can use it to get installed programs information for your local system, for remote computer on your network, and for external hard-drive plugged to your computer.It also allows you to easily uninstall a software on your local computer and remote computer (Including quiet uninstall if the installer supports it).
1645. [NirSoft/URLProtocolView](https://www.nirsoft.net/utils/url_protocol_view.html) URLProtocolView is a simple utility that displays all URL protocols (for example: ftp:, telnet:, mailto:)that are currently installed on your system.For each URL protocol, the following information is displayed:The protocol name, the protocol description, the command-line that is executed when you type or click theURL, the product name, and the company name.<br>This utility also allows you to easily enable/disable the URL protocols.
1646. [NirSoft/URLStringGrabber](https://www.nirsoft.net/utils/url_string_grabber.html) URLStringGrabber is a small utility that scans all opened windows of Internet Explorer and grab the URLs stored in them, including clickable links, images, script files, CSS files, RSS feeds,and flash (.swf) files.
1647. [NirSoft/USBDeview](https://www.nirsoft.net/utils/usb_devices_view.html) USBDeview is a small utility that lists all USB devices that currently connected to your computer, as well asall USB devices that you previously used.<br>For each USB device, extended information is displayed: Device name/description, device type, serial number(for mass storage devices), the date/time that device was added, VendorID, ProductID, and more...<br>USBDeview also allows you to uninstall USB devices that you previously used, disconnect USB devices that are currently connected to your computer, as well as to disable and enable USB devices.<br>You can also use USBDeview on a remote computer, as long as you login to that computer with admin user.
1648. [NirSoft/USBLogView](https://www.nirsoft.net/utils/usb_log_view.html) USBLogView is a small utility that runs in the background and records the details of any USB device that is plugged or unplugged into your system.For every log line created by USBLogView, the following information is displayed:Event Type (Plug/Unplug), Event Time, Device Name, Description, Device Type, Drive Letter (For storage devices), Serial Number (Only for some types of devices), Vendor ID,Product ID, Vendor Name, Product Name, and more...
1649. [NirSoft/UserAssistView](https://www.nirsoft.net/utils/userassist_view.html) This utility decrypt and displays the list of all UserAssist entries storedunder HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\UserAssist key in the Registry.The UserAssist key contains information about the exe files and links that you open frequently.you can save the list of UserAssist entries into text/html/xml/csv file, as well as you can delete unwanted items.
1650. [NirSoft/UserProfilesView](https://www.nirsoft.net/utils/user_profiles_view.html) UserProfilesView displays the list of all user profiles that you currently have in your system.For each user profile, the following information is displayed: Domain\User Name, Profile Path, Last Load Time,Registry File Size, User SID, and more.You can save the profiles list into text/xml/html/csv file.
1651. [NirSoft/VaultPasswordView](https://www.nirsoft.net/utils/vault_password_view.html) VaultPasswordView is a simple tool for Windows 10/8/7 that decrypts and displays the passwords and other data stored inside 'Windows Vault'.You can use it to decrypt the Windows Vault data of your currently running system, as well as the Windows Vault data stored on external hard drive.
1652. [NirSoft/VideoCacheView](https://www.nirsoft.net/utils/video_cache_view.html) After watching a video in a Web site, you may want to save the video file into your local disk for playing it offline in the future.If the video file is stored in your browser's cache, this utility can help you to extract the video file from the cache and save it for watching it in the future.<br>It automatically scans the entire cache of Internet Explorer, Mozilla-based Web browsers (Including Firefox), Opera, and Chrome, and then findsall video files that are currently stored in it.It allows you to easily copy the cached video files into another folder for playing/watching them in the future.If you have a movie player that is configured to play flv files, it also allows you to play the video directly from your browser's cache.
1653. [NirSoft/VNCPassView](https://www.nirsoft.net/utils/vnc_password.html) VNCPassView is a small utility that recover the passwords stored by the VNC tool.It can recover 2 of passwords: password stored for the current logged-on user (HKEY_CURRENT_USER in the Registry), andpassword stored for the all users.
1654. [NirSoft/Volumouse](https://www.nirsoft.net/utils/volumouse.html) Volumouse provides you a quick and easy way to control the sound volume on your system - simply by rolling the wheel of your wheel mouse.<br>It allows you to define a set of rules for determining when the wheel will be used for changing the sound volume.For example: You can configure Volumouse to use your mouse wheel for volume control when the Alt key is hold down,when the left mouse button is down, when the mouse cursor is over the taskbar, and so on...<br>When the conditions that you define are not satisfied, your mouse wheel will be used for the regular scrolling tasks, exactly as before.
1655. [NirSoft/WakeMeOnLan](https://www.nirsoft.net/utils/wake_on_lan.html) This utility allows you to easily turn on one or more computers remotely by sending Wake-on-LAN (WOL) packet to the remote computers.<br>When your computers are turned on,  WakeMeOnLan allows you to scan your network, and collect the MAC addresses of all your computers, and save the computers list into a file.Later, when your computers are turned off or in standby mode, you can use the stored computers list to easily choose the computer you want to turn on,and then turn on all these computers with a single click.<br>WakeMeOnLan also allows you to turn on a computer from command-line, by specifying the computer name, IP address, or the MAC address of the remote network card.
1656. [NirSoft/WebBrowserPassView](https://www.nirsoft.net/utils/web_browser_password.html) WebBrowserPassView is a password recovery tool that reveals the passwords stored by the following Web browsers:Internet Explorer (Version 4.0 - 11.0), Mozilla Firefox (All Versions), Google Chrome, Safari, and Opera.This tool can be used to recover your lost/forgotten password of any Website, including popular Web sites, likeFacebook, Yahoo, Google, and GMail, as long as the password is stored by your Web Browser.
1657. [NirSoft/WebCacheImageInfo](https://www.nirsoft.net/utils/web_cache_image_info.html) WebCacheImageInfo is a simple tool that searches for JPEG images with EXIF information stored inside the cache of your Web browser (Internet Explorer, Firefox, or Chrome), andthen it displays the list of all images found in the cache with the interesting information stored in them, like the software that was used to create the image, the camera model that was used to photograph the image,and the date/time that the image was created.
1658. [NirSoft/WebCamImageSave](https://www.nirsoft.net/utils/web_cam_image_capture.html) WebCamImageSave is simple WebCam capture utility that allows you to easily capturea still image from your camera every number of seconds that you choose, and save it into image file (.jpg, .png, .bmp) on your disk.You can format the saved image filename with the date/time that the image was taken according to your preference, for example: c:\images\img20110725_123256.jpg<br>WebCamImageSave also adds a label with the date/time that the image was captured into the image,by using the font, color, and date/time format that you choose.<br>You can also capture a single camera image from command-line, without displaying any user interface.
1659. [NirSoft/WebCookiesSniffer](https://www.nirsoft.net/utils/web_cookies_sniffer.html) WebCookiesSniffer is a packet sniffer tool that captures all Web site cookies sent between the Web browser and the Web server and displays them in a simple cookies table.The upper pane of WebCookiesSniffer displays the cookie string and the Web site/host name that sent or received this cookie.When selecting a cookie string in the upper pane, WebCookiesSniffer parses the cookie string and displays the cookies as name-value format in the lower pane.
1660. [NirSoft/WebSiteSniffer](https://www.nirsoft.net/utils/web_site_sniffer.html) WebSiteSniffer is a packet sniffer tool that captures all Web site files downloaded by your Web browser while browsing the Internet, and stores them on your hard drive under the base folder that you choose. WebSiteSniffer allows you to choose which type of Web site files will be captured:HTML Files, Text Files, XML Files, CSS Files, Video/Audio Files, Images, Scripts, and Flash (.swf) files.
1661. [NirSoft/WebVideoCap](https://www.nirsoft.net/utils/web_video_capture.html) While watching a video in a Web site, you may sometimes want to save the video into your local drive, and then play it offline later.This utility allows you to capture .flv (Flash Video) files and RTSP/MMS video streams while the Web browser download and play theminside a Web page. After the entire video file is downloaded and played by the Web browser, the video file is saved in the folderthat you selected, and you can play it offline later with any Video player.
1662. [NirSoft/WhatInStartup](https://www.nirsoft.net/utils/what_run_in_startup.html) This utility displays the list of all applications that are loaded automatically when Windows starts up.For each application, the following information is displayed: Startup Type (Registry/Startup Folder), Command-Line String, Product Name, File Version, Company Name, Location in the Registry or file system, and more.<br>It allows you to easily disable or delete unwanted programs that run in your Windows startup. You can use it on your currently running instance of Windows, as well as you can use it on external instance of Windows inanother drive. <br>WhatInStartup also supports a special &quot;Permanent Disabling&quot; feature - If a program that you previously disabled added itself again to the startup list of Windows, WhatInStartup will automatically detect the change and disable it again.
1663. [NirSoft/WhatIsHang](https://www.nirsoft.net/utils/what_is_hang.html) Sometimes, Windows or a running application hangs, the user interface abruptly stops responding, and you cannot determine what has caused the problem or how to troubleshoot the issue. This utility tries to detect the software or process that is currently hung, and displays some information that may allow you to sort out and understand what exactly is at the root of such unexpected behavior.Most of the information displayed in WhatIsHang's report, like Call Stack, Stack Data, Processor Registers, and Memory Data is designed for users with Windows programming knowledge. However, WhatIsHang also presents a list of strings and dll files related to the hang issue that can help users without programming skills understand and overcome the causes of the problem and restore normal operation.
1664. [NirSoft/WhoisCL](https://www.nirsoft.net/utils/whoiscl.html) WhoisCL is a simple command-line utility that allows you to easily get information about a registered domain.It automatically connect to the right WHOIS server, according to the top-level domain name, and retrieve the WHOIS record of the domain.<br>It supports both generic domains and country code domains.
1665. [NirSoft/WhoIsConnectedSniffer](https://www.nirsoft.net/utils/who_is_connected_sniffer.html) WhoIsConnectedSniffer is a network discovery tool that listens to network packets on your network adapter using a capture driver (WinpCap or MS network monitor)and accumulates a list of computer and devices currently connected to your network.WhoIsConnectedSniffer uses various protocols to detect the computers connected to your network, including ARP, UDP, DHCP, mDNS, and BROWSER.<br>For every detected computer or device, the following information is displayed: (Some of the fields might be empty if the information cannot be found inside the packets)IP Address, MAC Address, name of the device/computer, description, Operating System, Network Adapter Company, IPv6 Address.
1666. [NirSoft/WhoisThisDomain](https://www.nirsoft.net/utils/whois_this_domain.html) WhoisThisDomain is a <a href="http://www.webhostingsearch.com/domain-search.php" target="domain-search">domain registration lookup</a> utility allows you to easily get information about a registered domain.It automatically connects to the right WHOIS server, according to the top-level domain name, and retrieve the WHOIS record of the domain.<br>It supports both generic domains and country code domains.
1667. [NirSoft/WhosIP](https://www.nirsoft.net/utils/whosip.html) WhosIP is a simple command-line utility that allows you to easily find all available information about an IP address: The owner of the IP address, the country/state name, IP addresses range, contact information (address, phone, fax, and email), and more.
1668. [NirSoft/WifiChannelMonitor](https://www.nirsoft.net/utils/wifi_channel_monitor.html) WifiChannelMonitor is a utility for Windows that captures wifi traffic on the channel you choose, using Microsoft Network Monitor capture driver in monitor mode, anddisplays extensive information about access points and the wifi clients connected to them.WifiChannelMonitor also allows you to view the information about wifi clients that are not connected to any access points, including the list ofSSIDs (network names) that they are trying to connect.<br>For every access point, the following information is displayed: SSID, MAC Address, Device Manufacturer , PHY Type, Channel, RSSI, Security, Beacons Count, Probe Responses Count,Data Bytes, Retransmitted Data Bytes, and more...<br>For every client, the following information is displayed: MAC Address, Device Manufacturer, SSID list that the client tries to connect, Sent Data Bytes, Received Data Bytes, Probe Requests Count, and more...
1669. [NirSoft/WifiHistoryView](https://www.nirsoft.net/utils/wifi_history_view.html) WifiHistoryView is a simple tool for Windows 10/8/7/Vista that displays the history of connections to wireless networks on your computer.For every event that the computer connected to a wireless network or disconnected from it, the following information is displayed: The date/time that the event occurred, network name (SSID), profile name, network adapter name, BSSID of the router/Access Point, and more...<br>WifiHistoryView can read the wifi history information from a running system or from external event log file of another computer.
1670. [NirSoft/WifiInfoView](https://www.nirsoft.net/utils/wifi_information_view.html) WifiInfoView scans the wireless networks in your area and displays extensive information about them, including:Network Name (SSID), MAC Address, PHY Type (802.11g or 802.11n), RSSI, Signal Quality, Frequency, Channel Number, Maximum Speed, Company Name, Router Model and Router Name (Only for routers that provides this information), and more...<br>When you select a wireless network in the upper pane of this tool, the lower pane displays the Wi-Fi information elements received from this device, in hexadecimal format.<br>WifiInfoView also has a summary mode, which displays a summary of all detected wireless networks, grouped by channel number, company that manufactured the router, PHY type, or the maximum speed.
1671. [NirSoft/Win9x PassView](https://www.nirsoft.net/utils/win9xpv.html) The Win9x PassView utility reveals the passwords stored on your computer by Windows 95/98 operating system.
1672. [NirSoft/WinCrashReport](https://www.nirsoft.net/utils/application_crash_report.html) WinCrashReport provides an alternative to the built-in crash reporting program of Windows operating system.When application crashes in your system and Windows displays the internal crash window of the operating system,you can run WinCrashReport, and get extensive report about the crashed application.The crash report of WinCrashReport is displayed as simple text or in HTML, and includes the followinginformation: Crash memory address, Exception code, Exception description, Strings found in the stack,call stack, processor registers, modules list, threads list, and more...
1673. [NirSoft/WinExplorer](https://www.nirsoft.net/utils/winexp.html) WinExplorer is a utility that shows all system's windows in hierarchical display. <br>For every window in the hierarchy, you can view its properties, like handle, class name, caption, size, position and more. You can also modify some properties, like Caption and Visible/Enabled.<br>You can use this utility in all Win32-based operating systems: Windows 95,98,ME,NT,2000,XP
1674. [NirSoft/WinFontsView](https://www.nirsoft.net/utils/windows_fonts_viewer.html) WinFontsView is a small utility that enumerates all fonts installed on your system, and displays them in one simple table.For each font, WinFontsView draws 5 samples of the font in different sizes, in order to allow you to easily find and choose the desired font that you need.WinFontsView also allows you to view the fonts as Bold, as Italic or with underline, as well as it allows you to export the fonts list into html file.<br>If you need to find a font in non-English character set, WinFontsView also allows you to choose the rightcharacters set of the fonts and to type the characters displayed in the sample text of each font.
1675. [NirSoft/WinLister](https://www.nirsoft.net/utils/winlister.html) This utility displays the list of opened windows on your system.For each window, some useful information is displayed: the title, the handle of window, location, size, class name, process number,the name of the program that created the window, and more...<br>In addition, you can easily hide, show, close or set to top-most mode the selected windows, or save the windows list totext or HTML file.
1676. [NirSoft/WinLogOnView](https://www.nirsoft.net/utils/windows_log_on_times_view.html) WinLogOnView is a simple tool for Windows Vista/7/8/2008 that analyses the security event log of Windows operating system, and detects the date/time that users logged on and logged off.For every time that a user log on/log off to your system, the following information is displayed:Logon ID, User Name, Domain, Computer, Logon Time, Logoff Time, Duration, and network address.<br>WinLogOnView also allows you to easily export the logon sessions information to tab-delimited/comma-delimited/html/xml file.
1677. [NirSoft/WinPrefetchView](https://www.nirsoft.net/utils/win_prefetch_view.html) Each time that you run an application in your system, a Prefetch file which contains information about the files loaded by the application is created by Windows operating system. The information in the Prefetch file is usedfor optimizing the loading time of the application in the next time that you run it.<br>WinPrefetchView is a small utility that reads the Prefetch files stored in your system and displays the information stored in them.By looking in these files, you can learn which files every application is using, and which files are loaded on Windows boot.<br>
1678. [NirSoft/WinsockServicesView](https://www.nirsoft.net/utils/winsock_service_providers.html) This utility displays the details of all Winsock service providers installed on your system.For every Winsock service, the following information is displayed: Display Name, Status (Enabled/Disabled), DLL Type (32-bit or 64-bit), DLL Filename, DLL Description/Version, andCreated/Modified Time.<br>WinsockServicesView also allows you to easily disable/enable a Winsock service provider.
1679. [NirSoft/WinUpdatesList](https://www.nirsoft.net/utils/wul.html) WinUpdatesList displays the list of all Windows updates (Service Packs and Hotfixes)installed on your local computer. For hotfix updates, this utility also displays thelist of files updated with these hotfixes.In addition, it allows you to instantly open the Web link in Microsoft Web site thatprovides more information about the selected update, uninstall an update, copy the update information to theclipboard, or save it to text/HTML/XML file.
1680. [NirSoft/Wireless Network Watcher](https://www.nirsoft.net/utils/wireless_network_watcher.html) Wireless Network Watcher is a small utility that scans your wireless network and displays the list of all computers and devices that are currently connected toyour network.<br>For every computer or device that is connected to your network, the following informationis displayed: IP address, MAC address, the company that manufactured the network card,and optionally the computer name.<br>You can also export the connected devices list into html/xml/csv/text file, or copy the listto the clipboard and then paste into Excel or other spreadsheet application.
1681. [NirSoft/WirelessConnectionInfo](https://www.nirsoft.net/utils/wireless_connection_information.html) WirelessConnectionInfo is a simple tool for Windows Vista/7/8/2008 that displays general information and statistics about the active wifi connection, including theSSID, BSSID, PHY Type, Signal Quality, Receiving rate, Transmission Rate, Authentication Algorithm, Channel Number, Total number oftransmitted/received frames, and more...
1682. [NirSoft/WirelessKeyView](https://www.nirsoft.net/utils/wireless_key.html) WirelessKeyView recovers all wireless network security keys/passwords (WEP/WPA) stored in your computer by the 'Wireless Zero Configuration' service of Windows XP or by the 'WLAN AutoConfig' service of Windows Vista, Windows 7, Windows 8, Windows 10, and Windows Server 2008.It allows you to easily save all keys to text/html/xml file, or copy a single key to the clipboard.You can also export your wireless keys into a file and import these keys into another computer.
1683. [NirSoft/WirelessNetConsole](https://www.nirsoft.net/utils/wireless_net_console.html) WirelessNetConsole is a small console application that dumps all current detected wireless networks information into the standard output.For each wireless network, the following information is displayed: SSID, Signal Quality in %, PHY types, RSSI, MAC Address, Channel Frequency, and more.
1684. [NirSoft/WirelessNetView](https://www.nirsoft.net/utils/wireless_network_view.html) WirelessNetView is a small utility that runs in the background, and monitor the activity of wireless networks around you.For each detected network, it displays the following information: SSID, Last Signal Quality, Average Signal Quality, Detection Counter, Authentication Algorithm, Cipher Algorithm, MAC Address, RSSI, Channel Frequency, Channel Number, and more.
1685. [NirSoft/ZipInstaller](https://www.nirsoft.net/utils/zipinst.html) The ZipInstaller utility installs and uninstalls applicationsand utilities that do not provide an internal installation program.It automatically extracts all files from the Zip file, copies them tothe destination folder you select, creates shortcuts in the start menuand in your desktop, and adds an uninstall module to allow you to automatically remove the software in the future.
1686. [Nocturn](https://github.com/k0kubun/Nocturn/releases/latest) [23/660/58] Multi-platform Twitter Client built with React, Redux and Electron
1687. [Nodejs](https://nodejs.org/en/download/current/)
1688. [Nomad.NET](https://www.softpedia.com/get/System/File-Management/Nomad-NET.shtml) A lightweight, yet powerful file manager that allows you to organize your documents in a convenient way by providing you with multiple useful functions
1689. [noMeiryoUI](https://github.com/Tatsu-syo/noMeiryoUI/releases/latest) [11/305/14] No!! MeiryoUI is Windows system font setting tool on Windows 8.1/10.
1690. [Notable](https://github.com/notable/notable/releases/latest) [135/10,134/414] The markdown-based note-taking app that doesn't suck.
1691. [NoteExpress](http://www.inoteexpress.com/aegean/index.php/home/ne/index.html) :money_with_wings:
1692. [notepad++](https://notepad-plus-plus.org/download/)
1693. [notepad2-mod](https://github.com/XhmikosR/notepad2-mod/releases/latest) [132/1,058/199] LOOKING FOR DEVELOPERS - Notepad2-mod, a Notepad2 fork, a fast and light-weight Notepad-like text editor with syntax highlighting
1694. [Notezilla](https://www.conceptworld.com/Notezilla/Portable) :money_with_wings:
1695. [Notion](https://www.notion.so/desktop) [Free Personal]
1696. [Noty](https://github.com/fabiospampinato/noty/releases/latest) [8/225/11] Autosaving sticky note with support for multiple notes without needing multiple windows.
1697. [Now Desktop](https://github.com/zeit/now-desktop/releases/latest) [34/1,150/162] Create deployments right from the tray menu.
1698. [Npcap](https://nmap.org/npcap/dist/)
1699. [nps](https://github.com/cnlh/nps/releases/latest) [113/3,492/480] 一款轻量级、功能强大的内网穿透代理服务器。支持tcp、udp流量转发，支持内网http代理、内网socks5代理，同时支持snappy压缩、站点保护、加密传输、多路复用、header修改等。支持web图形化管理，集成多用户模式。
1700. [NSIS](https://nsis.sourceforge.io/Download)
1701. [NTLite](https://www.ntlite.com/download/) [Free Personal] :airplane:
1702. [NTWind/Alt-Tab Terminator](https://www.ntwind.com/software/alttabter.html)
1703. [NTWind/Bad Application](https://www.ntwind.com/software/utilities/badapp.html)
1704. [NTWind/Close All](https://www.ntwind.com/software/utilities/close-all.html)
1705. [NTWind/Hidden Start](https://www.ntwind.com/software/hstart.html) :money_with_wings:
1706. [NTWind/Sticky Previews](https://www.ntwind.com/software/sticky-previews.html) :money_with_wings:
1707. [NTWind/Visual Subst](https://www.ntwind.com/software/utilities/visual-subst.html)
1708. [NTWind/WinCam](https://www.ntwind.com/software/wincam.html) :money_with_wings:
1709. [NTWind/WindowSpace](https://www.ntwind.com/software/windowspace.html) :money_with_wings:
1710. [NTWind/WinSnap](https://www.ntwind.com/software/winsnap.html) :money_with_wings:
1711. [Nuclear](https://github.com/nukeop/nuclear/releases/latest) [114/4,603/317] Desktop music player for streaming from free sources
1712. [Numculator](https://www.softpedia.com/get/PORTABLE-SOFTWARE/Education/Portable-Numculator.shtml) A calculator that is always at your disposal, enabling you to perform all sorts of calculations, from simple additions to complex expressions
1713. [Nurgo/AquaSnap](https://www.nurgo-software.com/company/news/13-aquasnap) [Freemium]
1714. [Nurgo/GameLibBooster](https://www.softpedia.com/get/Gaming-Related/GameLibBooster.shtml) :money_with_wings: Optimize your Steam games library by turning to this comprehensive app that packs a user-friendly interface and a helpful assistant
1715. [Nurgo/TidyTabs](https://www.nurgo-software.com/company/news/20-tidytabs) [Freemium]
1716. [Nutstore](https://www.jianguoyun.com/s/downloads)
1717. [NVCleanstall](http://www.majorgeeks.com/mg/getmirror/nvcleanstall,1.html) NVCleanstall is a free and portable app that can detect your NVIDIA graphics card and driver version, then let you decide what part of the latest drivers package you install.
1718. [NVSlimmer](http://www.majorgeeks.com/mg/getmirror/nvslimmer,1.html) NVSlimmer is a freeware tool to remove and customize included programs and settings bundled with your NVIDIA driver package. You can then repackage your drivers or apply and install.
1719. [ocenaudio](https://www.ocenaudio.com/)
1720. [odrive Sync](https://forum.odrive.com/c/release-notes) [Free Personal]
1721. [ODrive](https://github.com/liberodark/ODrive/releases/latest) [33/537/69] Google Drive GUI for Windows / Mac / Linux.
1722. [Office Tool Plus](https://mirrors.yuntu.ca/office-tool/)
1723. [OhSoft/oCam](http://ohsoft.net/eng/ocam/download.php?cate=1002)
1724. [OhSoft/SecretFolder](http://ohsoft.net/eng/sfolder/download.php?cate=1005)
1725. [OhSoft/VirtualDVD](http://ohsoft.net/eng/vdvd/download.php?cate=1003)
1726. [oMega Commander](http://pylonos.com/omega/download) :money_with_wings:
1727. [One Commander](https://www.softpedia.com/get/File-managers/One-Commander.shtml) Browse through all your files and folders, move them to other locations, or manage documents by copying, moving or renaming them with ease
1728. [OnenoteTaggingKit](https://github.com/WetHat/OnenoteTaggingKit/releases/latest) :pushpin: [9/45/6] OneNote (desktop) add-in to manage OneNote pages by page tags
1729. [OnTopReplica](https://github.com/LorenzCK/OnTopReplica/releases/latest) [57/610/80] A real-time always-on-top “replica” of a window of your choice (on Windows).
1730. [OpalCalc](https://www.skytopia.com/software/opalcalc/history.html) :hand:
1731. [Open Broadcaster Software](https://obsproject.com/download)
1732. [Open++](https://www.softpedia.com/get/System/OS-Enhancements/Open.shtml) Add practical commands to your right-click menu, such as copy path, view checksums, run with arguments, register or unregister DLL, as well as create new commands
1733. [OpenEmu](https://github.com/OpenEmu/OpenEmu/releases/latest) [436/10,025/996] 🕹 Retro video game emulation for macOS.
1734. [OpenHardwareMonitor](https://openhardwaremonitor.org/downloads/)
1735. [OpenPaperWork](https://download.openpaper.work/windows/amd64/)
1736. [OpenShot](https://github.com/OpenShot/openshot-qt/releases/latest) [76/1,004/154] OpenShot Video Editor is an award-winning free and open-source video editor for Linux, Mac, and Windows, and is dedicated to delivering high quality video editing and animation solutions to the world.
1737. [OpenVPN](https://openvpn.net/community-downloads/) :airplane:
1738. [OpenWebMonitor](http://owm.fatecore.com/)
1739. [Opera](https://get.geo.opera.com/pub/opera/desktop/)
1740. [Outline](https://github.com/Jigsaw-Code/outline-client/releases/latest) [166/3,799/634] Outline clients, developed by Jigsaw. The Outline clients use the popular Shadowsocks protocol, and lean on the Cordova and Electron frameworks to support Windows, Android / ChromeOS, Linux, iOS and macOS.
1741. [Outlook Google Calendar Sync](https://github.com/phw198/OutlookGoogleCalendarSync/releases/latest) [48/632/91] Sync your Outlook and Google calendars.
1742. [Paint.NET](https://www.dotpdn.com/downloads/pdn.html)
1743. [Pale Moon](https://www.palemoon.org/)
1744. [PanDownload](http://pandownload.club/)
1745. [Paragon/APFS](https://www.softpedia.com/get/System/Hard-Disk-Utils/APFS-for-Windows.shtml) :money_with_wings: Enables you to browse Apple File System (APFS) formatted drives on a Windows computer, supporting hard disks, SSDs, and removable drives
1746. [Paragon/Image Mounter](https://www.softpedia.com/get/CD-DVD-Tools/Virtual-CD-DVD-Rom/Image-Mounter.shtml) Mount RAW and virtual disk images of various formats in read-only or read-write mode with the help of this easy to use application
1747. [Paragon/Linux File Systems](https://www.softpedia.com/get/System/System-Miscellaneous/Paragon-ExtFS.shtml) :money_with_wings: A specialized application that comes in handy to all users who want to be able to manage their ExtFS partitions from Windows, rather than Linux
1748. [Paragon/Paragon Backup & Recovery Free](https://www.softpedia.com/get/System/Back-Up-and-Recovery/Paragon-Drive-Backup-Express.shtml) A comprehensive and powerful backup and recovery application that enables you to perform incremental backups on external storage devices, discs or hidden partitions
1749. [Paragon/Paragon Disk Wiper Professional](https://www.softpedia.com/get/Security/Secure-cleaning/Paragon-Disk-Wiper-Personal.shtml) :money_with_wings: :hand: Erase sensitive data on your hard drive or from separate partitions quickly with the help of this straightforward, easy-to-use tool
1750. [Paragon/Paragon Hard Disk Manager](https://www.softpedia.com/get/System/Hard-Disk-Utils/Paragon-Hard-Disk-Manager.shtml) :money_with_wings: The high end all-in-one solution for hard disk management that brings a rich set of modules for backup, restore and disaster recovery scenarios
1751. [Paragon/Paragon HFS+](https://www.softpedia.com/get/System/Back-Up-and-Recovery/Paragon-HFS.shtml) :money_with_wings: Gain full access to Mac HFS+/HFSX file systems from any Microsoft Windows NTFS partitions, while enjoying a fast, reliable experience
1752. [Paragon/Paragon VM Backup](https://www.softpedia.com/get/System/Back-Up-and-Recovery/Paragon-VM-Backup.shtml) :money_with_wings: :hand: A backup utility for the VMware vSphere, which allows server administrators to create secure copies of all their virtual machines
1753. [PassMark/AppTimer](https://www.passmark.com/products/apptimer.htm)
1754. [PassMark/BatteryMon](https://www.passmark.com/products/batmon.htm) :money_with_wings:
1755. [PassMark/BurnInTest](https://www.passmark.com/products/bit_history.htm) :money_with_wings:
1756. [PassMark/DiskCheckup](https://www.passmark.com/products/diskcheckup.htm)
1757. [PassMark/ImageUSB](https://www.osforensics.com/tools/write-usb-images.html)
1758. [PassMark/KeyboardTest](https://www.passmark.com/products/keytest.htm) :money_with_wings:
1759. [PassMark/MonitorTest](https://www.passmark.com/products/monitortest.htm) :money_with_wings:
1760. [PassMark/OSFClone](https://www.osforensics.com/tools/create-disk-images.html)
1761. [PassMark/OSFMount](https://www.osforensics.com/tools/mount-disk-images.html)
1762. [PassMark/OSForensics](https://www.osforensics.com/download.html) :money_with_wings:
1763. [PassMark/PassMark Fragger](https://www.passmark.com/products/fragger.htm)
1764. [PassMark/PerformanceTest](https://www.passmark.com/products/pt_history.htm) :money_with_wings:
1765. [PassMark/RAMMon](https://www.passmark.com/products/rammon.htm)
1766. [PassMark/Rebooter](https://www.passmark.com/products/rebooter.htm)
1767. [PassMark/Sleeper](https://www.passmark.com/products/sleeper.htm)
1768. [PassMark/SoundCheck](https://www.passmark.com/products/soundcheck.htm)
1769. [PassMark/TestLog](http://www.testlog.com/) :money_with_wings:
1770. [PassMark/Volatility Workbench](https://www.osforensics.com/tools/volatility-workbench.html)
1771. [PassMark/WirelessMon](https://www.passmark.com/products/wirelessmonitor.htm) :money_with_wings:
1772. [PassMark/Zoom Search Engine](https://www.zoomsearchengine.com/zoom/index.html)
1773. [Password Safe](https://sourceforge.net/projects/passwordsafe/files/Windows/) Popular easy-to-use and secure password manager
1774. [Past](https://folk.uio.no/ohammer/past/)
1775. [PasteEx](https://github.com/huiyadanli/PasteEx/releases/latest) [30/389/37] :clipboard: Paste As File 把剪贴板的内容直接粘贴为文件.
1776. [Pcap_DNSProxy](https://github.com/chengr28/Pcap_DNSProxy/releases/latest) [217/2,369/439] Pcap_DNSProxy, a local DNS server based on packet capturing
1777. [PCHunter](http://www.xuetr.com/?p=191)
1778. [PeaExtractor](http://www.peazip.org/peaextractor-unace-unrar-unzip.html)
1779. [PeaUtils](http://www.peazip.org/peautils-hash-secure-delete.html)
1780. [PeaZip](https://github.com/giorgiotani/PeaZip/releases/latest) [30/206/28] Free Zip / Unzip software and Rar file extractor. Cross-platform file and archive manager. Features volume spanning, compression, authenticated encryption. Supports 7Z, 7-Zip sfx, ACE, ARJ, BZ2, CAB, CHM, CPIO, DEB, GZ, ISO, JAR, LHA/LZH, NSIS, OOo, PAQ/LPAQ, PEA, QUAD, RAR, RPM, split, TAR, Z, ZIP, ZIPX.
1781. [Pencil](http://pencil.evolus.vn/Downloads.html)
1782. [Persepolis Download Manager](https://github.com/persepolisdm/persepolis/releases/latest) [187/3,270/394] Persepolis Download Manager is a GUI for aria2.
1783. [pestudio](https://www.winitor.com/binaries.html)
1784. [PHP Desktop](https://github.com/cztomczak/phpdesktop) Develop desktop GUI applications using PHP, HTML5, JavaScript and SQLite - cztomczak/phpdesktop
1785. [PhraseExpress](https://www.phraseexpress.com/download.php) [Free Personal]
1786. [PicGo](https://github.com/Molunerfinn/PicGo/releases/latest) [82/4,738/367] :rocket:A simple & beautiful tool for pictures uploading built by electron-vue
1787. [Picosmos](http://www.pcfreetime.com/picosmos/index.php)
1788. [PicoTorrent](https://github.com/picotorrent/picotorrent/releases/latest) [46/892/80] A tiny, hackable BitTorrent client.
1789. [PicPick](https://picpick.app/zh/download) [Freemium]
1790. [Pidgin](https://www.pidgin.im/)
1791. [Piggydb](https://sourceforge.net/projects/piggydb/files/Piggydb/) Piggydb helps you have more fun with knowledge creation.
1792. [PinClipBoard](https://www.softpedia.com/get/Office-tools/Clipboard/PinClipBoard.shtml) A clipboard manager that not only remembers the clipboard history, but it enables you to pin important items you use most, including folders and pictures
1793. [Pingendo](https://github.com/Pingendo/pingendo/releases/latest) [3/9/0] Contribute to  development by creating an account on GitHub.
1794. [PiP-Tool](https://github.com/LionelJouin/PiP-Tool/releases/latest) [10/153/12] PiP tool is a software to use the Picture in Picture mode on Windows. This feature allows you to watch content (video for example) in thumbnail format on the screen while continuing to use any other software on Windows.
1795. [Piriform/CCleaner](https://www.ccleaner.com/ccleaner/download) [Free Personal]
1796. [Piriform/Defraggler](https://www.ccleaner.com/defraggler/download) [Freemium]
1797. [Piriform/Recuva](https://www.ccleaner.com/recuva/download) [Free Personal]
1798. [Piriform/Speccy](https://www.ccleaner.com/speccy/download) [Free Personal]
1799. [Pixia](http://www.ne.jp/asahi/mighty/knight/download.html) :hand:
1800. [Pixiv-Nginx](https://github.com/mashirozx/Pixiv-Nginx/releases/latest) [26/306/36] P站（Pixiv）的正确打开方式.
1801. [PixivBiu](https://biu.tls.moe/)
1802. [PixivDeck](https://github.com/akameco/PixivDeck/releases/latest) [17/306/27] :two_hearts: pixiv client for Desktop like TweetDeck :two_hearts:
1803. [PixivUtil2](https://github.com/Nandaka/PixivUtil2/releases/latest) [75/742/84] Download images from Pixiv and more!
1804. [Plane9](http://www.plane9.com/download)
1805. [Playback](https://github.com/seungjulee/playback/releases/latest) [1/2/261] Video player build using atom-shell and node.js.
1806. [PlexMediaPlayer](https://plex.tv/api/downloads/3.json)
1807. [PlexMediaServer](https://plex.tv/api/downloads/1.json)
1808. [PNotes](https://pnotes.sourceforge.io/index.php?page=5)
1809. [PNotes.NET](https://pnotes.sourceforge.io/index.php?page=5)
1810. [poi](https://github.com/poooi/poi/releases/latest) [108/1,291/334] Scalable KanColle browser and tool.
1811. [Polar Bookshelf](https://github.com/burtonator/polar-bookshelf/releases/latest) [64/2,964/133] Polar is a personal knowledge repository for PDF and web content supporting incremental reading and document annotation.
1812. [Pomodoro](https://github.com/G07cha/pomodoro/releases/latest) [13/177/31] Pomodoro time managment tool build with electron :tomato:
1813. [Pomotroid](https://github.com/Splode/pomotroid/releases/latest) [16/427/43] :tomato: Simple and visually-pleasing Pomodoro timer
1814. [PopMan](http://www.ch-software.de/popman/download.htm)
1815. [Portacle](https://github.com/portacle/portacle/releases/latest) [27/325/28] A portable common lisp development environment.
1816. [Postman](https://dl.pstmn.io/api/version/notes?channel=stable) [Free Personal]
1817. [PotPlayer](https://potplayer.daum.net/)
1818. [Power Manager](https://www.apreltech.com/PowerManager) :money_with_wings:
1819. [PowerISO](http://www.poweriso.com/download.php)
1820. [PPGhost](https://pro.25pp.com/updatelog_40.html)
1821. [PPHelper](https://pro.25pp.com/)
1822. [PPHelper5o](https://pro.25pp.com/ppad_zj/)
1823. [Preme](https://www.softpedia.com/get/System/OS-Enhancements/Preme.shtml) :hand: Manipulate the behavior of windows, create keyboard shortcuts to quickly launch applications, change the layout of the keyboard, and more
1824. [Prepros](https://prepros.io/downloads) [Freemium]
1825. [Private Tunnel](https://www.privatetunnel.com/apps/) [Free Personal]
1826. [PrivaZer](https://privazer.com/download.php)
1827. [Privoxy](https://sourceforge.net/projects/ijbswa/files/Win32/) HTTP proxy to block ads and customize webpages
1828. [Process Lasso](https://bitsum.com/) [Free Personal]
1829. [ProcessHacker](https://github.com/processhacker/processhacker/releases/latest) [183/2,202/432] A free, powerful, multi-purpose tool that helps you monitor system resources, debug software and detect malware.
1830. [Proton](https://github.com/steventhanna/proton/releases/latest) [7/131/16] A stand-alone application to quickly preview and edit Markdown files using Electron.
1831. [ProtonMail](https://github.com/protonmail-desktop/application/releases/latest) [31/363/41] :envelope: Unofficial Electron wrapper for ProtonMail
1832. [ProtonVPN](https://protonvpn.com/download/win-update.json) [Free Personal] :airplane:
1833. [Proxifier](https://www.proxifier.com/) :money_with_wings:
1834. [Proxyee Down](https://github.com/proxyee-down-org/proxyee-down/releases/latest) [957/23,687/4,250] http下载工具，基于http代理，支持多连接分块下载.
1835. [Psiphon](https://www.softpedia.com/get/Security/Security-Related/Psiphon.shtml) Explore content restricted in your region due to various reasons and surf the Internet anonymously and without having to worry about your privacy with this app
1836. [PsQREdit](http://www.psytec.co.jp/freesoft/01/)
1837. [Publii](https://getpublii.com/download/)
1838. [PupaFM](https://github.com/xwartz/PupaFM/releases/latest) [12/338/53] 🎵 douban.fm Music Desktop Player.
1839. [Pushbullet](https://github.com/sidneys/pb-for-desktop/releases/latest) [18/353/24] The missing Desktop application for Pushbullet.
1840. [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
1841. [PyBingWallpaper](https://github.com/genzj/pybingwallpaper/releases/latest) [38/363/84] Download wallpaper from bing.com.
1842. [PyScripter](https://sourceforge.net/projects/pyscripter/files/) Python IDE
1843. [Python](https://www.python.org/downloads/windows/)
1844. [Python2](https://www.python.org/downloads/windows/)
1845. [QAQGame](https://www.qaqgame.com/)
1846. [qBittorrent](https://www.qbittorrent.org/download.php)
1847. [QEMU](https://qemu.weilnetz.de/w64/)
1848. [QOwnNotes](https://www.qownnotes.org/installation)
1849. [QTranslate](https://quest-app.appspot.com/)
1850. [QTTabBar](http://qttabbar.wikidot.com/) :hand:
1851. [Quassel](https://quassel-irc.org/downloads)
1852. [Quick Access Popup](https://www.quickaccesspopup.com/)
1853. [Quick Macros](http://quickmacros.com/download.html) :money_with_wings:
1854. [QuickLook](https://github.com/QL-Win/QuickLook/releases/latest) [147/3,439/276] Bring macOS “Quick Look” feature to Windows.
1855. [QuickViewer](https://github.com/kanryu/quickviewer/releases/latest) [19/213/29] A image/comic viewer application for Windows, Mac and Linux, it can show images very fast
1856. [QuiteRSS](https://quiterss.org/en/download)
1857. [Racket](https://download.racket-lang.org/)
1858. [RaiDrive](https://www.raidrive.com/download/)
1859. [Rainmeter](https://github.com/rainmeter/rainmeter/releases/latest) [167/1,804/395] Desktop customization tool for Windows.
1860. [Rambox](https://github.com/ramboxapp/community-edition/releases/latest) [163/4,541/547] Free and Open Source messaging and emailing app that combines common web applications into one.
1861. [Ramme](https://github.com/terkelg/ramme/releases/latest) [131/3,090/363] Unofficial Instagram Desktop App.
1862. [Rapid Environment Editor](https://www.rapidee.com/en/download)
1863. [Raven Reader](https://github.com/mrgodhani/raven-reader/releases/latest) [39/1,169/113] 📖 Simple RSS Reader app made using electron and vue.js
1864. [Raven](https://github.com/mrgodhani/raven-reader/releases/latest) [39/1,169/113] 📖 Simple RSS Reader app made using electron and vue.js
1865. [RBTray-Fork](https://github.com/benbuck/rbtray/releases) [6/108/17] A minor fork of RBTray from http://sourceforge.net/p/rbtray/code/.
1866. [RBTray](https://sourceforge.net/projects/rbtray/files/rbtray/) RBTray is a small Windows program that runs in the background and allows almost any window to be minimized to the system tray by right clicking its…
1867. [Rclone](https://github.com/ncw/rclone/releases/latest) [433/14,001/1,103] "rsync for cloud storage" - Google Drive, Amazon Drive, S3, Dropbox, Backblaze B2, One Drive, Swift, Hubic, Cloudfiles, Google Cloud Storage, Yandex Files
1868. [RDP Wrapper Library](https://github.com/stascorp/rdpwrap/releases/latest) [454/5,104/866] RDP Wrapper Library.
1869. [React-Proto](https://github.com/React-Proto/react-proto/releases/latest) [55/2,116/105] :art: React application prototyping tool for developers and designers.
1870. [Reacto](https://github.com/eveningkid/reacto/releases/latest) [38/842/53] A sweet IDE for React.js.
1871. [Reaper](https://www.reaper.fm/download.php) :money_with_wings:
1872. [RecentX](https://www.conceptworld.com/RecentX/RevisionHistory) :money_with_wings:
1873. [RedCrab](https://www.redcrab-software.com/en/RedCrab/Updates)
1874. [RedFox/Elby CloneBD](https://www.redfox.bz/en/download.html) :money_with_wings:
1875. [RedFox/Elby CloneDVD](https://www.redfox.bz/en/download.html) :money_with_wings:
1876. [RedFox/ReClock](https://www.redfox.bz/en/download.html)
1877. [RedFox/RedFox AnyDVD](https://www.redfox.bz/en/download.html) :money_with_wings:
1878. [RedFox/RedFox CloneCD](https://www.redfox.bz/en/download.html) :money_with_wings:
1879. [RedFox/RedFox CloneDVD mobile](https://www.redfox.bz/en/download.html) :money_with_wings:
1880. [RedFox/Virtual CloneDrive](https://www.redfox.bz/en/download.html)
1881. [RedNotebook](https://github.com/jendrikseipp/rednotebook/releases/latest) [27/245/57] RedNotebook is a cross-platform journal.
1882. [Redshift](https://github.com/jonls/redshift/releases/latest) [109/4,072/287] Redshift adjusts the color temperature of your screen according to your surroundings. This may help your eyes hurt less if you are working in front of the screen at night.
1883. [Registry Finder](http://registry-finder.com/)
1884. [Registry Workshop](http://www.torchsoft.com/en/download.html) :money_with_wings:
1885. [RegSeeker](http://www.hoverdesk.net/download.php) [Freemium]
1886. [Remote Utilities](https://www.remoteutilities.com/download/) [Free Personal]
1887. [ReMouse](https://www.remouse.com/downloads.html) [Free Personal]
1888. [Rename Expert](https://www.rename-expert.com/download.aspx) :money_with_wings:
1889. [Resonic](https://resonic.at/download) [Freemium]
1890. [Resource Hacker](http://www.angusj.com/resourcehacker/)
1891. [Resource Tuner](http://www.restuner.com/news-history.htm) :money_with_wings:
1892. [Revo Uninstaller Pro](https://www.softpedia.com/get/Tweak/Uninstallers/Revo-Uninstaller-Pro.shtml) :money_with_wings: A practical and useful utility that helps you to uninstall software and delete temporary files, remove usage tracks and other history items
1893. [Right Click Enhancer](https://rbsoft.org/downloads/right-click-enhancer/rce-changelog.html) [Free Personal]
1894. [Riot](https://riot-optimizer.com/)
1895. [RJ TextEd](https://www.softpedia.com/get/PORTABLE-SOFTWARE/Office/Suites-editors/Portable-RJ-TextEd.shtml) No-installer edition, fully-featured text and source editor with support for Unicode, C++, C#, Java, JavaScript, ASP, Perl and others
1896. [RMPrepUSB](https://www.rmprepusb.com/documents/release-2-0) :airplane:
1897. [RocketChat](https://github.com/RocketChat/Rocket.Chat.Electron/releases/latest) [103/696/325] Official  OSX, Windows, and Linux Desktop Clients for Rocket.Chat
1898. [RSS Guard](https://github.com/martinrotter/rssguard/releases/latest) [22/157/30] RSS Guard is simple (yet powerful) feed reader. This is the official project repository.
1899. [RSSOwlnix](https://github.com/Xyrio/RSSOwlnix/releases/latest) [24/46/113] RSSOwlnix is a fork of RSSOwl a powerful application to organize, search and read your RSS, RDF & Atom news feeds in a comfortable way. Highlights are saved searches, google reader sync, notifications, filters, fast fulltext search and a flexible, clean user interface.
1900. [RubyInstaller](https://github.com/oneclick/rubyinstaller2/releases/latest) [46/272/102] MSYS2 based RubyInstaller for Windows.
1901. [Rufus](https://rufus.ie/en_IE.html)
1902. [RunAny](https://github.com/hui-Zz/RunAny/releases/latest) [21/240/31] 【RunAny】一劳永逸的快速启动、多功能菜单、批量搜索、短语输出、热键映射、外接脚本.
1903. [Rutracker proxy](https://github.com/RutrackerOrg/rutracker-proxy/releases/latest) [63/577/47] rutracker proxy based on electron.
1904. [Sabaki](https://github.com/SabakiHQ/Sabaki/releases/latest) [66/865/150] An elegant Go board and SGF editor for a more civilized age.
1905. [SageThumbs](https://sourceforge.net/projects/sagethumbs/files/) Powerful Windows shell extension allowing to preview images.
1906. [Saladin](https://github.com/mimecorg/saladin/releases/latest) [4/11/0] Dual-pane file manager for Windows.
1907. [Saleen/FilePro](https://www.saleensoftware.com/FilePro) [Freemium] :hand:
1908. [Saleen/Folder Sync](https://www.saleensoftware.com/FolderSync) [Freemium] :hand:
1909. [Saleen/KeyboardExt](https://www.saleensoftware.com/KeyboardExt) [Freemium] :hand:
1910. [Saleen/ScanFs](https://www.saleensoftware.com/ScanFs) [Freemium] :hand:
1911. [Saleen/Tasks Manager](https://www.saleensoftware.com/TasksManager) [Freemium] :hand:
1912. [Saleen/Video Manager](https://www.saleensoftware.com/VideoManager) [Freemium] :hand:
1913. [Saleen/WebDownloader](https://www.saleensoftware.com/WebDownloader) [Freemium] :hand:
1914. [Sandman](https://github.com/alexanderepstein/Sandman/releases/latest) [20/497/25] An Application Built With Late Night Developers In Mind
1915. [SAO Utils](http://sao.gpbeta.com/)
1916. [SciHubEVA](https://github.com/leovan/SciHubEVA/releases/latest) [20/346/48] A Cross Platform Sci-Hub GUI Application.
1917. [SciTE4AutoHotkey](http://fincs.ahk4.net/scite4ahk/)
1918. [Screen Recorder](https://www.zdsoft.com/downloads.html)
1919. [ScreenToGif](https://github.com/NickeManarin/ScreenToGif/releases/latest) [293/7,040/807] 🎬 ScreenToGif allows you to record a selected area of your screen, edit and save it as a gif or video.
1920. [Seer](http://www.1218.io/seer/release-note.html)
1921. [shadowsocks-magic](https://github.com/ihciah/go-shadowsocks-magic/releases/latest) [6/143/14] A shadowsocks implementation in golang with Multi-connection Acceleration
1922. [shadowsocks-qt5](https://github.com/shadowsocks/shadowsocks-qt5/releases/latest) :hand: [435/6,476/2,040] A cross-platform shadowsocks GUI client.
1923. [shadowsocks](https://github.com/shadowsocks/shadowsocks-windows/releases) [2,378/37,122/12,503] If you want to keep a secret, you must also hide it from yourself.
1924. [ShadowsocksD](https://github.com/TheCGDF/SSD-Windows/releases/latest) [46/519/79] 一个依附于shadowsocks-windows的项目，跟随上游更新.
1925. [shadowsocksr-csharp](https://github.com/shadowsocksrr/shadowsocksr-csharp/releases) [516/6,371/2,558] Contribute to  development by creating an account on GitHub.
1926. [shadowsocksr-electron](https://github.com/erguotou520/electron-ssr/releases/latest) [211/5,445/1,153] Shadowsocksr client using electron.
1927. [Shareaza](https://sourceforge.net/projects/shareaza/files/Shareaza/) A universal P2P file sharing client for Windows
1928. [ShareX](https://github.com/ShareX/ShareX/releases/latest) [457/10,034/1,542] ShareX is a free and open source program that lets you capture or record any area of your screen and share it with a single press of a key. It also allows uploading images, text or other types of files to many supported destinations you can choose from.
1929. [Shellbag Analyzer & Cleaner](https://privazer.com/download-shellbag-analyzer-shellbag-cleaner.php)
1930. [Shiba](https://github.com/rhysd/Shiba/releases/latest) [25/634/31] Rich markdown live preview app with linter.
1931. [Shotcut](https://github.com/mltframework/shotcut/releases/latest) [149/2,288/261] cross-platform (Qt), open-source (GPLv3) video editor
1932. [ShowDesktopPerMonitor](https://github.com/CryptKat/ShowDesktopPerMonitor/releases/latest) [0/6/1] Emulates Win+D functionality for primary screen' windows only
1933. [ShowKeyPlus](https://github.com/Superfly-Inc/ShowKeyPlus/releases/latest) [37/307/64] Windows product key finder and validation checker.
1934. [Shuax-FireDoge](https://shuax.com/project/firedoge/)
1935. [Shuax-GreenChrome](https://shuax.com/project/greenchrome/)
1936. [Shuax-MouseInc](https://shuax.com/project/mouseinc/)
1937. [ShukuSen](http://www.pc6.com/softview/SoftView_60001.html)
1938. [Shuttle](https://github.com/sipt/shuttle/releases) [61/1,584/139] A web proxy in Golang with amazing features.
1939. [Sigil](https://github.com/Sigil-Ebook/Sigil/releases/latest) [243/2,732/403] Sigil is a multi-platform EPUB ebook editor.
1940. [Silent Install Builder](https://www.apreltech.com/SilentInstallBuilder) :money_with_wings:
1941. [Simple Sticky Notes](https://www.simplestickynotes.com/download/)
1942. [Simplenote](https://github.com/Automattic/simplenote-electron/releases/latest) [147/2,294/319] A Simplenote React app packaged via Electron for Windows and Linux
1943. [Siphonink](http://www.pc6.com/softview/SoftView_105138.html)
1944. [Sismics Reader](https://github.com/sismics/reader/releases/latest) [36/299/60] Free and open source feeds reader, including all major Google Reader features
1945. [Sizer](http://www.brianapps.net/sizer4/)
1946. [Skype](http://skype.gmw.cn/down/skype-for-windows-desktop.html)
1947. [Slack](https://slack.com/downloads/windows) [Free Personal]
1948. [SlickRun](https://bayden.com/SlickRun/updates.asp)
1949. [Slimjet](https://www.slimjet.com/en/dlpage.php)
1950. [SmartFTP](https://www.smartftp.com/en-us/download) :money_with_wings:
1951. [SmartGit](https://www.syntevo.com/smartgit/download/) [Freemium]
1952. [SmartSystemMenu](https://github.com/AlexanderPro/SmartSystemMenu/releases/latest) [4/29/3] SmartSystemMenu extends system menu of all windows in the system
1953. [SmartTaskbar](https://github.com/ChanpleCai/SmartTaskbar/releases/latest) [10/276/23] A Lightweight Windows Taskbar Enhancement Utility.
1954. [SMath Studio](https://en.smath.com/view/SMathStudio/summary)
1955. [SMPlayer](https://sourceforge.net/projects/smplayer/files/SMPlayer/) Free media player with support for Youtube
1956. [SmVDC++](https://sourceforge.net/projects/smvdc/files/) SmVDC++ is a client for the direct connect network based on StrongDC. The client is specially made for DC++ Reg-Hubs with nice Style.
1957. [Snappy Driver Installer Lite](https://sdi-tool.org/download/)
1958. [Snipaste](https://www.snipaste.com/download.html)
1959. [SocksCap64](https://www.softpedia.com/get/Security/Security-Related/SocksCap64.shtml) Seamless hide your IP address by configuring your applications to work through a specific SOCKS proxy servers, even if they do not have this feature, via this tool
1960. [Softany/CHM to DOC converter](http://www.softany.com/chm-to-doc/download.htm) :money_with_wings:
1961. [Softany/CHM to PDF converter](http://www.softany.com/chm-to-pdf/download.htm) :money_with_wings:
1962. [Softany/Txt2Htm2Chm](http://www.softany.com/txt2htm2chm/) :money_with_wings:
1963. [Softany/WinCHM Pro](http://www.softany.com/winchm/download.htm) :money_with_wings:
1964. [Softany/WordToHelp](http://www.softany.com/wordtohelp/download.htm) :money_with_wings:
1965. [SoftEtherVPN](https://github.com/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest) :hand: [59/434/154] SoftEther VPN (Stable Edition Repository): Open Cross-platform Multi-protocol VPN Software. This branch is officially managed by Daiyuu Nobori, the owner of SoftEther VPN Project. Pull requests should be sent to the Developer Edition Master Repository on https://github.com/SoftEtherVPN/SoftEtherVPN
1966. [Software Ideas Modeler](https://www.softwareideas.net/en/download)
1967. [SoftwareOK/12-Ants](https://www.softwareok.com/?Download=12-Ants)
1968. [SoftwareOK/AlwaysMouseWheel](https://www.softwareok.com/?Download=AlwaysMouseWheel)
1969. [SoftwareOK/AutoHideDesktopIcons](https://www.softwareok.com/?Download=AutoHideDesktopIcons)
1970. [SoftwareOK/AutoHideMouseCursor](https://www.softwareok.com/?Download=AutoHideMouseCursor)
1971. [SoftwareOK/AutoPowerOptionsOK](https://www.softwareok.com/?Download=AutoPowerOptionsOK)
1972. [SoftwareOK/BlankAndSecure](https://www.softwareok.com/?Download=BlankAndSecure)
1973. [SoftwareOK/ClassicDesktopClock](https://www.softwareok.com/?Download=ClassicDesktopClock)
1974. [SoftwareOK/ColorConsole](https://www.softwareok.com/?Download=ColorConsole)
1975. [SoftwareOK/CpuFrequenz](https://www.softwareok.com/?Download=CpuFrequenz)
1976. [SoftwareOK/Desktop.Calendar.Tray.OK](https://www.softwareok.com/?Download=Desktop.Calendar.Tray.OK)
1977. [SoftwareOK/DesktopDigitalClock](https://www.softwareok.com/?Download=DesktopDigitalClock)
1978. [SoftwareOK/DesktopNoteOK](https://www.softwareok.com/?Download=DesktopNoteOK)
1979. [SoftwareOK/DesktopOK](https://www.softwareok.com/?Download=DesktopOK)
1980. [SoftwareOK/DesktopSchneeFree](https://www.softwareok.com/?Download=DesktopSchneeFree)
1981. [SoftwareOK/DesktopSnowOK](https://www.softwareok.com/?Download=DesktopSnowOK)
1982. [SoftwareOK/DirPrintOK](https://www.softwareok.com/?Download=DirPrintOK)
1983. [SoftwareOK/DontSleep](https://www.softwareok.com/?Download=DontSleep)
1984. [SoftwareOK/ExperienceIndexOK](https://www.softwareok.com/?Download=ExperienceIndexOK)
1985. [SoftwareOK/FavoritenFreund](https://www.softwareok.com/?Download=FavoritenFreund)
1986. [SoftwareOK/Find.Same.Images.OK](https://www.softwareok.com/?Download=Find.Same.Images.OK)
1987. [SoftwareOK/FontViewOK](https://www.softwareok.com/?Download=FontViewOK)
1988. [SoftwareOK/GetWindowText](https://www.softwareok.com/?Download=GetWindowText)
1989. [SoftwareOK/IsMyHdOK](https://www.softwareok.com/?Download=IsMyHdOK)
1990. [SoftwareOK/IsMyLcdOK](https://www.softwareok.com/?Download=IsMyLcdOK)
1991. [SoftwareOK/KeepMouseSpeedOK](https://www.softwareok.com/?Download=KeepMouseSpeedOK)
1992. [SoftwareOK/LauschAngriff](https://www.softwareok.com/?Download=LauschAngriff)
1993. [SoftwareOK/MagicMouseTrails](https://www.softwareok.com/?Download=MagicMouseTrails)
1994. [SoftwareOK/MeinPlatz](https://www.softwareok.com/?Download=MeinPlatz)
1995. [SoftwareOK/MultiClipBoardSlots](https://www.softwareok.com/?Download=MultiClipBoardSlots)
1996. [SoftwareOK/NewFileTime](https://www.softwareok.com/?Download=NewFileTime)
1997. [SoftwareOK/NonCompressibleFiles](https://www.softwareok.com/?Download=NonCompressibleFiles)
1998. [SoftwareOK/OneLoupe](https://www.softwareok.com/?Download=OneLoupe)
1999. [SoftwareOK/OnlyStopWatch](https://www.softwareok.com/?Download=OnlyStopWatch)
2000. [SoftwareOK/PointerStick](https://www.softwareok.com/?Download=PointerStick)
2001. [SoftwareOK/ProcessKO](https://www.softwareok.com/?Download=ProcessKO)
2002. [SoftwareOK/Q-Dir](https://www.softwareok.com/?Download=Q-Dir)
2003. [SoftwareOK/QuickTextPaste](https://www.softwareok.com/?Download=QuickTextPaste)
2004. [SoftwareOK/Run-Command](https://www.softwareok.com/?Download=Run-Command)
2005. [SoftwareOK/StressMyPC](https://www.softwareok.com/?Download=StressMyPC)
2006. [SoftwareOK/TheAeroClock](https://www.softwareok.com/?Download=TheAeroClock)
2007. [SoftwareOK/ThisIsMyFile](https://www.softwareok.com/?Download=ThisIsMyFile)
2008. [SoftwareOK/TraceRouteOK](https://www.softwareok.com/?Download=TraceRouteOK)
2009. [SoftwareOK/WinBin2Iso](https://www.softwareok.com/?Download=WinBin2Iso)
2010. [SoftwareOK/WinPing](https://www.softwareok.com/?Download=WinPing)
2011. [SoftwareOK/WinScan2PDF](https://www.softwareok.com/?Download=WinScan2PDF)
2012. [SoftwareOK/Zigarettenschachtel-Spruch](https://www.softwareok.com/?Download=Zigarettenschachtel-Spruch)
2013. [SoLoud](http://sol.gfxile.net/soloud/downloads.html)
2014. [Sordum/AskAdmin](https://www.sordum.org/7941/) AskAdmin is a quick and practical solution to restrict (block) Applications from being executed in Windows , if you drag and drop any App , it will be blocked
2015. [Sordum/Backup Start Menu Layout](https://www.sordum.org/10997/) Backup Start menu layout is a portable freeware tool to Backup and Restore Start Menu layout, and even to Reset Start Menu to default settings in Windows 10
2016. [Sordum/BlueLife Hosts Editor](https://www.sordum.org/8266/) BlueLifeHosts editor is a Portable freeware application for editing windows Hosts file ,(easily add/delete , Block , Update domain names)
2017. [Sordum/BlueLife KeyFreeze](https://www.sordum.org/7921/) KeyFreeze is a basic keyboard locking tool that lets you lock a keyboard and mouse without locking the screen. Designed for children - not let them interact
2018. [Sordum/Bluetooth Version finder](https://www.sordum.org/10772/) Some of the features in Windows operating system is available only if you are running a specific or later version of Bluetooth. For instance, the Nearby Share , but How can you find out what version of bluetooth your laptop supports ? here is the answer
2019. [Sordum/Bpuzzle](https://www.sordum.org/8058/) bPuzzle is a simple game which is played by moving pieces one place to another(true) place , it is a Portable freeware
2020. [Sordum/Copy IP](https://www.sordum.org/9201/) Copy IP is a Portable freeware to find your İnternet IP address easily , after double click on it - you will see an information on the system tray
2021. [Sordum/Defender Control](https://www.sordum.org/9480/) In Windows 10 there is no option to completely turn off Windows Defender , Defender control is a Portable freeware to easily disable or enable Defender
2022. [Sordum/Defender Injector](https://www.sordum.org/10636/) To Add Exclusions for Windows Defender manually through the graphical user interface would be time consuming, tedious and, prone to human error .Defender Injector is a portable freeware to simplify the process through drag and drop or right click menü.
2023. [Sordum/Desktop.ini Editor](https://www.sordum.org/10084/) Desktop.ini editör is a portable freeware to simplify the Desktop.ini operations , it can help you to edit desktop.ini files , set custom folder icons usw.
2024. [Sordum/Dns Angel](https://www.sordum.org/8127/) DNS Angel , it will protect your family from inappropriate websites and will Block them Automatically it is Freeware and Portable
2025. [Sordum/Dns Jumper](https://www.sordum.org/7952/) DNS Jumper is a portable freeware App which makes changing your DNS settings as easy as clicking a button , it is the world's first IPv6 supported Dns tool
2026. [Sordum/Dns Lock](https://www.sordum.org/9432/) Dns Lock is a Portable freeware to keep ipv4/6 preferred DNS servers constant , it can help you to prevent TCP IPv4/6 DNS server addresses involuntary change
2027. [Sordum/Drive Letter Changer](https://www.sordum.org/8501/) Drive Letter Changer is a portable freeware to change and assign a specific drive letter to your drives or external devices easily , it has capability to change Assignet letter too , Drive Letter Changer has Cmd parameter support to simplify the whole process.
2028. [Sordum/Easy Context Menu](https://www.sordum.org/7615/) Easy Context Menu enables you to add a variety of useful commands and tweaks for the Desktop, My Computer, Drives ,File and folder context menus
2029. [Sordum/Easy Service Optimizer](https://www.sordum.org/8637/) Easy service optimizer (Eso) is a portable freeware to optimize Windows services , By disabling unnecessary services, the performance can be improved
2030. [Sordum/Edge Blocker](https://www.sordum.org/9312/) One of our followers has emailed us and asked a way to block Edge because his child use it in restricted Account , his Windows version was Windows 10 Home
2031. [Sordum/Find Prime Numbers](https://www.sordum.org/9207/) Find Prime Numbers is aportable freeware and aims to test how fast the CPU can search for Prime numbers between a given range , you can use one or all cpu
2032. [Sordum/Firewall App Blocker](https://www.sordum.org/8125/) With Firewall App Blocker you can Quickly allow or deny applications access to the internet through Windows Firewall. Traditionally, such a task requires that you perform a number of complex operations. FAB is a user-friendly and Portable freeware application.
2033. [Sordum/Fix Print Spooler](https://www.sordum.org/9199/) Fix print spooler is a portable freeware to solve printer queue has a stuck print job, Print spooler service has stopped, print spooler is not running errors
2034. [Sordum/Folder Painter](https://www.sordum.org/10124/) Folder Painter is an easy to use Portable Freeware program, which allows you to change the color of the icon representing a chosen folder to any color you like
2035. [Sordum/Hibernate Enable or Disable](https://www.sordum.org/9502/) There are two main reason to disable Hibernation ,to gain extra Gigabit HDD space back , the constant writing to the hibernate file may shorten the SSD life
2036. [Sordum/Hide From Uninstall List](https://www.sordum.org/11081/) Hide From Uninstall List is a Portable freeware Application to remove an item from the Programs And features list without uninstalling it,here is how to use it
2037. [Sordum/Net Disabler](https://www.sordum.org/9660/) Net Disabler is a small Porable freeware to quickly turn the Internet off or on again , it offer 3 Internet blocking methods and a password feature,download
2038. [Sordum/Ntfs Drive Protection](https://www.sordum.org/8117/) NTFS Drive Protection allows you to protect USB drive from viruses by enabling write protection function in Windows. it is a small portable freeware
2039. [Sordum/PowerRun](https://www.sordum.org/9416/) PowerRun is atool to launch regedit.exe , Cmd.exe or any program and script files with the same privileges as the TrustedInstaller /SYSTEM it is a freeware , Sometimes a registry key can be locked or not editable, PowerRun a tool with this powerfull privilege most likely solve that.
2040. [Sordum/Qemu Simple Boot](https://www.sordum.org/7763/) Qemu Simple Boot lets you to Boot ISO images without having to burn them to disc first , it is is a portable freeware virtualization tool
2041. [Sordum/Ratool](https://www.sordum.org/8104/) Ratool (Removable Access tool) is a very simple-to-use portable freeware Application which can help limit access to USB drives
2042. [Sordum/Rebuild Shell Icon Cache](https://www.sordum.org/9194/) Rebuild Shell Icon Cache is a potable freeware and it has ability to Refresh the Windows's icon cache , ,to use it just double click on it
2043. [Sordum/Reduce Memory](https://www.sordum.org/9197/) When running a program heavy on RAM, such as a game , RAM usage becomes more apparent as the computer slows down in performance to clear out the clutter from your system's memory and get it running smoothly again use "Reduce Memory" , it will free up your RAM.
2044. [Sordum/Reg Converter](https://www.sordum.org/8478/) Reg Converter is a Portable Freeware Utility to convert .reg data to .bat , vbs or .Au3 useful for those files which need administrative privileges
2045. [Sordum/Registry Key Jumper](https://www.sordum.org/8110/) Registry Key Jumper simplifies the navigation of the Windows registry, for example When you need open HKEY_LOCAL_MACHINE\ SYSTEM\ CurrentControlSet\ services , Just select the text for any Registry key , press Ctrl+Alt+X, and REGEDIT will open automatically at the appropriate location
2046. [Sordum/ReIcon](https://www.sordum.org/8366/) ReIcon is a very easy to use Portable freeware and solve Icons mess problem by allowing you to save your desktop layout and restore it later with the click of a button (or with the right-click context menu).
2047. [Sordum/Reset Data Usage](https://www.sordum.org/9817/) Many users who are on limited data plans prefer to reset or clear the data usage figures on the first day of the month,here is a portable Application for it
2048. [Sordum/Restart Explorer](https://www.sordum.org/9192/) Restart Explorer is a portable freeware to restart windows explorer in Small issues (Windows explorer freezes , you can not delete some files…)
2049. [Sordum/Router Default Password](https://www.sordum.org/10411/) Router Default Password is a Portable freeware to help people to find out any router default gateway ip adres ,default Username and Password. Have you forgotten your default router login details? use this utility to find it out easily.
2050. [Sordum/RunAsTool](https://www.sordum.org/8727/) RunAsTool is a Portable Freeware and Allows standard users run a specific program with admin privileges without the need to enter the admin pass each time, you can easily drag and drop any program(s) into the UI in order to give it admin privileges
2051. [Sordum/SendTo Menu Editor](https://www.sordum.org/10830/) SendTo Menu Editor is a Portable Freeware to tweak the Send to menu to suit your needs you can add any item to sendto menu or you can disable it completely.
2052. [Sordum/Show Desktop Icons](https://www.sordum.org/9341/) Show Desktop Icon is very Little tool to Add or hide common icons ( Internet Explorer, Computer, Network, Recycle Bin, Control Panel... ) on the desktop
2053. [Sordum/Show Disk Partition Style](https://www.sordum.org/9307/) For the novice users it is hard to determine Which partitioning scheme a particular disk is using and common question is "is there a easiest way to find out"
2054. [Sordum/Shut Down Windows](https://www.sordum.org/9205/) In previous Windows versions , the Shut Down Button location was different , Shut Down Windows is a potable freeware to bring the Shut Down Button back
2055. [Sordum/Simple Run Blocker](https://www.sordum.org/8486/) Simple Run Blocker is a Portable freeware to simplify the App. blocking process , by using drag and drop And Apply changes, the executables will be blocked
2056. [Sordum/Simple VHD  Manager](https://www.sordum.org/8705/) Simple VHD manager is aPortable Freeware to Permanently Attach a Virtual Hard Disk or Add a bootable VHD or ISO file to Boot menu
2057. [Sordum/Sordum Monitor Off](https://www.sordum.org/10104/) Sordum monitor off is a portable freeware to help you turn off your monitor in order to save some power, just run executable file to turn off your screen
2058. [Sordum/Sordum Random Password Generator](https://www.sordum.org/10946/) Sordum Random Password Generator is a portable freeware Application to generate most secure Password with one click,you can customize your passwords easily.
2059. [Sordum/Streams Remover](https://www.sordum.org/11263/) If you have multiple blocked files ,Streams Remover can help you to batch unlock all files at once in a directory and subdirectories. it is portable freeware
2060. [Sordum/Temp Cleaner](https://www.sordum.org/9190/) Temporary files are stored on the hard drive and they can fill up your TEMP folders, Temp Cleaner is a portable freeware to clean up your temp folder easily
2061. [Sordum/Tunnel Adapter Microsoft 6to4 Adapter Remover](https://www.sordum.org/6423/) Remove unwanted Tunnel Adapters easily with our Portable freeware utility it is very easy to use, just one click removes 6to4 adapters
2062. [Sordum/Update Time](https://www.sordum.org/9203/) Update Time will copy itself into start up folder and will Automatically update the System Date and System Time with a system tray mesage ,it is a freeware
2063. [Sordum/VHD For Context Menu](https://www.sordum.org/9209/) VHD for context menu is a portable freeware to create, attach and detach a VHD image file, it can add Attach and Detach options to right click menu
2064. [Sordum/WebCam On-Off](https://www.sordum.org/8585/) WebCam on-off is a Portable freeware to disable or Enable your webcam easily ,disabling your webcam completely is the safest way to protect your privacy.
2065. [Sordum/Win10 Settings Blocker](https://www.sordum.org/11128/) Win10 settings blocker is a portable freeware to block,unblock,hide, unhide,enable,disable or control visibility of the settings pages in the Windows 10.
2066. [Sordum/Windows TopMost Control](https://www.sordum.org/9182/) Some Windows Applications doesn't offer an option to make itself topmost , that is to keep it above all other windows , Topmost control can do that
2067. [Sordum/Windows Update Blocker](https://www.sordum.org/9470/) In Windows 10 There is no option to turn off Windows Updates. Windows Update Blocker is a tool that helps you to completely disable or enable Automatic Updates.
2068. [soundnode-app](https://github.com/Soundnode/soundnode-app/releases/latest) [167/4,422/612] Soundnode App is the Soundcloud for desktop. Built with Electron, Angular.js and Soundcloud API.
2069. [SourceTree](https://www.sourcetreeapp.com/)
2070. [SpaceRadar](https://github.com/zz85/space-radar/releases/latest) [24/891/56] Disk And Memory Space Visualization App built with Electron & d3.js
2071. [SpaceSniffer](http://www.uderzo.it/main_products/space_sniffer/download_alt.html)
2072. [SparkleShare](https://bitbucket.org/hbons/sparkleshare/downloads/)
2073. [SpeedCrunch](http://speedcrunch.org/download.html)
2074. [Speedify](https://www.softpedia.com/get/Internet/Other-Internet-Related/Speedify.shtml) :money_with_wings: Increase your Internet speed by taking advantage of all the connections you have available in order to be able to browse the web faster
2075. [SpeedPan](http://www.pc6.com/softview/SoftView_611279.html)
2076. [SPlayer](https://beta.splayer.org/)
2077. [Spreaker Studio](https://www.spreaker.com/download) [Free Personal]
2078. [Sqlectron](https://github.com/sqlectron/sqlectron-gui/releases/latest) [86/2,665/298] UNMAINTAINED - SEE BELOW. A simple and lightweight SQL client desktop with cross database and platform support.
2079. [SQLite](https://sqlite.org/download.html)
2080. [SQLiteStudio](https://sqlitestudio.pl/index.rvt?act=download)
2081. [Squid](http://squid.diladele.com/)
2082. [SRWare Iron](https://www.softpedia.com/get/Internet/Browsers/SRWare-Iron.shtml) A user-friendly Internet browser that combines the ease of use of Chrome's interface with enhanced privacy and security functions
2083. [SSTap](https://www.softpedia.com/get/Internet/Secure-Browsing-VPN/SSTap.shtml) Connect through a custom Proxy server with support for SOCKS 5, HTTP, and Shadowsocks to hide your IP while on the World Wide Web
2084. [Stack](https://rink.hockeyapp.net/apps/6037e69fa4944acc9d83ef7682e60732)
2085. [Standard Notes](https://github.com/standardnotes/desktop/releases/latest) [30/602/61] A free, open-source, and completely encrypted notes app. Mac, PC, & Linux app repository | https://standardnotes.org
2086. [Stardock/Acoustic Bridge](https://www.softpedia.com/get/Multimedia/Audio/Other-AUDIO-Tools/Acoustic-Bridge.shtml) :pushpin: A simple and intuitive application that you can use to send and receive audio between two different computers, at the single push of a button
2087. [Stardock/Central](https://www.softpedia.com/get/Internet/Download-Managers/Stardock-Central.shtml) :pushpin: Useful tool for easy management of Stardock products installed on the system, offering the possibility to update and register them
2088. [Stardock/Christmas SnowGlobe Countdown](https://www.softpedia.com/get/Desktop-Enhancements/Clocks-Time-Management/Snow-Globe-Countdown.shtml) Count down the number of days until Christmas, enhance the looks of your screen with the aid of a snow globe, and change the opacity of the snow globe
2089. [Stardock/CursorFX](https://www.softpedia.com/get/Tweak/System-Tweak/CursorXP.shtml) :pushpin: Make your default Windows cursor more attractive by choosing between over 12 anti-aliased 32-bit cursors, and create your own ones using a built-in theme editor
2090. [Stardock/Decor8](https://www.softpedia.com/get/Tweak/System-Tweak/Decor8.shtml) :money_with_wings: :pushpin: Customize your Windows 8 Start screen
2091. [Stardock/DeskScapes](https://www.softpedia.com/get/Desktop-Enhancements/Shell-Replacements/Stardock-DeskScapes.shtml) :pushpin: Animate your desktop background with customized images, make static wallpapers more lively and add interesting effects to your images
2092. [Stardock/Fences](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/Fences.shtml) :money_with_wings: :pushpin: Efficiently organize the icons on your desktop using containers that can be easily resized and moved, quickly hide all the icons, and create multiple desktop pages
2093. [Stardock/Groupy](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/Groupy.shtml) :money_with_wings: :pushpin: Groups multiple opened applications or documents together in a single window, displaying each of them in a separate tab for easier and faster access
2094. [Stardock/IconDeveloper](https://www.softpedia.com/get/Desktop-Enhancements/Icons-Related/IconDeveloper.shtml) :money_with_wings: :pushpin: Makes it a snap to create your own icons for Windows
2095. [Stardock/KeepSafe](https://www.softpedia.com/get/System/Back-Up-and-Recovery/KeepSafe.shtml) :money_with_wings: :pushpin: Protect and make copies of certain file types (e.g. DOC, DOCX, WPD, XLS, XLSX), store multiple file versions, and perform searches throughout the saved versions
2096. [Stardock/Launch8](https://www.softpedia.com/get/System/OS-Enhancements/Launch8.shtml) :money_with_wings: :pushpin: A user-friendly software solution that come in handy when you want to quickly launch your frequent applications from the Start screen
2097. [Stardock/ModernMix](https://www.softpedia.com/get/System/System-Miscellaneous/ModernMix.shtml) :pushpin: Run Metro apps in windowed mode and not in full screen using this application, so as to be able to minimize or maximize them whenever you want to
2098. [Stardock/Multiplicity](https://www.softpedia.com/get/Internet/Remote-Utils/Multiplicity.shtml) :money_with_wings: :pushpin: Control multiple computers with a single keyboard and mouse, share your clipboard, move files and directories, and use hotkeys for switching to other PCs
2099. [Stardock/ObjectBar](https://www.softpedia.com/get/System/OS-Enhancements/ObjectBar.shtml) :money_with_wings: :pushpin: A program that allows users to replace or extend their Windows Start bar
2100. [Stardock/ObjectDock](https://www.softpedia.com/get/Desktop-Enhancements/Themes/ObjectDock.shtml) :pushpin: Add a skinnable dock to your Windows desktop, enabling you to access frequently used applications and locations easily and quickly
2101. [Stardock/ShadowFX](https://www.softpedia.com/get/Desktop-Enhancements/Themes/ShadowFX.shtml) :money_with_wings: :pushpin: Add shadows to Windows 10 and 8 by resorting to this application that lets you come up with styles you can customize as you see fit
2102. [Stardock/SkinStudio](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/SkinStudio.shtml) :pushpin: Create GUIs for Windows
2103. [Stardock/SpaceMonger](https://www.softpedia.com/get/System/Hard-Disk-Utils/SpaceMonger.shtml) :money_with_wings: :pushpin: Analyze disk space to discover the largest files, study a pie chart and tree map, scan folders, Dropbox, Google Drive and OneDrive accounts, and more
2104. [Stardock/Start10](https://www.softpedia.com/get/System/OS-Enhancements/Start10.shtml) :money_with_wings: :pushpin: Make the Start Menu in Windows 10 resemble the one in Windows 7 using this reliable and customizable software utility that integrates within your OS
2105. [Stardock/Start8](https://www.softpedia.com/get/System/OS-Enhancements/Start8.shtml) :money_with_wings: :hand: Adds a Start Menu to Windows 8 to help you benefit from its advantages, while not compromising on the features you are accustomed with
2106. [Stardock/Tiles](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/Stardock-Tiles.shtml) :money_with_wings: :pushpin: A handy and easy to use piece of software designed to help you access your applications, shortcuts and documents with great ease
2107. [Stardock/WindowBlinds](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/WindowBlinds.shtml) :money_with_wings: :pushpin: Change the look of your system and customize the desktop appearance by modifying the style of windows, bars and buttons with this tool
2108. [Stardock/WindowFX](https://www.softpedia.com/get/System/OS-Enhancements/WindowFX.shtml) :money_with_wings: :pushpin: Supercharge your Windows experience by changing the way menus and windows open and close, customizing the right click menu, and more
2109. [StatusPilatus](https://github.com/PilatusDevs/StatusPilatus/releases/latest) [7/15/3] Monitor your PC like never before!
2110. [StaxRip](https://github.com/Revan654/staxrip/releases) [17/114/116] StaxRip is a video encoding app for Windows with a unrivaled feature set and usability.
2111. [SterJo/Browser Passwords](https://www.sterjosoft.com/browser-passwords.html) SterJo Browser Passwords is easy-to-use tool that recovers passwords for most popular web browsers like: Chrome, Firefox, Internet Explorer, Edge and Opera.
2112. [SterJo/Chrome History](https://www.sterjosoft.com/chrome-history.html) SterJo Chrome History is an easy-to-use tool for viewing all browsing history of Google Chrome browser.
2113. [SterJo/Chrome Passwords](https://www.sterjosoft.com/chrome-passwords.html) SterJo Chrome Passwords is a small utility able to reveal all passwords and usernames stored by Google Chrome. For each password it will show the URL and it will count how many times it has been used.
2114. [SterJo/Edge Passwords](https://www.sterjosoft.com/edge-passwords.html) SterJo Edge Passwords will reveal all passwords and usernames stored by Microsoft Edge browser. It would also display the URL, including the username and password for each entry.
2115. [SterJo/Facebook Blocker](https://www.sterjosoft.com/facebook-blocker.html) SterJo Facebook Blocker would prevent any browser from accessing Facebook with a simple click. While almost there is no person on Earth without a facebook account and spending too much time on it, sometimes there is no other way than blocking facebook completely.
2116. [SterJo/Facebook Password Finder](https://www.sterjosoft.com/facebook-password.html) SterJo Facebook Password Finder is free application designed to recover the password of your Facebook account saved by most web browsers. Almost every browser has an option to remember logins and save you a lot of time when you need to retype them. But sometimes you could easily forget facebook password especially if you change it often.
2117. [SterJo/Fast IP Scanner](https://www.sterjosoft.com/ip-scanner.html) SterJo Fast IP Scanner could be one of the world's fastest IP scanner available for free. This tool could ping any IP range with an incredible speed and get a response if the IP addresses are available.
2118. [SterJo/FileZilla Decryptor](https://www.sterjosoft.com/filezilla-decryptor.html) SterJo FileZilla Decryptor instantly recovers and decrypts forgotten FileZilla Passwords for all FTP sites stored by FileZilla Client. The application is lightweight and doesn't require much computer resources like CPU or RAM. Also it is very simple to use it and doesn't have any advanced settings. The interface is based on a small window where the passwords are decoded and has a few buttons only.
2119. [SterJo/Firefox History](https://www.sterjosoft.com/firefox-history.html) SterJo Firefox History is an easy-to-use tool for viewing all browsing history of Mozilla Firefox.
2120. [SterJo/Firefox Passwords](https://www.sterjosoft.com/firefox-passwords.html) SterJo Firefox Passwords could reveal all passwords and usernames stored by Mozilla Firefox. For each password it will show the URL and it will count how many times it has been used.
2121. [SterJo/Google Ad Blocker](https://www.sterjosoft.com/google-adblocker.html) SterJo Google Ad Blocker is a free ad blocker that could block google ads on any website. Even today it is difficult to find a website without google ads, sometimes it is really crucial to distinguish the advertisement from the actual content.
2122. [SterJo/Instagram Password Finder](https://www.sterjosoft.com/instagram-password.html) SterJo Instagram Password Finder is small and easy-to-use tool developed to recover the forgotten password of your Instagram account saved by web browsers. The application currently is able to retrieve login details stored by Google Chrome, Mozilla Firefox, Internet Explorer and Opera.
2123. [SterJo/Internet Explorer Passwords](https://www.sterjosoft.com/ie-passwords.html) SterJo Internet Explorer Passwords will reveal all passwords and usernames stored by Microsoft Internet Explorer. For each password it will show the URL and it will find the storage location.
2124. [SterJo/Key Finder](https://www.sterjosoft.com/key-finder.html) SterJo Key Finder is a small and FREE application that can recover lost product keys. All you have to do is run the program and it will find the keys for you in a few seconds. The software is currently able to recover a large number of keys like Microsoft Windows, Microsoft Office, WinZip, Corel Draw, CyberLink PowerDVD, Nero, VMWare Workstation, Techsmith Camtasia Studio, AUTOCAD and many more...
2125. [SterJo/Mail Passwords](https://www.sterjosoft.com/mail-passwords.html) SterJo Mail Passwords is a lightweight software that recovers forgotten mail passwords to Gmail, Yahoo, Hotmail, AOL, GMX, Zoho and some other free email services. Currently it supports the most used web browsers like Chrome, Firefox, Internet Explorer and Opera.
2126. [SterJo/NetStalker](https://www.sterjosoft.com/netstalker.html) SterJo NetStalker is innovative and FREE security software able to detect all authorized and unauthorized connections to your computer
2127. [SterJo/Opera Passwords](https://www.sterjosoft.com/opera-passwords.html) SterJo Opera Passwords reveals all passwords and usernames stored by Opera browser instantly. It displays the URL of each saved username and password including how many times it has been used.
2128. [SterJo/Password Unmask](https://www.sterjosoft.com/password-unmask.html) SterJo Password Unmask could reveal/unmask most of password text boxes containing hidden characters known as asterisk ('*****') immediately. Many applications like CuteFTP, Microsoft Outlook, other e-mail clients or login forms would save and hide their passwords with hidden chars to prevent others from seeing them. SterJo Password Unmask is not a classic password manager, but it is a simple and free password revealer, which is quite handy in cases like this where you need to find password.
2129. [SterJo/Startup Patrol](https://www.sterjosoft.com/startup-patrol.html) Often may happen your PC to run a little slower than usual. Don�t worry, it is nothing serious. You�ve probably installed some software that delayed the boot time. SterJo Startup Patrol allows you to view those files and disable them. This way you can optimize the Windows startup time but be careful not to disable some crucial programs you are using. By blocking those unneeded files the system will definitely run faster and smoother.
2130. [SterJo/Strong Password Generator](https://www.sterjosoft.com/strong-password.html) SterJo Strong Password Generator creates strong and random passwords based on the characters you want to use.
2131. [SterJo/Task Manager](https://www.sterjosoft.com/task-manager.html) FREE and advanced tool for process managing
2132. [SterJo/Twitter Password Finder](https://www.sterjosoft.com/twitter-password.html) SterJo Twitter Password Finder is lightweight Windows tool developed to recover the password of your Twitter account saved by most web browsers. The application is able to retrieve login details stored by Google Chrome, Mozilla Firefox, Internet Explorer and Opera.
2133. [SterJo/Weather Forecast](https://www.sterjosoft.com/weather.html) SterJo Weather Forecast is a simple and free app that shows the most current weather conditions.
2134. [SterJo/Windows Credentials](https://www.sterjosoft.com/windows-credentials.html) SterJo Windows Credentials is easy-to-use application developed to recover forgotten username and passwords stored by Credential Manager. The Credential Manager saves login credentials like Remote Desktop Connections or network authentication which could be used later when login is required without retyping them again
2135. [SterJo/Windows Vault Passwords](https://www.sterjosoft.com/windows-vault.html) SterJo Windows Vault Passwords will reveal all passwords from Windows Vault also known as Credential Manager. Some applications developed by Microsoft would store credentials like username and password to the Credential Manager and making it easy for the user when needed.
2136. [SterJo/Wireless Key Generator](https://www.sterjosoft.com/wireless-generator.html) SterJo Wireless Key Generator is a tool that generates strong WEP, WPA or WPA2 key for your wireless network that cannot be easily broken by intruders.
2137. [SterJo/Wireless Network Scanner](https://www.sterjosoft.com/network-scanner.html) SterJo Wireless Network Scanner is a small tool that scans your network in a few seconds and displays a list of all connected computers or devices. It also could detect a mobile or any other portable device that is already connected to your network.
2138. [SterJo/Wireless Passwords](https://www.sterjosoft.com/wireless-passwords.html) SterJo Wireless Passwords is FREE utility for recovering your lost wireless passwords of your network. All you have to do is run the program and allow it to scan your wireless network. The software will display all saved passwords which can be used to connect your other wireless devices without a fear of forgetting them in the future.
2139. [SterJo/YouTube Ad Blocker](https://www.sterjosoft.com/youtube-adblocker.html) SterJo YouTube Ad Blocker is very efficient tool for blocking annoying advertisements while playing youtube videos. This free ad blocker is compatible with any browser like Chrome, Mozilla, IE and etc. If you have ever wondered how to block youtube ads then you can't find more simpler way. Youtube ads will no longer be your problem and you can totally enjoy videos on youtube without ads with a simple mouse click only.
2140. [Stickies](https://www.zhornsoftware.co.uk/stickies/download.html)
2141. [Strawberry Perl](http://strawberryperl.com/releases.html)
2142. [Stremio](https://www.stremio.com/downloads) [Freemium]
2143. [Stress Processor](http://pylonos.com/sp/download) :money_with_wings:
2144. [stretchly](https://github.com/hovancik/stretchly/releases/latest) [33/1,058/153] break time reminder app.
2145. [StrokesPlus](https://www.softpedia.com/get/System/System-Miscellaneous/StrokesPlus.shtml) Associate user-defined mouse gestures to various operations (e.g. manage clipboard content, media files, windows, and web browsers)
2146. [StrokesPlus.net](https://www.strokesplus.net/Downloads)
2147. [StrongDC++](https://sourceforge.net/projects/strongdc/files/StrongDC%2B%2B/) This project allows connecting, file sharing and chatting in Direct Connect and ADC networks.
2148. [Sublime Text](http://www.sublimetext.com/3) [Free Personal]
2149. [SumatraPDF](https://www.sumatrapdfreader.org/sumatra.js)
2150. [SunlitGreen/Batch Photo Resizer](https://www.sunlitgreen.com/downloads.html)
2151. [SunlitGreen/BatchBlitz](https://www.sunlitgreen.com/downloads.html)
2152. [SunlitGreen/Photo Editor](https://www.sunlitgreen.com/downloads.html)
2153. [SunlitGreen/Photo Manager](https://www.sunlitgreen.com/downloads.html)
2154. [SwiftSearch](https://sourceforge.net/projects/swiftsearch/files/) Searches NTFS volumes almost instantly
2155. [SwitchHosts](https://github.com/oldj/SwitchHosts/releases/latest) [318/7,148/930] Switch hosts quickly!
2156. [SyncBack](https://www.2brightsparks.com/downloads.html) [Free Personal]
2157. [SyncFolders](http://www.syncfolders.elementfx.com/download.html)
2158. [Syncovery](https://www.syncovery.com/download/windows/) :money_with_wings:
2159. [Synergy](https://github.com/yupi2/synergy/releases/latest) [10/68/1,675] Share one buggy mouse and one buggy keyboard between multiple buggy computers.
2160. [Sysinternals/AccessChk](https://docs.microsoft.com/zh-cn/sysinternals/downloads/accesschk) AccessChk is a command-line tool for viewing the effective permissions on files, registry keys, services, processes, kernel objects, and more.
2161. [Sysinternals/AccessEnum](https://docs.microsoft.com/zh-cn/sysinternals/downloads/accessenum) This simple yet powerful security tool shows you who has what access to directories, files and Registry keys on your systems.
2162. [Sysinternals/Active Directory Explorer](https://docs.microsoft.com/zh-cn/sysinternals/downloads/adexplorer) Active Directory Explorer is an advanced Active Directory (AD) viewer and editor.
2163. [Sysinternals/AdRestore](https://docs.microsoft.com/zh-cn/sysinternals/downloads/adrestore) Undelete Server 2003 Active Directory objects.
2164. [Sysinternals/Autologon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/autologon) Bypass password screen during logon.
2165. [Sysinternals/Autoruns](https://docs.microsoft.com/zh-cn/sysinternals/downloads/autoruns) See what programs are configured to startup automatically when your system boots and you login.
2166. [Sysinternals/BgInfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/bginfo) This fully-configurable program automatically generates desktop backgrounds that include important information about the system.
2167. [Sysinternals/BlueScreen](https://docs.microsoft.com/zh-cn/sysinternals/downloads/bluescreen) This screen saver not only accurately simulates Blue Screens, but simulated reboots as well.
2168. [Sysinternals/CacheSet](https://docs.microsoft.com/zh-cn/sysinternals/downloads/cacheset) CacheSet is a program that allows you to control the Cache Manager&#x27s working set size using functions provided by NT.
2169. [Sysinternals/ClockRes](https://docs.microsoft.com/zh-cn/sysinternals/downloads/clockres) View the resolution of the system clock, which is also the maximum timer resolution.
2170. [Sysinternals/Contig](https://docs.microsoft.com/zh-cn/sysinternals/downloads/contig) Use Contig to optimize individual files, or to create new files that are contiguous.
2171. [Sysinternals/Coreinfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/coreinfo) Coreinfo is a command-line utility that shows you the mapping between logical processors and the physical processor.
2172. [Sysinternals/Ctrl2Cap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ctrl2cap) This is a kernel-mode driver that demonstrates keyboard input filtering in order to turn caps-locks into control keys.
2173. [Sysinternals/DebugView](https://docs.microsoft.com/zh-cn/sysinternals/downloads/debugview) This program intercepts calls made to DbgPrint by device drivers and OutputDebugString made by Win32 programs.
2174. [Sysinternals/Desktops](https://docs.microsoft.com/zh-cn/sysinternals/downloads/desktops) This utility enables you to create up to four virtual desktops and easily switch between them.
2175. [Sysinternals/Disk Usage](https://docs.microsoft.com/zh-cn/sysinternals/downloads/du) View disk usage by directory.
2176. [Sysinternals/Disk2vhd](https://docs.microsoft.com/zh-cn/sysinternals/downloads/disk2vhd) Disk2vhd simplifies the migration of physical systems into virtual machines.
2177. [Sysinternals/DiskExt](https://docs.microsoft.com/zh-cn/sysinternals/downloads/diskext) Display volume disk-mappings.
2178. [Sysinternals/DiskMon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/diskmon) This utility captures all hard disk activity or acts like a software disk activity light in your system tray.
2179. [Sysinternals/DiskView](https://docs.microsoft.com/zh-cn/sysinternals/downloads/diskview) Graphical disk sector utility.
2180. [Sysinternals/EFSDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/efsdump) View information for encrypted files.
2181. [Sysinternals/FindLinks](https://docs.microsoft.com/zh-cn/sysinternals/downloads/findlinks) FindLinks reports the file index and any hard links (alternate file paths on the same volume) that exist for the specified file.
2182. [Sysinternals/Handle](https://docs.microsoft.com/zh-cn/sysinternals/downloads/handle) This handy command-line utility will show you what files are open by which processes, and much more.
2183. [Sysinternals/Hex2dec](https://docs.microsoft.com/zh-cn/sysinternals/downloads/hex2dec) Convert hex numbers to decimal and vice versa.
2184. [Sysinternals/Insight for Active Directory](https://docs.microsoft.com/zh-cn/sysinternals/downloads/adinsight) An LDAP (Light-weight Directory Access Protocol) real-time monitoring tool aimed at troubleshooting Active Directory client applications.
2185. [Sysinternals/Junction](https://docs.microsoft.com/zh-cn/sysinternals/downloads/junction) Create Win2K NTFS symbolic links.
2186. [Sysinternals/LDMDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ldmdump) Dump the contents of the Logical Disk Manager&#x27s on-disk database, which describes the partitioning of Windows 2000 Dynamic disks.
2187. [Sysinternals/ListDLLs](https://docs.microsoft.com/zh-cn/sysinternals/downloads/listdlls) List all the DLLs that are currently loaded, including where they are loaded and their version numbers.
2188. [Sysinternals/LiveKd](https://docs.microsoft.com/zh-cn/sysinternals/downloads/livekd) Use Microsoft kernel debuggers to examine a live system.
2189. [Sysinternals/LoadOrder](https://docs.microsoft.com/zh-cn/sysinternals/downloads/loadorder) See the order in which devices are loaded on your WinNT&#x2F2K system.
2190. [Sysinternals/LogonSessions](https://docs.microsoft.com/zh-cn/sysinternals/downloads/logonsessions) List the active logon sessions on a system.
2191. [Sysinternals/NotMyFault](https://docs.microsoft.com/zh-cn/sysinternals/downloads/notmyfault) Notmyfault is a tool that you can use to crash, hang, and cause kernel memory leaks on your Windows system.
2192. [Sysinternals/NTFSInfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ntfsinfo) Use NTFSInfo to see detailed information about NTFS volumes.
2193. [Sysinternals/PageDefrag](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pagedefrag) Defragment your paging files and Registry hives.
2194. [Sysinternals/PendMovesand MoveFile](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pendmoves) Enumerate the list of file rename and delete commands that will be executed the next boot.
2195. [Sysinternals/PipeList](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pipelist) Displays the named pipes on your system, including the number of maximum instances and active instances for each pipe.
2196. [Sysinternals/Portmon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/portmon) Monitor serial and parallel port activity with this advanced monitoring tool.
2197. [Sysinternals/ProcDump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/procdump) This command-line utility is aimed at capturing process dumps of otherwise difficult to isolate and reproduce CPU spikes.
2198. [Sysinternals/Process Explorer](https://docs.microsoft.com/zh-cn/sysinternals/downloads/process-explorer) Find out what files, registry keys and other objects processes have open, which DLLs they have loaded, and more.
2199. [Sysinternals/Process Monitor](https://docs.microsoft.com/zh-cn/sysinternals/downloads/procmon) Monitor file system, Registry, process, thread and DLL activity in real-time.
2200. [Sysinternals/PsExec](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psexec) Execute processes on remote systems.
2201. [Sysinternals/PsFile](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psfile) See what files are opened remotely.
2202. [Sysinternals/PsGetSid](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psgetsid) 
2203. [Sysinternals/PsInfo](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psinfo) Obtain information about a system.
2204. [Sysinternals/PsKill](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pskill) Terminate local or remote processes.
2205. [Sysinternals/PsList](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pslist) Show information about processes and threads.
2206. [Sysinternals/PsLoggedOn](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psloggedon) Show users logged on to a system.
2207. [Sysinternals/PsLogList](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psloglist) Dump event log records.
2208. [Sysinternals/PsPasswd](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pspasswd) Changes account passwords.
2209. [Sysinternals/PsPing](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psping) Measure network performance.
2210. [Sysinternals/PsService](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psservice) View and control services.
2211. [Sysinternals/PsShutdown](https://docs.microsoft.com/zh-cn/sysinternals/downloads/psshutdown) Shuts down and optionally reboots a computer.
2212. [Sysinternals/PsSuspend](https://docs.microsoft.com/zh-cn/sysinternals/downloads/pssuspend) Suspend and resume processes.
2213. [Sysinternals/RAMMap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/rammap) An advanced physical memory usage analysis utility that presents usage information in different ways on its several different tabs.
2214. [Sysinternals/RegDelNull](https://docs.microsoft.com/zh-cn/sysinternals/downloads/regdelnull) Scan for and delete Registry keys that contain embedded null-characters that are otherwise undeleteable by standard Registry-editing tools.
2215. [Sysinternals/Registry Usage](https://docs.microsoft.com/zh-cn/sysinternals/downloads/ru) View the registry space usage for the specified registry key.
2216. [Sysinternals/RegJump](https://docs.microsoft.com/zh-cn/sysinternals/downloads/regjump) Jump to the registry path you specify in Regedit.
2217. [Sysinternals/RootkitRevealer](https://docs.microsoft.com/zh-cn/sysinternals/downloads/rootkit-revealer) Scan your system for rootkit-based malware.
2218. [Sysinternals/SDelete](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sdelete) Securely overwrite your sensitive files and cleanse your free space of previously deleted files using this DoD-compliant secure delete program.
2219. [Sysinternals/ShareEnum](https://docs.microsoft.com/zh-cn/sysinternals/downloads/shareenum) Scan file shares on your network and view their security settings to close security holes.
2220. [Sysinternals/ShellRunas](https://docs.microsoft.com/zh-cn/sysinternals/downloads/shellrunas) Launch programs as a different user via a convenient shell context-menu entry.
2221. [Sysinternals/Sigcheck](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sigcheck) Dump file version information and verify that images on your system are digitally signed.
2222. [Sysinternals/Streams](https://docs.microsoft.com/zh-cn/sysinternals/downloads/streams) Reveal NTFS alternate streams.
2223. [Sysinternals/Strings](https://docs.microsoft.com/zh-cn/sysinternals/downloads/strings) Search for ANSI and UNICODE strings in binary images.
2224. [Sysinternals/Sync](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sync) Flush cached data to disk.
2225. [Sysinternals/Sysmon](https://docs.microsoft.com/zh-cn/sysinternals/downloads/sysmon) Monitors and reports key system activity via the Windows event log.
2226. [Sysinternals/TCPView](https://docs.microsoft.com/zh-cn/sysinternals/downloads/tcpview) Active socket command-line viewer.
2227. [Sysinternals/VMMap](https://docs.microsoft.com/zh-cn/sysinternals/downloads/vmmap) VMMap is a process virtual and physical memory analysis utility.
2228. [Sysinternals/VolumeID](https://docs.microsoft.com/zh-cn/sysinternals/downloads/volumeid) Set Volume ID of FAT or NTFS drives.
2229. [Sysinternals/Whois](https://docs.microsoft.com/zh-cn/sysinternals/downloads/whois) See who owns an Internet address.
2230. [Sysinternals/WinObj](https://docs.microsoft.com/zh-cn/sysinternals/downloads/winobj) The ultimate Object Manager namespace viewer is here.
2231. [Sysinternals/ZoomIt](https://docs.microsoft.com/zh-cn/sysinternals/downloads/zoomit) Presentation utility for zooming and drawing on the screen.
2232. [SysinternalsSuite](https://docs.microsoft.com/en-us/sysinternals/downloads/sysinternals-suite) The Windows Sysinternals troubleshooting Utilities have been rolled up into a single suite of tools.
2233. [System Information Viewer](https://www.majorgeeks.com/mg/getmirror/siv_(system_information_viewer),1.html) SIV by is an app for displaying lots of useful Windows, network and hardware info.
2234. [System Ninja](https://singularlabs.com/software/system-ninja/confirm-download/) [Free Personal]
2235. [SystemExplorer](http://systemexplorer.net/downloading.php)
2236. [T-Clock](https://github.com/White-Tiger/T-Clock/releases/) [46/487/60] Highly configurable Windows taskbar clock.
2237. [Tabbles](https://tabbles.net/changelog/) [Free Personal]
2238. [TablacusExplorer](https://github.com/tablacus/TablacusExplorer/releases/latest) [23/200/40] A tabbed file manager with Add-on support.
2239. [TaggedFrog](http://lunarfrog.com/projects/taggedfrog/download)
2240. [TagScanner](https://www.xdlab.ru/en/download.htm)
2241. [TagSpaces](https://github.com/tagspaces/tagspaces/releases/latest) [Free Personal] [95/1,687/252] TagSpaces is an offline, open source, document manager with tagging support
2242. [Tagstoo](https://tagstoo.sourceforge.io/download.html)
2243. [TakeStock](https://ravib.com/takestock/2/relnotes.htm)
2244. [Task Coach](https://sourceforge.net/projects/taskcoach/files/taskcoach/) Free flexible open source todo manager featuring hierarchical tasks
2245. [Taskade](https://www.taskade.com/downloads)
2246. [Tea](https://haocha.co)
2247. [TeamSpeak](https://www.teamspeak.com/en/downloads/) [Free Personal]
2248. [TeamViewer](https://community.teamviewer.com/t5/Change-Log-Windows/bd-p/Change_Log_Windows) [Freemium]
2249. [Telegram](https://github.com/telegramdesktop/tdesktop/releases/latest) [633/9,465/2,285] Telegram Desktop messaging app.
2250. [Teleport Ultra](http://www.tenmax.com/teleport/version.htm) :money_with_wings:
2251. [Temps](https://github.com/jackd248/temps/releases/latest) [18/498/65] Simple menubar application based on Electron with actual weather information and forecast.
2252. [Tencent QQ](https://im.qq.com/pcqq/) :pushpin:
2253. [Tencent TIM](https://tim.qq.com/download.html) :pushpin:
2254. [Tencent WeGame](https://pc.qq.com/detail/1/detail_23761.html)
2255. [Teorex/Batch Inpaint](https://www.theinpaint.com/download.html) :money_with_wings:
2256. [Teorex/FolderIco](https://www.folderico.com/download.html) :money_with_wings:
2257. [Teorex/Inpaint](https://www.theinpaint.com/download.html) :money_with_wings:
2258. [Teorex/iResizer](https://www.iresizer.com/download.html) :money_with_wings:
2259. [Teorex/MultiView-Inpaint](https://www.theinpaint.com/download.html) :money_with_wings:
2260. [Teorex/PhotoScissors](https://www.photoscissors.com/download.html) :money_with_wings:
2261. [Teorex/PhotoStitcher](https://www.photostitcher.com/download.html) :money_with_wings:
2262. [TeraCopy](https://www.codesector.com/downloads) [Free Personal]
2263. [Terminus](https://github.com/Eugeny/terminus/releases/latest) [158/7,033/251] A terminal for a more modern age.
2264. [Termix](https://file.termix.io/) :money_with_wings: :airplane:
2265. [Teseve](https://github.com/teseve/teseve/releases/latest) [9/142/15] A simple static webserver, in an app.
2266. [TestDisk](https://www.cgsecurity.org/wiki/TestDisk_Download)
2267. [Text Editor Pro](https://texteditor.pro/pages/changes.php)
2268. [Textify](https://rammichael.com/downloads/textify_setup.exe?changelog)
2269. [Textosaurus](https://github.com/martinrotter/textosaurus/releases/latest) [10/119/22] Cross-platform text editor based on Qt and Scintilla.
2270. [The Bat](https://www.ritlabs.com/en/products/thebat/download.php) :money_with_wings:
2271. [The Powder Toy](https://powdertoy.co.uk/)
2272. [The Silver Searcher](https://github.com/k-takata/the_silver_searcher-win32/releases) [5/89/5] The silver searcher Win32 unofficial daily builds.
2273. [the-sz/Auburn](http://www.the-sz.com/products/auburn/) See your current earnings and get notified if you receive new earnings from Google AdSense, Amazon Associates and Bol.com.
2274. [the-sz/Bear](http://www.the-sz.com/products/bear/) See object usage for every process under Windows.
2275. [the-sz/Bedford](http://www.the-sz.com/products/bedford/) See all Bluetooth Low Energy device properties.
2276. [the-sz/Bennett](http://www.the-sz.com/products/bennett/) Monitor the signal strength of multiple Bluetooth devices.
2277. [the-sz/Carroll](http://www.the-sz.com/products/carroll/) Set for every user a different screen resolution. After logon, the screen resolution will be automatically changed.
2278. [the-sz/CDInfo](http://www.the-sz.com/products/cdinfo/) See all ISO descriptors from all attached cd-rom drives.
2279. [the-sz/CheckSum](http://www.the-sz.com/products/checksum/) Calculate a new checksum for a given PE image. This is needed for device drivers since Windows NT checks the checksum before loading the driver.
2280. [the-sz/Compton](http://www.the-sz.com/products/compton/) See the manufacturer details of your hard drives and solid state drives.
2281. [the-sz/Conroe](http://www.the-sz.com/products/conroe/) Get notified about your calendar items from GMail, Outlook, iCloud and Lotus iNotes.
2282. [the-sz/CPUGrabEx](http://www.the-sz.com/products/cpugrabex/) Slow down your computer by consuming CPU power.
2283. [the-sz/Doro](http://www.the-sz.com/products/doro/) The setup contains all what you need for creating colored pdf files for free.
2284. [the-sz/FlashBuilder](http://www.the-sz.com/products/flash/) Convert any SWF flash movie file into an executable without border and with animation & translucency.
2285. [the-sz/Grand](http://www.the-sz.com/products/grand/) See all sensor data on Windows 8 and Windows 7. Its event driven. The data will be automatically updated if something changes.
2286. [the-sz/Homedale](http://www.the-sz.com/products/homedale/) Monitor the signal strength of multiple Wi-Fi / WLAN Access Points.
2287. [the-sz/Howard](http://www.the-sz.com/products/howard/) Get notified about new mails in your outlook.com, gmail, yahoo, e.mail.ru, orange.fr, IBM / Lotus Notes, virgilio.it and zoho.com inbox.
2288. [the-sz/Malden](http://www.the-sz.com/products/malden/) See online status of other Skype users directly in your taskbar.
2289. [the-sz/Medford](http://www.the-sz.com/products/medford/) View Modbus registers from Modbus Slaves using Modbus RTU and TCP/IP
2290. [the-sz/Music&VideoDownloader](http://www.the-sz.com/products/lacey/) Download your favorite music from vkontakte.ru, YouTube and others. Just enter the song name and press 'Search'.
2291. [the-sz/Nassau](http://www.the-sz.com/products/nassau/) After start, a small icon near the clock is shown. The tooltip of this icon shows the username, computername and workgroup/domain. Further, for every network adapter, every ip, gateway and dns server address.
2292. [the-sz/Netchat](http://www.the-sz.com/products/netchat/) The program creates a icon near the clock in your taskbar. With a left or right mouseclick you can chat, send your clipboard or transfer a file.
2293. [the-sz/Parkdale](http://www.the-sz.com/products/parkdale/) Get the read and write speed from your harddisks, cdrom devices and network servers.
2294. [the-sz/PEPatch](http://www.the-sz.com/products/pe_patch/) Written to change the 'Subsystem Version' to write screensavers with preview in Borland C 4.5.
2295. [the-sz/Pictures on Map](https://www.the-sz.com/products/pictures_on_map/) View your Google Drive Geotagged Photos on a Map
2296. [the-sz/PortScan](http://www.the-sz.com/products/portscan/) Find all active devices on your network. PortScan shows all open ports and information about HTTP, FTP, SMTP, SNMP and SMB.
2297. [the-sz/Quartz](http://www.the-sz.com/products/quartz/) Dail a connection on startup and if you wanna, redail if this connection will be disconnected. Disconnect after a specified time period. [e.g. 23 hours] Automatic reconnect if specified.
2298. [the-sz/Redwood](http://www.the-sz.com/products/redwood/) View and extract resources from EXE, DLL, OCX, CPL or any other Windows 32 and 64 Bit PE file.
2299. [the-sz/RequestTrace](http://www.the-sz.com/products/rt/) Select on the left side the driver class which you want to trace. You can make a right click on a driver class to rebuild the driver stacks of this class.
2300. [the-sz/Richmond](http://www.the-sz.com/products/richmond/) Detect and read ISO 14443 and ISO 15693 NFC/RFID tags and see their content.
2301. [the-sz/Rimhill](http://www.the-sz.com/products/rimhillex/) This program sets the maximum cd-rom speed to a specified level in your drive.
2302. [the-sz/Royal](http://www.the-sz.com/products/royal/) Read posts on RSS feeds. This program checks on startup and periodically for new posts on RSS feeds.
2303. [the-sz/Seaside](http://www.the-sz.com/products/seaside/) Login into Skype with multiple Skype and Microsoft/MSN accounts.
2304. [the-sz/Sherwood](http://www.the-sz.com/products/sherwood/) View Modbus registers from Modbus Slaves using Modbus RTU and TCP/IP and build your simple SCADA system
2305. [the-sz/SkypeFocusFix](http://www.the-sz.com/products/skypefocusfix/) Set the focus automatically to the chat textbox of Skype
2306. [the-sz/Spencer](http://www.the-sz.com/products/spencer/) Bring back the Classic Windows XP Start Menu to Windows 8 & 10.
2307. [the-sz/SpyEx](http://www.the-sz.com/products/spyex/) Do you ever get annoyed by Visual Studio's SpyXX finding the correct window? SpyEx shows the real window icon!
2308. [the-sz/Stanley](http://www.the-sz.com/products/stanley/) Manage your Samsung EI-AN900A Samsung Activity Tracker using the Bluetooth Low Energy connection on your Windows computer.
2309. [the-sz/Temple](http://www.the-sz.com/products/temple/) See the details (vendor id and product id, serial number, device type, transfer speed) of your usb devices.
2310. [the-sz/VisualCVS](http://www.the-sz.com/products/visualcvs/) Do CVS/SVN operations like 'upload' and 'download' with one click.
2311. [the-sz/Yale](http://www.the-sz.com/products/yale/) See the bandwidth usage of all network adapters. Separated into up and down link. Additional the CPU usage and disk transfer rates are shown.
2312. [the-sz/York](http://www.the-sz.com/products/york/) Log source, destination and packet size of all network traffic on your network.
2313. [Thought Train](https://www.thoughttrain.cc/) :money_with_wings:
2314. [tinyMediaManager](https://release.tinymediamanager.org/download_v2.html)
2315. [TinyNvidiaUpdateChecker](https://github.com/ElPumpo/TinyNvidiaUpdateChecker/releases/latest) [15/411/21] Check for NVIDIA GPU driver updates!
2316. [TinyTask](https://www.tinytask.net/)
2317. [Tixati](https://www.tixati.com/download/windows64.html)
2318. [Toby](https://github.com/frankhale/toby/releases/latest) [8/125/14] A YouTube player for the desktop.
2319. [Tockler](https://github.com/MayGo/tockler/releases/latest) [13/171/30] Application that tracks your time by monitoring your active windows (only titles) and idle time.
2320. [ToDoList](https://abstractspoon.weebly.com/)
2321. [todometer](https://github.com/cassidoo/todometer/releases/latest) [36/787/93] A meter-based to-do list.
2322. [Tomboy](https://github.com/tomboy-notes/tomboy-ng/releases/latest) [15/66/9] Next generation of Tomboy.
2323. [Topsi Project Manager](https://github.com/Physiix/topsi-project-manager/releases/) [44/1,061/74] A Desktop Kanban board app.
2324. [Tor Browser](https://www.torproject.org/download/download-easy.html.en) :airplane:
2325. [TortoiseGit](https://tortoisegit.org/download/)
2326. [TortoiseSVN](https://tortoisesvn.net/downloads.html)
2327. [Toshocat](https://github.com/tofuness/Toshocat/releases/latest) [21/154/10] Anime and Manga list app for desktop.
2328. [Total Commander](https://www.ghisler.com/download.htm) [Free Personal]
2329. [Total Uninstall](https://www.martau.com/uninstaller-download.php) :money_with_wings:
2330. [Touchpad Blocker](https://touchpad-blocker.com)
2331. [Tower](https://www.git-tower.com/release-notes/windows) :money_with_wings:
2332. [traccar](https://github.com/traccar/traccar/releases/latest) [237/1,869/1,294] Traccar GPS Tracking System.
2333. [TrafficMonitor](https://github.com/zhongyang219/TrafficMonitor/releases/latest) [136/4,132/536] 这是一个用于显示当前网速、CPU及内存利用率的桌面悬浮窗软件，并支持任务栏显示，支持更换皮肤。.
2334. [TranslucentTB](https://github.com/TranslucentTB/TranslucentTB/releases/latest) [186/4,165/410] A lightweight utility that makes the Windows taskbar translucent/transparent.
2335. [Transmate](http://www.uedrive.com/products/standalone/)
2336. [Transmission](https://github.com/transmission/transmission/releases/latest) [142/2,840/495] Official Transmission BitTorrent client repository
2337. [Traymond](https://github.com/fcFn/traymond/releases/latest) [11/129/7] A simple Windows app for minimizing windows to tray icons
2338. [TreeView Player](https://www.softpedia.com/get/File-managers/Ubiquitous-Player.shtml) Play music, view image files, manage your notes, take screenshots and perform calculations, with this versatile software solution
2339. [Trendy](https://github.com/rhysd/Trendy/releases/latest) [7/164/7] Menubar app to keep you in the loop of GitHub trends :octocat:
2340. [Tribler](https://github.com/Tribler/tribler/releases/latest) [148/2,932/357] Privacy enhanced BitTorrent client with P2P content discovery
2341. [Trillian](https://www.trillian.im/shared/scripts/news.items.js) [Free Personal] :hand:
2342. [TriSunSoft/1Tree Pro](https://1tree.info/pro.htm) :money_with_wings:
2343. [TriSunSoft/1Tree](https://1tree.info/basic.htm)
2344. [TriSunSoft/5 Icons Income](http://huufs.com/5-icons-income.htm) :money_with_wings:
2345. [TriSunSoft/Access Password Recovery](https://www.trisunsoft.com/access-password-recovery/) :money_with_wings:
2346. [TriSunSoft/Advanced Date Time Calculator](https://www.trisunsoft.com/advanced-date-time-calculator/) :money_with_wings:
2347. [TriSunSoft/Advanced Recent Access](https://www.trisunsoft.com/advanced-recent-access/) :money_with_wings:
2348. [TriSunSoft/Auto Mail Sender Birthday Edition](https://www.automailsender.com/birthday-edition/) :money_with_wings:
2349. [TriSunSoft/Auto Mail Sender File Edition](https://www.automailsender.com/file-edition/) :money_with_wings:
2350. [TriSunSoft/Auto Mail Sender Standard Edition](https://www.automailsender.com/auto-mail-sender-standard-edition.htm) :money_with_wings:
2351. [TriSunSoft/Date Time Counter](https://www.trisunsoft.com/date-time-counter/)
2352. [TriSunSoft/Duplicate File Finder Mini](https://duplicatefilefinder4pc.com/duplicate-file-finder-free.htm)
2353. [TriSunSoft/Duplicate File Finder Plus](https://duplicatefilefinder4pc.com/duplicate-file-finder-plus.htm) :money_with_wings:
2354. [TriSunSoft/Duplicate MP3 Finder Plus](https://duplicatefilefinder4pc.com/duplicate-mp3-finder-plus.htm) :money_with_wings:
2355. [TriSunSoft/Duplicate Photo Finder Plus](https://duplicatefilefinder4pc.com/duplicate-photo-finder-plus.htm) :money_with_wings:
2356. [TriSunSoft/Easy Work Time Calculator](https://www.trisunsoft.com/easy-work-time-calculator/)
2357. [TriSunSoft/Email Checker Basic](https://www.automailsender.com/email-checker/basic.htm)
2358. [TriSunSoft/Email Checker Pro](https://www.automailsender.com/email-checker/p.htm) :money_with_wings:
2359. [TriSunSoft/File & Folder Lister](https://www.trisunsoft.com/file-folder-lister/)
2360. [TriSunSoft/KeyMusic](https://www.trisunsoft.com/key-music.htm) :money_with_wings:
2361. [TriSunSoft/NET WYSIWYG HTML Editor](https://www.trisunsoft.com/dotnet-wysiwyg-html-editor/)
2362. [TriSunSoft/PC WorkBreak ](https://www.trisunsoft.com/pc-work-break/) :money_with_wings:
2363. [TriSunSoft/PDF to DOC](https://www.pdf-helper.com/pdf-to-doc/) :money_with_wings:
2364. [TriSunSoft/PDF to HTML](https://www.pdf-helper.com/pdf-to-html/) :money_with_wings:
2365. [TriSunSoft/PDF to JPG](https://www.pdf-helper.com/pdf-to-jpg/) :money_with_wings:
2366. [TriSunSoft/PDF to Text](https://www.pdf-helper.com/pdf-to-text/) :money_with_wings:
2367. [TriSunSoft/PDF to X](https://www.pdf-helper.com/pdf-to-x/) :money_with_wings:
2368. [TriSunSoft/Process Guard for Developer](https://www.trisunsoft.com/process-guard-developer/)
2369. [TriSunSoft/tail for Windows](https://www.trisunsoft.com/tail-for-windows.htm) :money_with_wings:
2370. [TriSunSoft/VB 6 Pure Code Lines Calculator](https://www.trisunsoft.com/vb6-pure-code-lines-calculator/)
2371. [TriSunSoft/Visual Graph](https://www.trisunsoft.com/visual-graph/) :money_with_wings:
2372. [TriSunSoft/Windows Explorer Tracker](https://www.trisunsoft.com/windows-explorer-tracker/) :money_with_wings:
2373. [TriSunSoft/WinExt Batch Operator](https://www.trisunsoft.com/webo/) :money_with_wings:
2374. [TriSunSoft/WinExt Bulk Renamer](https://www.trisunsoft.com/webr/)
2375. [TriSunSoft/WinExt](https://www.trisunsoft.com/we/)
2376. [trolCommander](https://github.com/trol73/mucommander/releases/latest) [32/167/34] trolCommander - fork of muCommander file manager.
2377. [TunnelBear](https://www.tunnelbear.com/core/getVersionHistory?platform=pc) [Free Personal] :airplane:
2378. [Turtl](https://github.com/turtl/desktop/releases/latest) [33/473/31] Turtl's desktop app.
2379. [Tusk](https://github.com/klaussinani/tusk/releases/latest) [72/2,130/143] 🐘 Refined Evernote desktop app.
2380. [TVDownloader](https://www.softpedia.com/get/Internet/Download-Managers/TVDownloader.shtml) :hand: Quickly download videos from YouTube, Vimeo, DailyMotion and numerous other websites, with this lightweight and easy-to-use application
2381. [Twitch](https://www.softpedia.com/get/Internet/Chat/Other-Chat-Tools/Twitch-Desktop-App.shtml#download) :hand: Access Twitch, the most popular platform for social video gaming directly from your computer's desktop with the help of this smooth-running client app
2382. [Typetalk](https://www.softpedia.com/get/Internet/Chat/Instant-Messaging/Typetalk.shtml) [Free Personal] Efficiently collaborate with your team members from a secure and distraction-free environment with the help of this streamlined and cross-platform piece of software
2383. [Typora](https://typora.io/windows/dev_release.html)
2384. [Ubisoft Uplay](https://www.softpedia.com/get/Others/Fun/Uplay.shtml) Keep yourself up to date with the latest game-related news, buy and download new content to your PC and organize your games easily
2385. [Ubooquity](http://vaemendis.net/ubooquity/static2/download)
2386. [Udeler](https://github.com/FaisalUmair/udemy-downloader-gui/releases/latest) [150/1,954/489] A desktop application for downloading Udemy Courses
2387. [ueli](https://github.com/oliverschwendener/ueli/releases/latest) [22/385/40] This is a keystroke launcher for Windows and macOS.
2388. [uGet](https://ugetdm.com/downloads/windows/)
2389. [UltraExplorer](https://www.softpedia.com/get/File-managers/UltraExplorer.shtml) Effortlessly manage all files found on your computer with the help of this organizer that brings to the table lots of useful features
2390. [UltraISO](https://www.ultraiso.com/download.html)
2391. [ultraSurf](http://wujieliulan.com/) :airplane:
2392. [Uncolored](https://github.com/n457/Uncolored/releases/latest) [38/659/43] (Un)colored — Next generation desktop rich content editor that saves documents with themes. HTML & Markdown compatible. For Windows, OS X & Linux. — http://n457.github.io/Uncolored/
2393. [UNetbootin](https://github.com/unetbootin/unetbootin/releases/latest) [78/1,151/188] UNetbootin installs Linux/BSD distributions to a partition or USB drive
2394. [Universal Extractor 2](https://github.com/Bioruebe/UniExtract2/releases/latest) [93/633/93] Universal Extractor 2 is an unofficial updated and extended version of the original UniExtract by Jared Breland. It brings several hundred changes including community-wanted ones such as a batch mode, auto-updater and scan-only-functionality.
2395. [Universal Extractor mod by koros aka ya158](http://forum.oszone.net/thread-295084.html) :hand:
2396. [Unreal Commander](https://x-diesel.com/?download) [Free Personal]
2397. [UpdateStar](https://www.softpedia.com/get/System/System-Miscellaneous/UpdateStar.shtml) [Free Personal] Modern-looking application which enables you to quickly scan the contents of your computer, so as to inform you which programs require updates
2398. [upx](https://github.com/upx/upx/releases/latest) [186/3,760/450] UPX - the Ultimate Packer for eXecutables.
2399. [USBCopyer](https://github.com/kenvix/USBCopyer/releases/latest) [45/802/190] 😉 用于在插上U盘后自动按需复制该U盘的文件。”备份&偷U盘文件的神器”（写作USBCopyer，读作USBCopier）
2400. [UsbEAm Hosts Editor](https://www.dogfight360.com/Usbeam/Patch.php)
2401. [uTools](https://resource.u-tools.cn/version/latest.yml)
2402. [uTorrent](http://blog.utorrent.com/releases/windows/) [Free Personal]
2403. [v2ray](https://github.com/v2ray/v2ray-core/releases/latest) [904/15,686/3,465] A platform for building proxies to bypass network restrictions.
2404. [v2rayN](https://github.com/2dust/v2rayN/releases/latest) [205/3,187/847] Contribute to  development by creating an account on GitHub.
2405. [V2RayW](https://github.com/Cenmrev/V2RayW/releases) [56/747/188] GUI for v2ray-core on Windows.
2406. [Valve Steam](https://www.softpedia.com/get/Others/Fun/Valve-Steam.shtml) Play games on any computer using this client and an account, connect with friends, keep track of achievements, chat while playing, and more
2407. [VcXsrv](https://sourceforge.net/projects/vcxsrv/files/vcxsrv/) Windows X-server based on the xorg git sources (like xming or cygwin's xwin), but compiled with Visual C++ 2012 Express Edition. Source code can…
2408. [Velocity](https://velocity.silverlakesoftware.com/) [Free Personal]
2409. [VerySleepy](https://github.com/VerySleepy/verysleepy/releases/latest) [46/525/61] Very Sleepy, a polling CPU profiler.
2410. [Video Download Manager](https://github.com/ingbyr/VDM/releases/latest) [93/1,578/258] GUI for command-line video downloader (youtube-dl annie)
2411. [Video DownloadHelper Companion Application](https://github.com/mi-g/vdhcoapp/releases/latest) [35/229/45] Companion application for Video DownloadHelper browser add-on
2412. [Video Rotator](https://www.videorotator.com/download.html) :money_with_wings:
2413. [Videoder](https://www.videoder.com/download/videoder-for-windows?arch=64)
2414. [VirtualBox-Portable](http://www.vbox.me/changelog/)
2415. [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
2416. [VirtuaWin](https://sourceforge.net/projects/virtuawin/files/VirtuaWin/) Multiple desktops on a Windows box
2417. [VirusTotalContextMenu](https://github.com/Genbox/VirusTotalContextMenu/releases/latest) [1/11/0] A context menu that allows you to right click any file in Windows Explorer and scan it using Virus Total.
2418. [Visual Studio Code](https://github.com/Microsoft/vscode/releases) [2,755/75,956/10,364] Visual Studio Code.
2419. [VisualCppRedist AIO](https://github.com/abbodi1406/vcredist/releases/latest) [3/49/2] AIO Repack for latest Microsoft Visual C++ Redistributable Runtimes
2420. [Vivaldi](https://vivaldi.com/)
2421. [VLC Media Player](https://www.videolan.org/vlc/download-windows.html)
2422. [Vmd](https://github.com/yoshuawuyts/vmd/releases/latest) [16/1,011/89] :pray: preview markdown files.
2423. [VMware Workstation](https://www.vmware.com/) :money_with_wings:
2424. [VNote](https://github.com/tamlok/vnote/releases/latest) [196/4,537/448] A note-taking application that knows programmers and Markdown better.
2425. [VolPI](https://github.com/raymelon/VolPI/releases/latest) [1/8/1] Volume Percent Indicator: Your volume percentage etched on your system tray.
2426. [VoltMemo](http://www.voltmemo.com/chs/downloading.php?id=chs-en) :money_with_wings:
2427. [Volume2](https://irzyxa.blogspot.com/p/downloads.html)
2428. [VovSoft/3D Rolling Balls](https://vovsoft.com/software/3d-rolling-balls/) Avoid rolling balls and try to reach next level. Press arrow keys to move, space key to jump, ESC to exit.
2429. [VovSoft/Auto Change Screensavers](https://vovsoft.com/software/auto-change-screensavers/) :money_with_wings: A small desktop tool that will change your screensavers automatically. Auto Change Screensavers application allows you to automatically change your screensavers.
2430. [VovSoft/Baby Computer Fun](https://vovsoft.com/software/baby-computer-fun/) Let babies and toddlers have fun playing with the computer. Every time a key is pressed, a letter is drawn. Help kids to learn letters and provide a safe environment to have fun
2431. [VovSoft/Batch URL Downloader](https://vovsoft.com/software/batch-url-downloader/) :money_with_wings: Some of download managers may be more complex than some users would like. Batch URL Downloader is one of the simplest applications of its kind, so it can prove to be a good alternative to overly-complex download managers.
2432. [VovSoft/Blur Multiple Images](https://vovsoft.com/software/blur-multiple-images/) :money_with_wings: Add a blur effect to large numbers of image files in one quick operation, with the help of this lightweight utility.
2433. [VovSoft/Broken Link Detector](https://vovsoft.com/software/broken-link-detector/) :money_with_wings: Nobody likes a broken link. It is a bad experience for your web site visitors. Google recommends checking your site for broken links on a regular basis. Broken Link Detector runs a comprehensive scan that checks for broken links.
2434. [VovSoft/Burn Studio](https://vovsoft.com/software/burn-studio/) VOVSOFT Burn Studio is truly lightweight CD, DVD and Blu-ray burn utility at only 700 KB and does not include any of the fluff or overly complicated configuration that other burners contain.
2435. [VovSoft/Collect URL](https://vovsoft.com/software/collect-url/) :money_with_wings: Collect URL scans internet like a search engine bot. Starting from the user entered URL, it lists all the links on the URL. Then it recursively scans all the links in the list. User can limit Collect URL to collect single domain only.
2436. [VovSoft/Convert Video to Audio](https://vovsoft.com/software/convert-video-to-audio/) :money_with_wings: Extract audio from video files. Convert your video files to MP3 or WAV audio.
2437. [VovSoft/Copy Files Into Multiple Folders](https://vovsoft.com/software/copy-files-into-multiple-folders/) :money_with_wings: Copy one or multiple files to several folders, with or without overwriting existing content, with this lightweight, easy-to-use program.
2438. [VovSoft/CPU Monitor Gadget](https://vovsoft.com/software/cpu-monitor-gadget/) Simple little gadget for monitoring CPU performance from your desktop. It displays a real-time graph of CPU performance as well as current usage indicator. Features include user defined colors, transparency.
2439. [VovSoft/Daily Journal](https://vovsoft.com/software/daily-journal/) :money_with_wings: Daily Journal is a handy diary application that enables you to lock your account with a password, preventing others from accessing your private data. You can use it to write your memories, as well as save important appointments.
2440. [VovSoft/Disk Monitor Gadget](https://vovsoft.com/software/disk-monitor-gadget/) Simple little gadget for monitoring free disk space from your desktop. It displays a real-time information of disk usage. Features include user defined colors, transparency. Compact tool with tiny footprint.
2441. [VovSoft/Domain Checker](https://vovsoft.com/software/domain-checker/) :money_with_wings: Obtain domain name status information with this effective and intuitive application that allows you to batch process multiple entries. Domain Checker is a simple, but powerful whois lookup tool for users that require a domain availability analyzer.
2442. [VovSoft/Download Mailbox Emails](https://vovsoft.com/software/download-mailbox-emails/) :money_with_wings: Download all emails inside your mailbox into EML files. You get the emails from your Gmail, Hotmail or any private email account.
2443. [VovSoft/File Checksum Calculator](https://vovsoft.com/software/file-checksum-calculator/) A standalone utility that generates and verifies cryptographic hashes in MD5, SHA-1 and SHA-256. Cryptographic hash functions are commonly used to guard against malicious changes to protected data.
2444. [VovSoft/Filename Lister](https://vovsoft.com/software/filename-lister/) :money_with_wings: Get a list of all files, folders or both from any specified drive or directory with the help of this simple and straightforward application.
2445. [VovSoft/Find And Replace Multiple Files](https://vovsoft.com/software/find-and-replace-multiple-files/) :money_with_wings: A tool that caters to users who frequently work with text documents, giving them the possibility to seamlessly find and replace text across multiple files at the same time.
2446. [VovSoft/Health Break](https://vovsoft.com/software/health-break/) :money_with_wings: Take a break reminder software for long-time computer users. Remind yourself to get up and relax.
2447. [VovSoft/Hide Files](https://vovsoft.com/software/hide-files/) :money_with_wings: Secure your confidential files and folders. Hide Files is a folder-locker utility. You can encrypt and decrypt your sensitive documents, photo albums, videos, emails and any kind of data. You can password protect any secret or embarrassing files.
2448. [VovSoft/Image to PDF](https://vovsoft.com/software/image-to-pdf/) :money_with_wings: You can easily convert your image files to PDF with this software. Just add image files (JPEG, TIFF, PNG, GIF, BMP) to the list and click the Create PDF button, this software will directly convert them to a PDF document.
2449. [VovSoft/Keep Software Alive](https://vovsoft.com/software/keep-software-alive/) Some applications are prone to crash. This utility automatically restarts this kind of applications. All you have to do is to set check interval in seconds and select the applications you wish to restart.
2450. [VovSoft/Keyboard Lights](https://vovsoft.com/software/keyboard-lights/) View the current status of your Num Lock, Caps Lock and Scroll Lock keys in the system tray area whenever they are pressed, with this lightweight utility.
2451. [VovSoft/Match Pairs](https://vovsoft.com/software/match-pairs/) Match Pairs is a memory game which you need to match pair of cards. You can play the game against computer (CPU) or your friend. There are three computer difficulty choice. These are rookie, average and expert.
2452. [VovSoft/Math Practice](https://vovsoft.com/software/math-practice/) :money_with_wings: Math Practice is an easy to use software addressed to parents who wish to help kids make their first steps into the world of math. Choose between addition, subtraction, multiplication and division.
2453. [VovSoft/Network Alarmer](https://vovsoft.com/software/network-alarmer/) :money_with_wings: A lightweight software created to offer you the ability of verifying the availability of various network devices by checking their IP address and warning you through an email message or a phone call, when something goes off course.
2454. [VovSoft/Network Authenticator](https://vovsoft.com/software/network-authenticator/) Remote control client computers in your local network. Let network users login with username and password. Set login credentials on server side.
2455. [VovSoft/Open Multiple Files](https://vovsoft.com/software/open-multiple-files/) Working with multiple files, folders, apps or URLs at the same time can result in hectic situations. Open Multiple Files is an app which was developed for opening multiple files or folders simultaneously.
2456. [VovSoft/Photos to Video](https://vovsoft.com/software/photos-to-video/) :money_with_wings: Convert your photos into videos with music. Photos to Video helps you bringing pictures together to create a video file. You just have to load pictures on its interface with the order of appearance and that is all.
2457. [VovSoft/Prevent Disk Sleep](https://vovsoft.com/software/prevent-disk-sleep/) Prevent your primary, secondary or external hard disk drive or USB from going to sleep on a Windows computer.
2458. [VovSoft/Prime Number Counter](https://vovsoft.com/software/prime-number-counter/) A prime number (or a prime) is a natural number greater than 1 that has no positive divisors other than 1 and itself. Prime Number Counter is a small utility to calculate the prime numbers.
2459. [VovSoft/Print Multiple Web Pages](https://vovsoft.com/software/print-multiple-web-pages/) :money_with_wings: Batch print utility for HTML files and web sites. Several times you require printing multiple web pages simultaneously. To print multiple HTML pages at once, Vovsoft Print Multiple Web Pages is very handy.
2460. [VovSoft/RAM Monitor Gadget](https://vovsoft.com/software/ram-monitor-gadget/) Monitors how much RAM is being used.
2461. [VovSoft/Random Wordlist Generator](https://vovsoft.com/software/random-wordlist-generator/) Create random wordlists using different sets of characters.
2462. [VovSoft/Read Mode](https://vovsoft.com/software/read-mode/) :money_with_wings: Make long chunks of text easier to read.
2463. [VovSoft/Rename Multiple Files](https://vovsoft.com/software/rename-multiple-files/) :money_with_wings: Rename multiple files with just a few clicks. Rename multiple files at the same time by specifying renaming rules with using the original name, extension, custom text, and numbering. To begin a task, you can add as many files as you want to the list.
2464. [VovSoft/Retail Barcode](https://vovsoft.com/software/retail-barcode/) :money_with_wings: Retail Barcode is a lightweight cashier application that can help users keep track of products sales. The tool allows one to define customers, as well as to link product credit sales to individual clients.
2465. [VovSoft/Search Text in Files](https://vovsoft.com/software/search-text-in-files/) :money_with_wings: Easy-to-use file search application for power users. Search through text files using simple queries. Select directory, enter search text and filename filter, then click the Start button. All files including the search text will be listed.
2466. [VovSoft/Subtitle Renamer](https://vovsoft.com/software/subtitle-renamer/) You can easily rename subtitle filenames according to video filenames by using this software.
2467. [VovSoft/Text Edit Plus](https://vovsoft.com/software/text-edit-plus/) :money_with_wings: Text Edit Plus is a lightweight tool that enables users to easily create new text documents or modify existing ones. Dark mode, sort lines, generate word list, generate quick stats and many features.
2468. [VovSoft/Text Statistics Analyzer](https://vovsoft.com/software/text-statistics-analyzer/) :money_with_wings: Text Statistics Analyzer is a useful utility for generating quick stats of any text. Char, word and line statistics are available. You can also export the data into CSV file for further analysis.
2469. [VovSoft/Time Sync](https://vovsoft.com/software/time-sync/) Sync your clock with a time server by resorting to this minimalist app and make sure you are always in the know as to the passing of every single second.
2470. [VovSoft/VCF to CSV Converter](https://vovsoft.com/software/vcf-to-csv-converter/) :money_with_wings: In case you want to build a list of contacts in your address book, you can export the content of the VCF file. A dedicated software tool such as VCF to CSV Converter can help you in this regard.
2471. [VovSoft/VCF to TXT Converter](https://vovsoft.com/software/vcf-to-txt-converter/) :money_with_wings: Convert VCF files into text files and create a list of contacts in your address book. You can export the content of any VCF file. VCF to TXT Converter, a dedicated software tool, can help you in this regard.
2472. [VovSoft/VCF to XLS Converter](https://vovsoft.com/software/vcf-to-xls-converter/) :money_with_wings: Convert VCF files into Excel spreadsheets and create a list of contacts in your address book. You can export the content of any VCF file. VCF to XLS Converter, a dedicated software tool, can help you in this regard.
2473. [VovSoft/Visual Notes](https://vovsoft.com/software/visual-notes/) Create visual notes using this intuitive software. You save them to a file and load it any time.
2474. [VovSoft/Vov Alpha Blend](https://vovsoft.com/software/vov-alpha-blend/) :money_with_wings: Merge two images with transparency. Alpha blending (alpha compositing) is the process of combining an image with a background image to create the appearance of partial or full transparency.
2475. [VovSoft/Vov Disk Benchmark](https://vovsoft.com/software/vov-disk-benchmark/) :money_with_wings: Measure hard drive and SSD performance. The actual hard disk or SSD performance under Windows is determined not only by the speed of the drives rotation or memory chips, but several other factors also.
2476. [VovSoft/Vov Email Extractor](https://vovsoft.com/software/vov-email-extractor/) :money_with_wings: Vov Email Extractor is one of the best programs that can extract email addresses. You can extract emails from Google or any other web site by using it. Once installed, you can start the application and begin searching for e-mails almost immediately.
2477. [VovSoft/Vov EXE Joiner](https://vovsoft.com/software/vov-exe-joiner/) :money_with_wings: Easily join (bind) files (no matter their type) into one single executable.
2478. [VovSoft/Vov HTTP Requester](https://vovsoft.com/software/vov-http-requester/) :money_with_wings: Request GET and POST HTTP queries, displaying the inputs within its main window, and allowing you to import and export data in CSV format.
2479. [VovSoft/Vov Log Analyzer](https://vovsoft.com/software/vov-log-analyzer/) :money_with_wings: Many operating systems, software frameworks, and programs include a logging system. Vov Log Analyzer is a tool to analyze big log files.
2480. [VovSoft/Vov Music Player](https://vovsoft.com/software/vov-music-player/) Vov Music Player is a small, fast and efficient audio player which supports all popular audio formats like MP3, FLAC, OGG, WMA, WAV and more! Its icon is displayed in the system tray which can be used to play songs.
2481. [VovSoft/Vov Password Generator](https://vovsoft.com/software/vov-password-generator/) Create secure passwords using Vov Password Generator. The software allows you to generate random passwords.
2482. [VovSoft/Vov Picture Downloader](https://vovsoft.com/software/vov-picture-downloader/) :money_with_wings: Picture downloader software to find and download image files from the web easily.
2483. [VovSoft/Vov Podcast Downloader](https://vovsoft.com/software/vov-podcast-downloader/) :money_with_wings: Download podcast files to your computer quickly and easily. Podcast subscriptions allow you to enjoy watching episodes of audio files and can be added to any news aggregator or feed reader to get notifications about new releases.
2484. [VovSoft/Vov Remote Mouse](https://vovsoft.com/software/vov-remote-mouse/) Turn your mobile phone or tablet into a wireless mouse.
2485. [VovSoft/Vov Screen Recorder](https://vovsoft.com/software/vov-screen-recorder/) :money_with_wings: Vov Screen Recorder is a handy tool to capture the computer screen, i.e., record the ongoing activities on the screen.
2486. [VovSoft/Vov Sitemap Generator](https://vovsoft.com/software/vov-sitemap-generator/) :money_with_wings: Create sitemaps that can be submitted to various search engines and help visitors navigate your website, with this easy-to-use program.
2487. [VovSoft/Vov Slideshow Creator](https://vovsoft.com/software/vov-slideshow-creator/) :money_with_wings: Convert your photos into videos with music. Vov Slideshow Creator helps you bringing pictures together to create a video file.
2488. [VovSoft/Vov Sticky Notes](https://vovsoft.com/software/vov-sticky-notes/) :money_with_wings: Add digital stickers to your desktop and create reminders for your upcoming events, tasks or meetings using this intuitive software.
2489. [VovSoft/Vov Stop Start](https://vovsoft.com/software/vov-stop-start/) :money_with_wings: Some background applications are prone to crash. Vov Stop Start is an easy to use application to automatically stop-start this kind of applications. You can minimize application stoppages by using Vov Stop Start.
2490. [VovSoft/Vov Syslog Server](https://vovsoft.com/software/vov-syslog-server/) :money_with_wings: View and archive syslog messages in real-time. Once launched, the application is ready to start monitoring messages coming to your computer. The program automatically reads necessary info.
2491. [VovSoft/Vov System Uptime](https://vovsoft.com/software/vov-system-uptime/) Vov System Uptime runs in the system tray and allows you to see the system uptime with a single mouse click. It lets you know how long your computer has been running.
2492. [VovSoft/Vov Text to Image Converter](https://vovsoft.com/software/vov-text-to-image-converter/) :money_with_wings: This software offers a solution to users who want to convert any text into image file. The user enters the text, chooses the background image and text font. Using this time saving software, you can generate image files with one click.
2493. [VovSoft/Vov Video Converter](https://vovsoft.com/software/vov-video-converter/) :money_with_wings: Vov Video Converter is an easy-to-use multi format video converter. Its main purpose is to edit and convert video files from one format into another.
2494. [VovSoft/Vov Watermark Image](https://vovsoft.com/software/vov-watermark-image/) :money_with_wings: Effortlessly add watermark to images in tiled mode using this tool with support for PNG, JPG, BMP, TIF and other filetypes. If you're looking for a simple solution for applying watermarks to photos in tiled mode, you can use Vov Watermark Image.
2495. [VovSoft/Vov Watermark Video](https://vovsoft.com/software/vov-watermark-video/) :money_with_wings: Protect your work with a watermark, which makes your copyright more difficult to infringe. You can insert the watermark text into top-left, top-right, bottom-left or bottom-right of the video. Drag and drop files is supported.
2496. [VovSoft/Webcam Capture](https://vovsoft.com/software/webcam-capture/) Webcam Capture is a very simple software solution that enables you to monitor one or more webcam feeds from a streamlined, minimalistic user interface. It offers several visual effects and can help you modify your webcams properties.
2497. [VovSoft/World Heatmap Creator](https://vovsoft.com/software/world-heatmap-creator/) :money_with_wings: Heatmaps display information about a specific parameter value using color codes throughout a regular map. Aside from being visually appealing, these statistical instruments are capable of representing large data sets in a simple manner.
2498. [VOX](https://github.com/fresk-nc/VOX/releases/latest) [9/163/22] Audio Player powered by Electron.
2499. [VSO Software/Blu-ray and AVCHD Creator](http://www.vso-software.fr/products/convert-x-to-hd/) :money_with_wings:
2500. [VSO Software/Blu-ray Converter](http://www.vso-software.fr/products/bluray-converter/bluray-converter.php) :money_with_wings:
2501. [VSO Software/Burning Software](http://www.vso-software.fr/products/copyto/copy-to.php) :money_with_wings:
2502. [VSO Software/Convert to DVD](http://www.vso-software.fr/products/convert_x_to_dvd/) :money_with_wings:
2503. [VSO Software/Copy games and backup all your disks!](http://www.vso-software.fr/products/Blindwrite/blindwrite.php) :money_with_wings:
2504. [VSO Software/DVD Converter](http://www.vso-software.fr/products/dvd-converter/dvd-converter.php) :money_with_wings:
2505. [VSO Software/Free Media Player](http://www.vso-software.fr/products/vmp/vso-media-player.php) :money_with_wings: :hand:
2506. [VSO Software/Photo SlideShow Software](http://www.vso-software.fr/products/photodvd/photodvd.php) :money_with_wings:
2507. [VSO Software/Video Converter](http://www.vso-software.fr/products/video-converter/convert-x-to-video.php) :money_with_wings:
2508. [VSO Software/VSO Downloader](http://www.vso-software.fr/products/downloader/vso-downloader.php) :money_with_wings:
2509. [VTerm](https://github.com/vterm/vterm/releases/latest) [7/45/9] :fire: Extensible terminal emulator written with the web languages of the future. Today.
2510. [vuetron](https://github.com/vuetwo/vuetron/releases/latest) [11/488/18] A tool for testing and debugging your Vue + Vuex applications. 是一個可以幫助您 Vue.js 的項目測試及偵錯的工具, 也同時支持 Vuex及 Vue-Router.
2511. [Vuze](https://sourceforge.net/projects/azureus/files/vuze/) [Free Personal] :hand: An extremely powerful and configurable BitTorrent client
2512. [wagon](https://github.com/laravel-dojo/wagon/releases/latest) [27/184/19] 免安裝可攜的 Laravel 開發環境.
2513. [waifu2x-caffe](https://github.com/lltcggie/waifu2x-caffe/releases/latest) [255/3,276/426] waifu2xのCaffe版.
2514. [waifu2x-DeadSix27](https://github.com/DeadSix27/waifu2x-converter-cpp/releases/latest) [25/324/154] Improved fork of Waifu2X C++ using OpenCL and OpenCV
2515. [waifu2x-gui](https://github.com/maz-1/waifu2x-gui/releases/latest) [6/27/3] waifu2x-gui written in ahk.
2516. [Wally](https://sourceforge.net/projects/wally/files/wally/) Wally is a Qt4 wallpaper / background changer, using multiple sources like files, folders, FTP remote folders, Flickr, Panoramio, Ipernity,…
2517. [Waow](https://dedg3.com/wao/)
2518. [Waterfox](https://www.waterfox.net/releases/)
2519. [Wavebox](https://github.com/wavebox/waveboxapp/releases/latest) [41/1,023/133] Wavebox lets you bring all your web communication tools together for faster, smarter working. Gmail, Outlook, Office 365, Slack, Trello & 1000's more
2520. [Weasel](https://rime.im/download/)
2521. [WeatherMate](https://ravib.com/wm/relnotes.htm)
2522. [WebCopy](https://www.cyotek.com/cyotek-webcopy/downloads)
2523. [WebMinds/DropShots](https://www.softpedia.com/get/Internet/File-Sharing/DropShots.shtml) A practical and effective program worth having when you need to share photos and videos with your friends in an intuitive environment
2524. [WebMinds/Duplicate Finder](https://www.softpedia.com/get/System/File-Management/Duplicate-File-Finder-Pro.shtml) :money_with_wings: A comprehensive application that is capable to find and manage file duplicates, on all fixed disk drives or external memory devices
2525. [WebMinds/Duplicate Photo Cleaner](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Others/Duplicate-Photo-Cleaner.shtml) :money_with_wings: Find duplicate images and delete the extra copies to save storage space, or compare a particular picture or images in a specific folder to find resembling files
2526. [WebMinds/Easy Duplicate Finder](https://www.softpedia.com/get/PORTABLE-SOFTWARE/System/File-management/Windows-Portable-Applications-Easy-Duplicate-Finder-Portable.shtml) :money_with_wings: A powerful tool that will help you find and delete duplicate files
2527. [WebMinds/Easy PC Optimizer](https://www.softpedia.com/get/Tweak/System-Tweak/Easy-PC-Optimizer.shtml) :money_with_wings: Fix common OS issues, remove junk files, manage services and startup items, tweak your system and more, with this powerful and easy-to-use application
2528. [WebMinds/FileCleaner](https://www.softpedia.com/get/Security/Secure-cleaning/File-Cleaner.shtml) :money_with_wings: A multi-purpose cleanup application that optimizes computers by providing real-time cleanup for browser and OS, a file shredder, a program uninstaller and many other features
2529. [WebMinds/SensiGuard](https://www.softpedia.com/get/Security/Encrypting/SensiGuard.shtml) :money_with_wings: Instantly lock files and folders in bulk with a master password, protect USB flash drives, shred files, create unique public keys, and securely transfer files to other users
2530. [WebTorrent](https://github.com/webtorrent/webtorrent-desktop/releases/latest) [250/6,299/724] ❤️ Streaming torrent app for Mac, Windows, and Linux
2531. [WeChat Work](https://work.weixin.qq.com/)
2532. [WeChat](https://pc.weixin.qq.com/?t=win_weixin)
2533. [weweChat](https://github.com/trazyn/weweChat/releases/latest) [158/4,469/567] 💬 Unofficial WeChat client built with React, MobX and Electron.
2534. [Wexond](https://github.com/wexond/wexond/releases/latest) [51/1,087/97] A privacy-focused, extensible and beautiful web browser
2535. [WGestures](https://github.com/yingDev/WGestures/releases/latest) [53/690/121] Modern mouse gestures for Windows. (C#).
2536. [wget](https://eternallybored.org/misc/wget/)
2537. [WhatPulse](http://whatpulse.org/downloads/) [Free Personal]
2538. [WhatsApp](https://www.softpedia.com/get/Internet/Chat/Instant-Messaging/WhatsApp.shtml) Keep in touch with your phone contacts in a broad variety of ways by sending them text messages, audio or video recordings and pictures
2539. [WhatsDesktop](https://github.com/mawie81/whatsdesktop/releases/latest) [11/238/37] Unofficial WhatsApp app.
2540. [Wide Angle Software/Droid Transfer](https://www.softpedia.com/get/Mobile-Phone-Tools/Droid-Transfer.shtml) :money_with_wings: Conveniently move MMS and SMS messages along with their attachments to your computer in various formats using this simple and straightforward tool
2541. [Wide Angle Software/Duplicate Sweeper](https://www.softpedia.com/get/File-managers/Duplicate-Sweeper.shtml) :money_with_wings: Easy-to-use software tool that quickly finds and removes duplicate files, featuring support for user-defined rules, using low resources
2542. [Wide Angle Software/iBackup Extractor](https://www.softpedia.com/get/Mobile-Phone-Tools/IPhone/iBackup-Extractor.shtml) :money_with_wings: A simple and user-friendly software utility that allows you to extract data from the backups performed by iTunes on your Apple devices
2543. [Wide Angle Software/iRenew](https://www.softpedia.com/get/IPOD-TOOLS/Multimedia-IPOD-tools/iRenew.shtml) An easy way to recover your iPod music
2544. [Wide Angle Software/iTunes CPU Redux](https://www.softpedia.com/get/Tweak/CPU-Tweak/iTunes-CPU-Redux.shtml) Reduce the percentage of system resources consumed by iTunes-related processes by shutting them down once you are no longer using them
2545. [Wide Angle Software/Music Tag](https://www.softpedia.com/get/Multimedia/Audio/Tag-Editors/Music-Tag-Tool.shtml) :money_with_wings: Edit tags in your music files with ease and download missing information with this app, provided your computer is connected to the Internet
2546. [Wide Angle Software/Song Buddy](https://www.softpedia.com/get/Multimedia/Audio/Other-AUDIO-Tools/Song-Buddy.shtml) A reliable and straightforward application that comes in handy for users who need to learn more about their favorite artists, browse their photos and listen to samples of their albums
2547. [Wide Angle Software/TouchCopy](https://www.softpedia.com/get/IPOD-TOOLS/Multimedia-IPOD-tools/TouchCopy.shtml) :money_with_wings: Retrieves music, playlists, photos and videos from iPhone, iPad or iPod and restores the media files to your iTunes library by preventing re-syncing
2548. [Wide Angle Software/TouchDrive](https://www.softpedia.com/get/Mobile-Phone-Tools/IPhone/TouchDrive.shtml) :money_with_wings: Access your iPhone or iPod Touch directly in Windows Explorer
2549. [Wide Angle Software/Tune Sweeper](https://www.softpedia.com/get/Multimedia/Audio/Other-AUDIO-Tools/Tune-Sweeper.shtml) :money_with_wings: A handy and seamlessly easy to use application that allows you to find and remove duplicate tracks and music from your iTunes library
2550. [Wide Angle Software/Wide Angle PDF Converter](https://www.softpedia.com/get/Office-tools/PDF/Wide-Angle-PDF-Converter.shtml) :money_with_wings: Convert PDF documents to a whole array of formats like Word, PPT, Excel, HTML, or images, with the possibility to merge and split, append, and set document permissions
2551. [WikidPad](https://github.com/WikidPad/WikidPad/releases/) [23/84/25] WikidPad is a single user desktop wiki.
2552. [Win32 Disk Imager](https://sourceforge.net/projects/win32diskimager/files/Archive/) A Windows tool for writing images to USB sticks or SD/CF cards
2553. [Winamp](http://www.winamp.com/) [Free Personal]
2554. [WinAuth](https://github.com/winauth/winauth/releases/latest) [79/942/154] Authenticator on Windows for Battle.net / Steam / Guild Wars 2 / Glyph / Runescape / SWTOR / Bitcoin and digital currency exchanges
2555. [WinAutomation](https://www.softpedia.com/get/System/Launchers-Shutdown-Tools/WinAutomation.shtml) :money_with_wings: Create and record actions, then link them together to easily create automated online or offline tasks to eliminate the routine from your daily activities
2556. [WinBrowser](http://www.winbrowser.com/download.html) :money_with_wings:
2557. [WinCDEmu Portable](http://wincdemu.sysprogs.org/portable/)
2558. [WinCDEmu](https://github.com/sysprogs/WinCDEmu/releases/latest) :hand: [39/355/62] Contribute to  development by creating an account on GitHub.
2559. [WinCompose](https://github.com/samhocevar/wincompose/releases/latest) [43/811/33] Compose Key for Windows.
2560. [WinDirStat](https://windirstat.net/download.html)
2561. [WinDock](http://www.ivanyu.ca/windock/)
2562. [Window Detective](https://sourceforge.net/projects/windowdetective/files) Window Detective is a programmer's tool used to "spy" on an application's windows and allows you to view and even modify some of it's properties.
2563. [WindowGrid](http://windowgrid.net/)
2564. [Windows 10 Login Background Changer](https://github.com/Krutonium/Windows-10-Login-Background-Changer/releases/latest) [65/649/100] Changes the Windows 10 Login Screen Background.
2565. [Windows Club/10AppsManager](https://www.softpedia.com/get/Tweak/Uninstallers/10AppsManager.shtml) You can use this simple tool to easily uninstall native Windows 10 Store Apps, such as Photos, People, Weather, or to reinstall them
2566. [Windows Club/AeroTile](https://www.softpedia.com/get/Tweak/System-Tweak/AeroTile.shtml) Places system folder glassy tiles on your Windows Desktop
2567. [Windows Club/AltPlusTab](https://www.softpedia.com/get/PORTABLE-SOFTWARE/System/System-Enhancements/AltPlusTab.shtml) Change the appearance of the ALT-TAB functionality menu in Windows 10 with just a few clicks using this simple and straightforward tool
2568. [Windows Club/Autorun Deleter](https://www.softpedia.com/get/Antivirus/Removal-Tools/Autorun-Deleter.shtml) A simple-to-use and portable application that helps you disable and remove the Autorun.inf virus, while using low system resources
2569. [Windows Club/Balloon Tip Time Changer](https://www.softpedia.com/get/System/System-Miscellaneous/Balloon-Tip-Time-Changer.shtml) Adjust the display time for all Windows notifications or disable them altogether, using this small, portable and straightforward app
2570. [Windows Club/CleanDesktop](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/CleanDesktop-WindowsClub.shtml) A Desktop Cleanup Wizard for Windows 7 & Vista
2571. [Windows Club/Context Menu Editor](https://www.softpedia.com/get/System/OS-Enhancements/Context-Menu-Editor-WindowsClub.shtml) Delete application shortcuts, Win32 commands, files and website URLs from your desktop and folder context menu with this software solution
2572. [Windows Club/Create A Shortcut](https://www.softpedia.com/get/Tweak/System-Tweak/Create-A-Shortcut.shtml) An easy to use shortcut creator
2573. [Windows Club/Disguise Folders](https://www.softpedia.com/get/Security/Security-Related/Disguise-Folders.shtml) Small-sized and portable app designed to hide folders by making them look like system apps, featuring a very simple-to-use recovery method
2574. [Windows Club/File Association Fixer](https://www.softpedia.com/get/System/File-Management/File-Association-Fixer.shtml) Easily repair file associations on your computer when the Windows Registry has been corrupted by third-party software or by malware
2575. [Windows Club/Fix IE Utility](https://www.softpedia.com/get/Security/Security-Related/Fix-IE-Utility.shtml) A portable, lightweight and straightforward solution for re-registering all the DLL and OCX files needed by Internet Explorer add-ons
2576. [Windows Club/Fix MSE](https://www.softpedia.com/get/Security/Security-Related/Fix-MSE.shtml) Reset all the settings of Microsoft Security Essentials to default with the help of this lightweight and portable software utility
2577. [Windows Club/Fix WMP Utility](https://www.softpedia.com/get/Tweak/Video-Tweak/Fix-WMP-Utility.shtml) Will re-register over 40 dll files needed for the proper functioning of WMP.
2578. [Windows Club/Fix WU](https://www.softpedia.com/get/Tweak/System-Tweak/Fix-WU.shtml) Compact and portable application that repairs faulty Windows updates by adding the missing DLL, OCX and/or AX files to the registry
2579. [Windows Club/FixWin for Windows 10](https://www.softpedia.com/get/Tweak/System-Tweak/FixWin10.shtml) Quickly fix the most common errors, bugs and issues in Windows 10 with the help of this straightforward and intuitive application
2580. [Windows Club/FixWin](https://www.softpedia.com/get/Tweak/System-Tweak/FixWin.shtml) Quickly and effortlessly repair commonly found issues with the computer pertaining to Windows Explorer, Internet connectivity, Windows Media, and others
2581. [Windows Club/GodMode Creator](https://www.softpedia.com/get/System/OS-Enhancements/GodMode-Creator.shtml) Create 38 GodModes in Windows 7 and Vista
2582. [Windows Club/Handy Shortcuts](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/Handy-Shortcuts.shtml) Create Windows Desktop Shortcuts Easily
2583. [Windows Club/Hide Taskbar](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/Hide-Taskbar.shtml) An unobtrusive and portable program that helps you conceal the taskbar with the aid of preset hotkeys, while running on low system resources
2584. [Windows Club/HomePage Maker](https://www.softpedia.com/get/Tweak/Browser-Tweak/HomePage-Maker.shtml) A simple-to-use yet efficient program that helps you customize the homepage for Opera, Internet Explorer, Firefox, and Chrome, while allowing you to add a background image and custom text
2585. [Windows Club/HotShut](https://www.softpedia.com/get/System/Launchers-Shutdown-Tools/Windows-Club-HotShut.shtml) A simple-to-configure application that allows you to shut down, restart, hibernate, or lock the computer, or log off the current user directly from the system tray
2586. [Windows Club/IE9 Tweaker Plus](https://www.softpedia.com/get/Tweak/Browser-Tweak/IE9-Tweaker-Plus.shtml) Tweak Internet Explorer 9
2587. [Windows Club/IE9 Tweaker](https://www.softpedia.com/get/Tweak/Browser-Tweak/IE9-Tweaker.shtml) Make some basic adjustments to Internet Explorer 9 using this straightforward app, such as starting IE in full screen or setting small icons in the toolbar
2588. [Windows Club/InstaMailer](https://www.softpedia.com/get/Internet/E-mail/Mail-Utilities/InstaMailer.shtml) Quickly send emails from Hotmail or Gmail accounts using this lightweight and portable app that features only some standard options
2589. [Windows Club/Metro UI Tweaker for Windows 8](https://www.softpedia.com/get/Tweak/System-Tweak/Metro-UI-Tweaker-for-Windows-8.shtml) Customize the Metro part of the Windows 8 interface so that it meets your needs and preferences using this simple and straightforward tool
2590. [Windows Club/Modern Tile Maker](https://www.softpedia.com/get/Tweak/System-Tweak/Modern-Tile-Maker.shtml) Create Metro style tiles for Windows 8, for accessing files, folders, applications, websites and more, with this useful application
2591. [Windows Club/PassBox](https://www.softpedia.com/get/PORTABLE-SOFTWARE/Security/Password-Managers---Generators/PassBox-Portable.shtml) A lightweight and effective software application that enables any type of user to quickly and easily generate and organize their passwords
2592. [Windows Club/PinToStartMenu](https://www.softpedia.com/get/System/System-Miscellaneous/PinToStartMenu.shtml) Pin Control Panel items and folders to Windows Start Menu
2593. [Windows Club/Program Blocker](https://www.softpedia.com/get/Security/Security-Related/Program-Blocker.shtml) A simple and intuitive program whose main function is to assist you in blocking certain applications from running on your computer
2594. [Windows Club/QRM Plus Manager](https://www.softpedia.com/get/System/System-Miscellaneous/QRM-Plus-Manager.shtml) Create restore points with just a click.
2595. [Windows Club/Quick Clean](https://www.softpedia.com/get/Security/Secure-cleaning/Quick-Clean.shtml) Clean up the junk files from your Windows desktop quickly
2596. [Windows Club/Quick Restore Maker](https://www.softpedia.com/get/System/Back-Up-and-Recovery/Quick-Restore-Maker.shtml) An intuitive and portable application that helps users create a system restore point quickly and with minimum effort, and is suitable even for rookies
2597. [Windows Club/QuickHide](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/QuickHide.shtml) Hide taskbar processes (system tray and quick launch icons) and applications instantly and make them visible again using two keys
2598. [Windows Club/RegOwnit](https://www.softpedia.com/get/Tweak/Registry-Tweak/RegOwnit.shtml) Take full control of Windows registry keys regardless of account easily with the help of this simple and lightweight software application
2599. [Windows Club/Ribbon Icons Customizer](https://www.softpedia.com/get/System/OS-Enhancements/Ribbon-Icons-Customizer.shtml) Lightweight, portable and straightforward software application for turning the default ribbon icons into something else, in Windows 8
2600. [Windows Club/Right-Click Extender](https://www.softpedia.com/get/Tweak/System-Tweak/Right-Click-Extender.shtml) Insert additional items to the right click context menu
2601. [Windows Club/Right-Click ReplaceThis](https://www.softpedia.com/get/System/OS-Enhancements/Right-Click-ReplaceThis.shtml) Easily replace files
2602. [Windows Club/Right-Click Restart Explorer](https://www.softpedia.com/get/System/OS-Enhancements/Right-Click-Restart-Explorer.shtml) A simple-to-use program that helps you restart the Windows Explorer right from the context menu, while running on low system resources
2603. [Windows Club/ScreenOff](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/ScreenOff-Windows-Club.shtml) A simple to use Windows utility which allows you to turn off your monitor with one mouse click, being particularly designed for laptops
2604. [Windows Club/ShowDesktop Remover](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/ShowDesktop-Remover.shtml) Remove and restore the ‘Show Desktop’ button which appears in the right side of the Windows 7 taskbar, and conceal the button at Windows startup
2605. [Windows Club/SMART](https://www.softpedia.com/get/Tweak/System-Tweak/SMART-Utility.shtml) A tweaking tool for your Win 7.
2606. [Windows Club/Start Button Tooltip Text Changer](https://www.softpedia.com/get/System/System-Miscellaneous/Start-Button-Tooltip-Text-Changer.shtml) Modify, disable and reset the text displayed when hovering the mouse over the Start Button in Windows, thanks to this simple and portable tool
2607. [Windows Club/Start My Day](https://www.softpedia.com/get/System/Launchers-Shutdown-Tools/Start-My-Day.shtml) Make your mornings a little easier with this handy application that can open up everything you need to just sit down and start working
2608. [Windows Club/Start Orb Mover](https://www.softpedia.com/get/Tweak/System-Tweak/Start-Orb-Mover.shtml) A system tweak that can move your Start button to another location (the center or the right side) on the taskbar and the Start menu with it
2609. [Windows Club/System Folders Customizer](https://www.softpedia.com/get/Tweak/System-Tweak/System-Folders-Customizer.shtml) Lightweight and portable app that creates shortcuts to your most accessed items within the Library, My Computer and Desktop locations
2610. [Windows Club/System Restore Manager](https://www.softpedia.com/get/System/System-Miscellaneous/System-Restore-Manager.shtml) Manage your system restore points with this tool.
2611. [Windows Club/Taskbar Color Effects](https://www.softpedia.com/get/System/OS-Enhancements/Taskbar-Color-Effects.shtml) Add color effects to Windows 7 taskbar
2612. [Windows Club/Taskbar Shadow](https://www.softpedia.com/get/System/OS-Enhancements/Taskbar-Shadow.shtml) Add shadow effect to Windows 7 taskbar
2613. [Windows Club/Taskbar Thumbnail Tweaker](https://www.softpedia.com/get/Tweak/System-Tweak/Taskbar-Thumbnail-Tweaker.shtml) Customize the taskbar thumbnails in Windows 7 by modifying the size and delay time of the thumbnail preview, or by enabling text only mode
2614. [Windows Club/Thumbnail & Icon Cache Rebuilder](https://www.softpedia.com/get/Tweak/System-Tweak/Icon-Cache-Rebuilder.shtml) Rebuild your icon or thumbnail caches with just a few mouse clicks, by using this straightforward and user-friendly software solution
2615. [Windows Club/Tile Locker](https://www.softpedia.com/get/System/System-Miscellaneous/Tile-Locker.shtml) Prevent other users from re-arranging or removing program tiles from your Start Screen, designed for computers running Windows 8 and 10
2616. [Windows Club/Tweak IE](https://www.softpedia.com/get/Tweak/Browser-Tweak/Tweak-IE.shtml) Turn off, enable and tweak various parts of Internet Explorer with this tiny and portable app that performs all actions with minimal user assistance
2617. [Windows Club/Ultimate Windows Customizer](https://www.softpedia.com/get/Tweak/System-Tweak/Ultimate-Windows-Customizer.shtml) Personalize the appearance of your PC
2618. [Windows Club/Ultimate Windows Tweaker](https://www.softpedia.com/get/Tweak/System-Tweak/Ultimate-Windows-Tweaker.shtml) Tweak the appearance, performance and security of your computer by using this easy-to-use, yet powerful and feature-packed software solution
2619. [Windows Club/W7 Taskbar Tweaker](https://www.softpedia.com/get/Tweak/System-Tweak/W7-Taskbar-Tweaker.shtml) Customize the size of the taskbar buttons and thumbnail preview in Windows 7 and restart your computer to view the changes using this portable application
2620. [Windows Club/Web Pinner](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/Web-Pinner.shtml) Add or Pin website links to your Windows 7 desktop context menu
2621. [Windows Club/WiFi Profile Manager](https://www.softpedia.com/get/Network-Tools/Misc-Networking-Tools/WiFi-Profile-Manager.shtml) Use this comprehensive and easy to use tool to customize your Wi-Fi profiles, thus enabling you to choose from more reliable ones
2622. [Windows Club/Windows 7 DreamScene Activator](https://www.softpedia.com/get/Tweak/System-Tweak/Windows-7-DreamScene-Activator.shtml) Toggle the state of the Windows DreamScene feature with just the press of a button to be able to use videos as wallpapers for a neat workspace
2623. [Windows Club/Windows 7 Folder Background Changer](https://www.softpedia.com/get/Desktop-Enhancements/Other-Desktop-Enhancements/Windows-7-Folder-Background-Changer.shtml) Customize your Explorer's background with this application that requires no advanced computer knowledge or previous experience to be handled
2624. [Windows Club/Windows 7 Start Button Changer](https://www.softpedia.com/get/Tweak/System-Tweak/Windows-7-Start-Button-Changer.shtml) Change the Windows 7 default Start Orb or Button easily by turning to this lightweight application that requires no advanced PC knowledge
2625. [Windows Club/Windows 7 Taskbar Thumbnail Customizer](https://www.softpedia.com/get/Tweak/System-Tweak/Windows-7-Taskbar-Thumbnail-Customizer.shtml) Resize & tweak the Windows 7 taskbar thumbnails
2626. [Windows Club/Windows 8 Aero Lite Tweaker](https://www.softpedia.com/get/Tweak/System-Tweak/Windows-8-Aero-Lite-Tweaker.shtml) Compact and portable software application that enables users to activate the Aero Lite Glass theme on computers running under Windows 8
2627. [Windows Club/Windows 8 Clock Screensaver](https://www.softpedia.com/get/Desktop-Enhancements/Screensavers/Windows-8-Clock-Screensaver.shtml) A screensaver inspired by Microsoft’s next version of the Windows operating system
2628. [Windows Club/Windows Access Panel](https://www.softpedia.com/get/System/System-Miscellaneous/Windows-Access-Panel.shtml) Easily access numerous features of Windows
2629. [Windows Club/Windows Event Viewer Plus](https://www.softpedia.com/get/System/System-Info/Windows-Event-Viewer-Plus.shtml) Lightweight and portable application that enables users to view event logs in a comfortable working environment, catering to administrators
2630. [Windows Club/Windows Logon Notifier](https://www.softpedia.com/get/Tweak/System-Tweak/Windows-Logon-Notifier.shtml) Create logon messages fast and easy.
2631. [Windows Club/Windows Screen Capture Tool Portable](https://www.softpedia.com/get/PORTABLE-SOFTWARE/Multimedia/Graphics/Windows-Screen-Capture-Tool-Portable.shtml) Take snapshots of the entire screen or just some parts of it, web pages or specified windows, as well as edit the resulted images and save them to a file
2632. [Windows Club/Windows Screen Capture Tool](https://www.softpedia.com/get/Multimedia/Graphic/Graphic-Capture/Windows-Screen-Capture-Tool.shtml) Take snapshots of any desktop element you want, whether it's the full screen, specific region, active window or webpage, and adjust image settings
2633. [Windows Club/Windows Theme Installer](https://www.softpedia.com/get/Tweak/System-Tweak/Windows-Theme-Installer.shtml) Install Windows 7 & Vista themes easily
2634. [Windows Club/Windows Tile Color Changer](https://www.softpedia.com/get/PORTABLE-SOFTWARE/System/System-Enhancements/Windows-Tile-Color-Changer.shtml) Change the tile color of Windows applications with this intuitive application that allows users to manually insert color HEX codes
2635. [Windows Club/WinMailer](https://www.softpedia.com/get/Internet/E-mail/E-mail-Clients/WinMailer.shtml) Approachable email client with support for popular and custom providers, multiple receivers, attachments, HTML code, and spellchecker
2636. [Windows Club/WLM Blocked Sender Tool](https://www.softpedia.com/get/Internet/E-mail/Mail-Utilities/WLM-Blocked-Sender-Tool.shtml) Manage Blocked Senders List in Windows Live Mail
2637. [Windows Club/WP7 MarketPlace Enabler](https://www.softpedia.com/get/Internet/Telephony-SMS-GSM/WP7-MarketPlace-Enabler.shtml) A neat software solution that was especially designed to help all users to access the MarketPlace through the Zune software from any country in the world
2638. [Windows System Control Center](http://www.kls-soft.com/wscc/downloads.php) [Freemium]
2639. [WindowsSpyBlocker](https://github.com/crazy-max/WindowsSpyBlocker/releases/latest) [121/1,092/109] 🛡 Block spying and tracking on Windows.
2640. [WindowTabs](http://windowtabs.com/download/)
2641. [Winds](https://s3.amazonaws.com/winds-2.0-releases/latest.html)
2642. [Windscribe](https://www.softpedia.com/get/Security/Security-Related/Windscribe.shtml) Browse the Internet securely and anonymously while bypassing potential geographic restrictions regarding the websites and domains you can access
2643. [WinHex](http://www.x-ways.net/winhex/) :money_with_wings:
2644. [WinMerge](http://winmerge.org/downloads/)
2645. [WinNc](https://www.winnc.com/download/) :money_with_wings:
2646. [WinNTSetup](https://msfn.org/board/topic/149612-winntsetup/)
2647. [WinPcap](https://www.winpcap.org/install/default.htm)
2648. [winPenPack](https://sourceforge.net/projects/winpenpack/files/winPenPack_Suites/releases/) The portable software collection
2649. [WinRAR](https://www.rarlab.com/download.htm) [Free Personal]
2650. [WinSCP](https://winscp.net/eng/download.php)
2651. [WinSpy](https://sourceforge.net/projects/winspyex/files/) Window Information Tool
2652. [winyl](https://github.com/winyl-player/winyl/releases) [9/62/2] Winyl's main repository.
2653. [Wire](https://github.com/wireapp/wire-desktop/releases) [69/801/171] :computer: Wire for desktop.
2654. [Wireshark](https://www.wireshark.org/download.html)
2655. [Wise/Wise Anti Malware](https://www.wisecleaner.com/wise-anti-malware.html) Free Windows security solution, help you remove virus, malware, phishing, spyware, ransomware (like Petya GoldenEye), trojan, potentially unwanted programs (PUA/PUP), and other kinds of threats.
2656. [Wise/Wise Auto Shutdown](https://www.wisecleaner.com/wise-auto-shutdown.html) Wise Auto Shutdown is a small utility that you can use to schedule automatic shutdown, restart, sleep or logoff on your PC.
2657. [Wise/Wise Care 365](https://www.wisecleaner.com/wise-care-365.html) [Free Personal] Wise Care 365 is an all-in-one system tune up tool. Speed up slow computer (laptop and desktop). Clean registry and junk files from your PC. Protect your privacy and make your PC more secure.
2658. [Wise/Wise Data Recovery](https://www.wisecleaner.com/wise-data-recovery.html) Wise Data Recovery is a free data recovery tool to get back deleted or lost pictures, music, documents, videos, emails, etc. Recover any types of data from FAT, exFAT, NTFS disks.
2659. [Wise/Wise Disk Cleaner](https://www.wisecleaner.com/wise-disk-cleaner.html) Download Wise Disk Cleaner to clean junk files, traces, cookies, browser history. Free up your disk space, protect privacy and make your PC run faster.
2660. [Wise/Wise Duplicate Finder](https://www.wisecleaner.com/wise-duplicate-finder.html) A free duplicate file cleaner. Find and remove duplicate files, photos, videos with Wise Duplicate Finder. Free up your disk space by removing duplicate files.
2661. [Wise/Wise Folder Hider Pro](https://www.wisecleaner.com/wise-folder-hider-pro.html) Wise Folder Hider Pro can hide, encrypt and password-protect your files and folders. Enhanced security defends your private files from being read by other third-party tools.
2662. [Wise/Wise Force Deleter](https://www.wisecleaner.com/wise-force-deleter.html) Wise Force Deleter, a solution for deleting undeletable files or folders. It helps you to unlock and delete 'Access Denied' or 'File in Use' files.
2663. [Wise/Wise Game Booster](https://www.wisecleaner.com/wise-game-booster.html) Wise Game Booster optimizes your system for games by temporarily ending unnecessary processes to focus resources on gaming performance.
2664. [Wise/Wise Hotkey](https://www.wisecleaner.com/wise-hotkey.html) Wise Hotkey is a useful tool for Windows user that help you quick launch or quick switch your programs, file folders or website links with shortcut key.
2665. [Wise/Wise JetSearch](https://www.wisecleaner.com/wise-jetsearch.html) Wise JetSearch is a free local search tool to help users search everything (locate files or folders) instantly by keywords.
2666. [Wise/Wise Memory Optimizer](https://www.wisecleaner.com/wise-memory-optimizer.html) Wise Memory Optimizer a simple and effective RAM booster to help you free up memory and get your computer running smoothly again.
2667. [Wise/Wise PC 1stAid](https://www.wisecleaner.com/wise-pc-1staid.html) Wise PC 1stAid is an intelligent software which has assembled most common PC problems and helps you fix them automatically through an intelligent process.
2668. [Wise/Wise Plugin Manager](https://www.wisecleaner.com/wise-plugin-manager.html) Wise Plugin Manager enables you to turn on/off or remove browser plugins, add-ons and extensions like toolbar. It is applicable to Chrome, IE, Mozilla Firefox and Opera.
2669. [Wise/Wise Program Uninstaller](https://www.wisecleaner.com/wise-program-uninstaller.html) Download Wise Program Uninstaller, the best uninstall tool to remove, modify or force uninstall programs/softwares fast and completely.
2670. [Wise/Wise Registry Cleaner](https://www.wisecleaner.com/wise-registry-cleaner.html) Free download Wise Registry Cleaner, the best free registry cleaner to improve pc performance.
2671. [Wise/Wise Reminder](https://www.wisecleaner.com/wise-reminder.html) Wise Reminder is a Windows scheduling utility that helps you organize daily tasks. Remind you accurately so that you won't miss any plan.
2672. [Wise/Wise System Monitor](https://www.wisecleaner.com/wise-system-monitor.html) Wise System Monitor is a free and user-friendly PC monitoring tool. It helps monitor processes, CPU, memory and network traffic.
2673. [Wise/Wise Windows Key Finder](https://www.wisecleaner.com/wise-windows-key-finder.html) An easy to use Microsoft Windows product key viewer, find and display your Windows system and Office key.
2674. [WiX Toolset](https://github.com/wixtoolset/wix3/releases/latest) [140/867/366] WiX Toolset v3.x.
2675. [WizFile](https://antibody-software.com/web/software/software/wizfile-finds-your-files-fast/)
2676. [WizKey](https://antibody-software.com/web/software/software/wizkey-makes-it-easy-to-type-accented-and-other-special-unicode-characters/) :money_with_wings:
2677. [WizMouse](https://antibody-software.com/web/software/software/wizmouse-makes-your-mouse-wheel-work-on-the-window-under-the-mouse/)
2678. [WizTree](https://antibody-software.com/web/software/software/wiztree-finds-the-files-and-folders-using-the-most-disk-space-on-your-hard-drive/)
2679. [WordPress.com](https://github.com/Automattic/wp-desktop/releases/latest) [173/704/237] WordPress.com for Desktop.
2680. [WordWeb](https://wordweb.info/) :money_with_wings:
2681. [Work Crawler](https://github.com/kanasimi/work_crawler/releases/latest) [26/458/71] 小说漫画下载工具:腾讯漫画 大角虫漫画 有妖气 知音漫客 咪咕 SF漫画 哦漫画 看漫画 漫画柜 漫画台 漫画160 汗汗酷漫 動漫伊甸園 网易漫画 快看漫画 微博动漫 733动漫网 大古漫画网 漫画DB 卡推漫画 动漫之家 动漫屋 土豪漫画 古风漫画网 36漫画网 亲亲漫画网 360漫画 乙女漫画 comico webtoons 咚漫 OVERLAP MAGCOMI ComicWalker ヤングエースUP モアイ pixivコミック サイコミ;アルファポリス カクヨム ハーメルン 小説家になろう 卡提諾論壇 起点中文网 八一中文网 顶点小说 落霞小说网 努努书坊 笔趣阁→epub. Download online novels, comics. 小說漫畫下載
2682. [Wox](https://github.com/Wox-launcher/Wox/releases) [509/13,187/1,305] Launcher for Windows, an alternative to Alfred and Launchy.
2683. [wsltty](https://github.com/mintty/wsltty/releases/latest) [59/1,936/54] Mintty as a terminal for Bash on Ubuntu on Windows / WSL
2684. [wxHexEditor](https://sourceforge.net/projects/wxhexeditor/files/wxHexEditor/) wxHexEditor is another Hex Editor, build because of there is no good hex editor for Linux system, specially for big files. It supports files up to…
2685. [X-Mouse Button Control](https://www.highrez.co.uk/downloads/xmbc_changelog.htm)
2686. [x64dbg](https://github.com/x64dbg/x64dbg/releases/latest) [3,262/33,892/999] An open-source x64/x32 debugger for windows.
2687. [XAMPP](https://www.apachefriends.org/index.html)
2688. [XCEL](https://github.com/o2team/xcel/releases/latest) [26/510/75] 一个基于 Electron 和 Vue 的 Excel 数据过滤工具——凹凸实验室出品 https://aotu.io/notes/2016/11/15/xcel/
2689. [Xinorbis](http://www.xinorbis.com/downloads.htm)
2690. [Xlideit Image Viewer](https://sourceforge.net/projects/xlideit/files) A lightweight image viewer with basic image processing
2691. [XMedia Recode](https://xmedia-recode.de/en/download.html)
2692. [XMPlay](http://www.un4seen.com/xmplay.html)
2693. [XnConvert](https://www.xnview.com/en/xnconvert/)
2694. [XnRetro](https://www.xnview.com/en/xnretro/)
2695. [XnSketch](https://www.xnview.com/en/xnsketch/)
2696. [XnView](https://www.xnview.com/en/xnview/) [Freemium]
2697. [XnViewMP](https://www.xnview.com/en/xnviewmp/) [Freemium]
2698. [xplorer²](https://www.zabkat.com/index.htm) [Free Personal]
2699. [xrayz/ClipCache Pro](http://www.xrayz.co.uk/download/clipcache)
2700. [xrayz/LinkStash](http://www.xrayz.co.uk/download/linkstash)
2701. [XT800](http://www.xt800.cn/support/faq?pid=810) [Freemium]
2702. [Xtreme Download Manager](http://xdman.sourceforge.net/)
2703. [XX-Net](https://github.com/XX-net/XX-Net/blob/master/code/default/download.md) a web proxy tool. Contribute to XX-net/XX-Net development by creating an account on GitHub.
2704. [XYplorer](https://www.xyplorer.com/) [Free Personal]
2705. [YACReader](http://www.yacreader.com/downloads)
2706. [YakYak](https://github.com/yakyak/yakyak/releases/latest) [128/3,665/318] Desktop chat client for Google Hangouts.
2707. [Yandex](https://browser.yandex.com/)
2708. [YGOPro](http://ce.ys168.com/f_ht/ajcx/wj.aspx?cz=dq&mlbh=1252237&_dlmc=ygocore)
2709. [YL Computing/Coin Balance Tracker](http://www.pcclean.io/coin-balance-tracker/) :money_with_wings:
2710. [YL Computing/Dr.Folder](http://www.pcclean.io/dr-folder/download/) :money_with_wings:
2711. [YL Computing/Email Excavator](http://www.pcclean.io/email-excavator/download/) :money_with_wings:
2712. [YL Computing/imDesktop](http://www.pcclean.io/imdesktop-download/) :money_with_wings:
2713. [YL Computing/My Faster Game](http://www.pcclean.io/my-faster-game/download/) :money_with_wings:
2714. [YL Computing/Perfect Hotkey](http://www.pcclean.io/perfect-hotkey/download/) :money_with_wings:
2715. [YL Computing/Process Checker](http://www.pcclean.io/process-checker/) :money_with_wings:
2716. [YL Computing/ScanMyReg](http://www.pcclean.io/scanmyreg/download/) :money_with_wings:
2717. [YL Computing/WinUtilities Pro](http://www.pcclean.io/winutilities-pro/download/) :money_with_wings:
2718. [YL Computing/WinUtilities](http://www.pcclean.io/winutilities-free/download/)
2719. [Yosoro](https://github.com/IceEnd/Yosoro/releases/latest) [69/1,508/214] :shaved_ice:Beautiful Markdown NoteBook Desktop App. 🏖
2720. [Youdao YNode](http://note.youdao.com/)
2721. [youtube-dl-gui](https://github.com/MrS0m30n3/youtube-dl-gui/releases/latest) [197/3,171/490] A cross platform front-end GUI of the popular youtube-dl written in wxPython.
2722. [youtube-dl](https://github.com/ytdl-org/youtube-dl/releases/latest) [1,719/50,394/8,738] Command-line program to download videos from YouTube.com and other video sites
2723. [YTD Video Downloader](https://www.softpedia.com/get/Internet/Download-Managers/YTD-Video-Downloader.shtml) :money_with_wings: Grab videos from the Internet and convert them to the desired format in an instant, thus creating an offline collection you can access anytime
2724. [YUMI-UEFI](https://www.pendrivelinux.com/yumi-multiboot-usb-creator/)
2725. [YUMI](https://www.pendrivelinux.com/yumi-multiboot-usb-creator/)
2726. [YYetsShare](http://app.rrysapp.com/)
2727. [Zazu](https://github.com/tinytacoteam/zazu/releases/latest) [63/1,796/127] :rocket: A fully extensible and open source launcher for hackers, creators and dabblers.
2728. [Zback](https://www.softpedia.com/get/System/File-Management/Zback.shtml) Accessible and user-friendly piece of software that can be used to easily synchronize or backup your computer files and directories
2729. [ZD Soft Screen Recorder](https://www.zdsoft.com/downloads.html) [Free Personal]
2730. [zeal](https://github.com/zealdocs/zeal/releases/latest) [216/6,831/536] Offline documentation browser inspired by Dash.
2731. [ZenMate](https://www.softpedia.com/get/Security/Security-Related/ZenMate.shtml) Browse the Internet in your very own virtual private network and safe from third-parties that want to monitor your activities with this app
2732. [ZeroNet](https://github.com/HelloZeroNet/ZeroNet/releases/latest) [855/13,742/1,782] ZeroNet - Decentralized websites using Bitcoin crypto and BitTorrent network
2733. [ZeroTier One](https://www.zerotier.com/download.shtml) [Free Personal]
2734. [Zim](https://zim.glump.net/windows/)
2735. [Zotero](https://www.softpedia.com/get/Office-tools/Other-Office-Tools/Zotero.shtml) Collect and organize numerous research sources such as articles, documents and forum posts into different categories using this simple yet highly effective application
2736. [一唯/EV剪辑](https://www.ieway.cn/evedit.html) [Free Personal]
2737. [一唯/EV加密](https://www.ieway.cn/videoenc.html) [Free Personal]
2738. [一唯/EV加密播放器 2](https://www.ieway.cn/evplayer2.html) [Free Personal]
2739. [一唯/EV录屏](https://www.ieway.cn/evcapture.html) [Free Personal]
2740. [一唯/EV播放器](https://www.ieway.cn/evplayer.html) [Free Personal]
2741. [为知笔记](http://www.wiz.cn/downloads-windows.html) :money_with_wings:
2742. [久久校时软件](http://bjtime.cn/info/view.asp?id=159) [Free Personal]
2743. [冰点文库下载器](https://www.crsky.com/soft/25711.html)
2744. [夜神安卓模拟器](https://www.yeshen.com/)
2745. [天若OCR](https://tianruoocr.cn/server/support.php) [Free Personal] :hand:
2746. [屏幕录像专家](http://www.tlxsoft.com/xz.htm) :money_with_wings:
2747. [灵音播放器](http://www.pc6.com/softview/SoftView_353310.html)
2748. [神剪辑](http://www.kami233.com/download/)
2749. [繁化姬](https://github.com/James1201/Fanhuaji-GUI-Release/releases/latest) [5/41/2] Contribute to  development by creating an account on GitHub.
2750. [订票助手.NET](https://www.fishlee.net/soft/12306/)
2751. [鱼声音乐](https://github.com/AnyListen/YaVipCore/releases/latest) [37/435/120] Net Core Music Interface.

</details>

### Special Software
#### 特别的软件

##### Special Installer
###### 特殊的安装方式(作为参考)

1. 
2. 
3. 
4. 
5. 
6. 
7. 
8. 
9. 
10. 
11. 
12. 
13. 
14. 
15. 
16. 
17. 
18. 
19. 
20. 
21. 
22. 


##### Without Download
###### 缺少下载地址

[Ad Muncher](/dodying/software-for-softwareUpdateManager/blob/master/software/Ad%20Muncher.js)[Advanced IP Scanner](/dodying/software-for-softwareUpdateManager/blob/master/software/Advanced%20IP%20Scanner.js)[AIMP](/dodying/software-for-softwareUpdateManager/blob/master/software/AIMP.js)[AppleApplicationSupport](/dodying/software-for-softwareUpdateManager/blob/master/software/AppleApplicationSupport.js)[AutoHotkey](/dodying/software-for-softwareUpdateManager/blob/master/software/AutoHotkey.js)[avidemux](/dodying/software-for-softwareUpdateManager/blob/master/software/avidemux.js)[Balabolka](/dodying/software-for-softwareUpdateManager/blob/master/software/Balabolka.js)[Bandisoft Bandizip](/dodying/software-for-softwareUpdateManager/blob/master/software/Bandisoft%20Bandizip.js)[Bandisoft Honeyview](/dodying/software-for-softwareUpdateManager/blob/master/software/Bandisoft%20Honeyview.js)[BinaryMark/Advanced File Finder](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Advanced%20File%20Finder.js)[BinaryMark/All the Best YouTube Downloader](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/All%20the%20Best%20YouTube%20Downloader.js)[BinaryMark/Batch Docs](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Docs.js)[BinaryMark/Batch Encoding Converter](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Encoding%20Converter.js)[BinaryMark/Batch File Encrypt](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20File%20Encrypt.js)[BinaryMark/Batch File Manager](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20File%20Manager.js)[BinaryMark/Batch File Rename](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20File%20Rename.js)[BinaryMark/Batch File Replace](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20File%20Replace.js)[BinaryMark/Batch File Split & Join](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20File%20Split%20&%20Join.js)[BinaryMark/Batch Files](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Files.js)[BinaryMark/Batch Hex Editor](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Hex%20Editor.js)[BinaryMark/Batch Image Converter](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Image%20Converter.js)[BinaryMark/Batch Image Enhancer](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Image%20Enhancer.js)[BinaryMark/Batch Image Resizer](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Image%20Resizer.js)[BinaryMark/Batch Image Splitter](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Image%20Splitter.js)[BinaryMark/Batch Image Watermarker](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Image%20Watermarker.js)[BinaryMark/Batch Images](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Images.js)[BinaryMark/Batch Photo Face](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Photo%20Face.js)[BinaryMark/Batch RegEx](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20RegEx.js)[BinaryMark/Batch Text File Editor](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Text%20File%20Editor.js)[BinaryMark/Batch Word Replace](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Word%20Replace.js)[BinaryMark/Biorhythms Calculator 2018](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Biorhythms%20Calculator%202018.js)[BinaryMark/Blogspot & Tumblr Image Downloader](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Blogspot%20&%20Tumblr%20Image%20Downloader.js)[BinaryMark/Color Picker Pro](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Color%20Picker%20Pro.js)[BinaryMark/Database E-Mailer](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Database%20E-Mailer.js)[BinaryMark/File Hash Generator](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/File%20Hash%20Generator.js)[BinaryMark/Password Generator](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Password%20Generator.js)[BinaryMark/Random Item Picker](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Random%20Item%20Picker.js)[BinaryMark/Random Number Generator](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Random%20Number%20Generator.js)[BinaryMark/Streaming Video Downloader](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Streaming%20Video%20Downloader.js)[BinaryMark/Text to MP3 Converter](/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Text%20to%20MP3%20Converter.js)[Blue Iris](/dodying/software-for-softwareUpdateManager/blob/master/software/Blue%20Iris.js)[cFos Software/cFos Broadband Connect](/dodying/software-for-softwareUpdateManager/blob/master/software/cFos%20Software/cFos%20Broadband%20Connect.js)[cFos Software/cFos IPv6 Link](/dodying/software-for-softwareUpdateManager/blob/master/software/cFos%20Software/cFos%20IPv6%20Link.js)[cFos Software/cFos Outlook DAV](/dodying/software-for-softwareUpdateManager/blob/master/software/cFos%20Software/cFos%20Outlook%20DAV.js)[cFos Software/cFos Personal Net](/dodying/software-for-softwareUpdateManager/blob/master/software/cFos%20Software/cFos%20Personal%20Net.js)[cFos Software/cFos](/dodying/software-for-softwareUpdateManager/blob/master/software/cFos%20Software/cFos.js)[cFos Software/cFosSpeed](/dodying/software-for-softwareUpdateManager/blob/master/software/cFos%20Software/cFosSpeed.js)[ChemTable/Autorun Organizer](/dodying/software-for-softwareUpdateManager/blob/master/software/ChemTable/Autorun%20Organizer.js)[ChemTable/Registry Life](/dodying/software-for-softwareUpdateManager/blob/master/software/ChemTable/Registry%20Life.js)[ChemTable/Soft Organizer](/dodying/software-for-softwareUpdateManager/blob/master/software/ChemTable/Soft%20Organizer.js)[Classic Shell](/dodying/software-for-softwareUpdateManager/blob/master/software/Classic%20Shell.js)[Cloudevo](/dodying/software-for-softwareUpdateManager/blob/master/software/Cloudevo.js)[Clover](/dodying/software-for-softwareUpdateManager/blob/master/software/Clover.js)1. [CnkiDownloader](/dodying/software-for-softwareUpdateManager/blob/master/software/CnkiDownloader.js)
[CocosCreator](/dodying/software-for-softwareUpdateManager/blob/master/software/CocosCreator.js)[CuteFTP](/dodying/software-for-softwareUpdateManager/blob/master/software/CuteFTP.js)[Directory Opus](/dodying/software-for-softwareUpdateManager/blob/master/software/Directory%20Opus.js)[EasyDrv](/dodying/software-for-softwareUpdateManager/blob/master/software/EasyDrv.js)2. [Enigma Virtual Box unpacker](/dodying/software-for-softwareUpdateManager/blob/master/software/Enigma%20Virtual%20Box%20unpacker.js)
[Evernote](/dodying/software-for-softwareUpdateManager/blob/master/software/Evernote.js)[fman](/dodying/software-for-softwareUpdateManager/blob/master/software/fman.js)[Fork](/dodying/software-for-softwareUpdateManager/blob/master/software/Fork.js)[FreeFileSync](/dodying/software-for-softwareUpdateManager/blob/master/software/FreeFileSync.js)[GIMP](/dodying/software-for-softwareUpdateManager/blob/master/software/GIMP.js)[IObit/Driver Booster](/dodying/software-for-softwareUpdateManager/blob/master/software/IObit/Driver%20Booster.js)[KingSoft/WPS](/dodying/software-for-softwareUpdateManager/blob/master/software/KingSoft/WPS.js)[MinGW-w64](/dodying/software-for-softwareUpdateManager/blob/master/software/MinGW-w64.js)[Mythicsoft/Agent Ransack](/dodying/software-for-softwareUpdateManager/blob/master/software/Mythicsoft/Agent%20Ransack.js)[Npcap](/dodying/software-for-softwareUpdateManager/blob/master/software/Npcap.js)[OpalCalc](/dodying/software-for-softwareUpdateManager/blob/master/software/OpalCalc.js)[Paragon/Paragon Disk Wiper Professional](/dodying/software-for-softwareUpdateManager/blob/master/software/Paragon/Paragon%20Disk%20Wiper%20Professional.js)[Paragon/Paragon VM Backup](/dodying/software-for-softwareUpdateManager/blob/master/software/Paragon/Paragon%20VM%20Backup.js)[Pixia](/dodying/software-for-softwareUpdateManager/blob/master/software/Pixia.js)[Preme](/dodying/software-for-softwareUpdateManager/blob/master/software/Preme.js)[Python](/dodying/software-for-softwareUpdateManager/blob/master/software/Python.js)[Python2](/dodying/software-for-softwareUpdateManager/blob/master/software/Python2.js)[QTTabBar](/dodying/software-for-softwareUpdateManager/blob/master/software/QTTabBar.js)[Saleen/FilePro](/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/FilePro.js)[Saleen/Folder Sync](/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/Folder%20Sync.js)[Saleen/KeyboardExt](/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/KeyboardExt.js)[Saleen/ScanFs](/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/ScanFs.js)[Saleen/Tasks Manager](/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/Tasks%20Manager.js)[Saleen/Video Manager](/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/Video%20Manager.js)[Saleen/WebDownloader](/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/WebDownloader.js)3. [shadowsocks-qt5](/dodying/software-for-softwareUpdateManager/blob/master/software/shadowsocks-qt5.js)
[SmartGit](/dodying/software-for-softwareUpdateManager/blob/master/software/SmartGit.js)[SoftEtherVPN](/dodying/software-for-softwareUpdateManager/blob/master/software/SoftEtherVPN.js)[Stardock/Start8](/dodying/software-for-softwareUpdateManager/blob/master/software/Stardock/Start8.js)[Trillian](/dodying/software-for-softwareUpdateManager/blob/master/software/Trillian.js)[TVDownloader](/dodying/software-for-softwareUpdateManager/blob/master/software/TVDownloader.js)[Twitch](/dodying/software-for-softwareUpdateManager/blob/master/software/Twitch.js)4. [Universal Extractor mod by koros aka ya158](/dodying/software-for-softwareUpdateManager/blob/master/software/Universal%20Extractor%20mod%20by%20koros%20aka%20ya158.js)
[uTorrent](/dodying/software-for-softwareUpdateManager/blob/master/software/uTorrent.js)[VirtualBox](/dodying/software-for-softwareUpdateManager/blob/master/software/VirtualBox.js)[VSO Software/Free Media Player](/dodying/software-for-softwareUpdateManager/blob/master/software/VSO%20Software/Free%20Media%20Player.js)[Vuze](/dodying/software-for-softwareUpdateManager/blob/master/software/Vuze.js)[Weasel](/dodying/software-for-softwareUpdateManager/blob/master/software/Weasel.js)[WinCDEmu](/dodying/software-for-softwareUpdateManager/blob/master/software/WinCDEmu.js)5. [天若OCR](/dodying/software-for-softwareUpdateManager/blob/master/software/%E5%A4%A9%E8%8B%A5OCR.js)


##### Without Installer
###### 缺少安装方式

1. 
2. 
3. 
4. 
5. 
6. 
7. 
8. 
9. 
10. 
11. 
12. 
13. 
14. 
15. 
16. 
17. 
18. 
19. 
20. 
21. 
22. 
23. 
24. 
25. 
26. 
27. 
28. 
29. 
30. 
31. 
32. 
33. 
34. 
35. 
36. 
37. 
38. 
39. 
40. 
41. 
42. 
43. 
44. 
45. 
46. 
47. 
48. 
49. 
50. 
51. 
52. 
53. 
54. 
55. 
56. 
57. 
58. 
59. 
60. 
61. 
62. 
63. 
64. 
65. 
66. 
67. 
68. 
69. 
70. 
71. 
72. 

