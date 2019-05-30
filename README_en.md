<!-- TOC -->

- [SoftwareUpdateManager](#softwareupdatemanager)
    - [Note](#note)
      - [Usage](#usage)
      - [Other](#other)
    - [Command-Line](#command-line)
    - [TODO](#todo)
    - [Software Example](#software-example)
    - [Supported Search Site](#supported-search-site)
    - [Supported Software](#supported-software)
    - [Special Software](#special-software)
        - [Special Installer](#special-installer)
        - [Without Download](#without-download)
        - [Without Installer](#without-installer)

<!-- /TOC -->

## SoftwareUpdateManager

[中文说明](README.md)

#### Note

##### Usage

1. `git clone https://github.com/dodying/softwareUpdateManager`
2. `npm install`
3. Download `https://github.com/dodying/software-for-softwareUpdateManager/archive/master.zip`,
  extract and move **software** to under **softwareUpdateManager**
4. Download **plugins.7z** from [here](https://github.com/dodying/softwareUpdateManager/releases/tag/plugins), and extract to **plugins**
5. Copy **config.default.js**, modify and save as **config.js**

##### Other

1. 以下软件, 如果`通常版(installer)`与`便携版(portable)`功能相同则一般以绿色版优先(如果安装版的包小许多, 则可能以安装版优先), 同时64位优先
2. 大多软件都支持自动安装
3. 带 :money_with_wings: 的为**商业软件** (包括Freemium与Free Persion),  带 :airplane: 的需**番羽土墙**,  带 :hand: 的需**手动下载/安装**,  带 :pushpin: 的表示**安装目录固定**
4. 代理优先级(前提是设置了代理): `config.urlWithoutProxy > config.urlWithProxy > config.useProxy > software.useProxy`
5. 模式优先级: `config.specialMode > config.mode = config.commercialSoftware`
6. 安装方法并没有一一测试, 如果自动安装失败, 请尝试手动安装


#### Command-Line

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
    check and update all softwares
* `--help`, `-h`

    `node index.js --help`
* `--makemd`, `-md`

    `node index.js --makemd`
    update `README.md`
* `--search`, `-s`

    `node index.js --search keyword`
    search and create `js` file
* `--profile`, `-p`

    `node index.js --profile name`
    eg: `node index.js -profile sync`
        ==> 当`config`与`config.profile.sync`中存在相同项时, 以`config.profile.sync`优先, 同时数据会保存在`data-sync.json`中
* `--list`, `-l`

    `node index.js --list`
    list software saved in`database.json`
* `--quiet`, `-q`

    `node index.js --quiet`
    passive mode
* `--filter`, `-f`

    `node index.js --filter name`
    check these softwares (seperated by`,`) (ignore check interval)
* `--test`, `-t`

    `node index.js --test`
    check latest version (ignore check interval)
* `--test-download`, `-td`

    `node index.js --test-download`
    check latest version, and download (use profile test)
* `--test-download`, `-ti`

    `node index.js --test-install`
    check latest version, download and install (use profile test)
* `--check`, `-c`

    `node index.js --check`
    check latest version and save into `database.json` (ignore check interval)
* `--backup`, `-b`

    `node index.js --backup`
    get latest version of software installer (ignore check interval)
* `--install`, `-i`

    `node index.js --install`
    install the latest version you download before
* `software_name`

    `node index.js 7-Zip AIMP "Google Chrome"`
     check these softwares (seperated by `space`) (ignore check interval)
</details>


#### TODO


#### Software Example

Refer to [Telegram](software/Telegram.js)

#### Supported Search Site

1. FileHorse
2. Pc6
3. Softpedia


#### Supported Software

Refer to [SupportedSoftwares.md](SupportedSoftwares.md)

#### Special Software

###### Special Installer

1. [Advanced IP Scanner](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Advanced%20IP%20Scanner.js)
2. [AIMP](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/AIMP.js)
3. [AppleApplicationSupport](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/AppleApplicationSupport.js)
4. [AutoHotkey](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/AutoHotkey.js)
5. [Bandisoft Bandizip](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Bandisoft%20Bandizip.js)
6. [Bandisoft Honeyview](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Bandisoft%20Honeyview.js)
7. [CocosCreator](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/CocosCreator.js)
8. [Directory Opus](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Directory%20Opus.js)
9. [Evernote](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Evernote.js)
10. [Fork](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Fork.js)
11. [GIMP](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/GIMP.js)
12. [IObit/Driver Booster](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/IObit/Driver%20Booster.js)
13. [KingSoft/WPS](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/KingSoft/WPS.js)
14. [MinGW-w64](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/MinGW-w64.js)
15. [Mythicsoft/Agent Ransack](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Mythicsoft/Agent%20Ransack.js)
16. [Npcap](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Npcap.js)
17. [Python](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Python.js)
18. [Python2](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Python2.js)
19. [SmartGit](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/SmartGit.js)
20. [uTorrent](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/uTorrent.js)
21. [VirtualBox](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/VirtualBox.js)
22. [Weasel](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Weasel.js)


###### Without Download

1. [CnkiDownloader](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/CnkiDownloader.js)
2. [Enigma Virtual Box unpacker](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Enigma%20Virtual%20Box%20unpacker.js)
3. [shadowsocks-qt5](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/shadowsocks-qt5.js)
4. [Universal Extractor mod by koros aka ya158](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Universal%20Extractor%20mod%20by%20koros%20aka%20ya158.js)
5. [天若OCR](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/%E5%A4%A9%E8%8B%A5OCR.js)


###### Without Installer

1. [Ad Muncher](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Ad%20Muncher.js)
2. [avidemux](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/avidemux.js)
3. [Balabolka](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Balabolka.js)
4. [BinaryMark/Advanced File Finder](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Advanced%20File%20Finder.js)
5. [BinaryMark/All the Best YouTube Downloader](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/All%20the%20Best%20YouTube%20Downloader.js)
6. [BinaryMark/Batch Docs](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Docs.js)
7. [BinaryMark/Batch Encoding Converter](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Encoding%20Converter.js)
8. [BinaryMark/Batch File Encrypt](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20File%20Encrypt.js)
9. [BinaryMark/Batch File Manager](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20File%20Manager.js)
10. [BinaryMark/Batch File Rename](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20File%20Rename.js)
11. [BinaryMark/Batch File Replace](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20File%20Replace.js)
12. [BinaryMark/Batch File Split & Join](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20File%20Split%20&%20Join.js)
13. [BinaryMark/Batch Files](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Files.js)
14. [BinaryMark/Batch Hex Editor](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Hex%20Editor.js)
15. [BinaryMark/Batch Image Converter](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Image%20Converter.js)
16. [BinaryMark/Batch Image Enhancer](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Image%20Enhancer.js)
17. [BinaryMark/Batch Image Resizer](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Image%20Resizer.js)
18. [BinaryMark/Batch Image Splitter](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Image%20Splitter.js)
19. [BinaryMark/Batch Image Watermarker](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Image%20Watermarker.js)
20. [BinaryMark/Batch Images](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Images.js)
21. [BinaryMark/Batch Photo Face](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Photo%20Face.js)
22. [BinaryMark/Batch RegEx](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20RegEx.js)
23. [BinaryMark/Batch Text File Editor](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Text%20File%20Editor.js)
24. [BinaryMark/Batch Word Replace](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Batch%20Word%20Replace.js)
25. [BinaryMark/Biorhythms Calculator 2018](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Biorhythms%20Calculator%202018.js)
26. [BinaryMark/Blogspot & Tumblr Image Downloader](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Blogspot%20&%20Tumblr%20Image%20Downloader.js)
27. [BinaryMark/Color Picker Pro](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Color%20Picker%20Pro.js)
28. [BinaryMark/Database E-Mailer](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Database%20E-Mailer.js)
29. [BinaryMark/File Hash Generator](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/File%20Hash%20Generator.js)
30. [BinaryMark/Password Generator](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Password%20Generator.js)
31. [BinaryMark/Random Item Picker](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Random%20Item%20Picker.js)
32. [BinaryMark/Random Number Generator](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Random%20Number%20Generator.js)
33. [BinaryMark/Streaming Video Downloader](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Streaming%20Video%20Downloader.js)
34. [BinaryMark/Text to MP3 Converter](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/BinaryMark/Text%20to%20MP3%20Converter.js)
35. [Blue Iris](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Blue%20Iris.js)
36. [cFos Software/cFos Broadband Connect](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/cFos%20Software/cFos%20Broadband%20Connect.js)
37. [cFos Software/cFos IPv6 Link](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/cFos%20Software/cFos%20IPv6%20Link.js)
38. [cFos Software/cFos Outlook DAV](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/cFos%20Software/cFos%20Outlook%20DAV.js)
39. [cFos Software/cFos Personal Net](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/cFos%20Software/cFos%20Personal%20Net.js)
40. [cFos Software/cFos](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/cFos%20Software/cFos.js)
41. [cFos Software/cFosSpeed](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/cFos%20Software/cFosSpeed.js)
42. [ChemTable/Autorun Organizer](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/ChemTable/Autorun%20Organizer.js)
43. [ChemTable/Registry Life](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/ChemTable/Registry%20Life.js)
44. [ChemTable/Soft Organizer](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/ChemTable/Soft%20Organizer.js)
45. [Classic Shell](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Classic%20Shell.js)
46. [Cloudevo](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Cloudevo.js)
47. [Clover](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Clover.js)
48. [CuteFTP](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/CuteFTP.js)
49. [EasyDrv](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/EasyDrv.js)
50. [fman](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/fman.js)
51. [FreeFileSync](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/FreeFileSync.js)
52. [OpalCalc](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/OpalCalc.js)
53. [Paragon/Paragon Disk Wiper Professional](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Paragon/Paragon%20Disk%20Wiper%20Professional.js)
54. [Paragon/Paragon VM Backup](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Paragon/Paragon%20VM%20Backup.js)
55. [Pixia](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Pixia.js)
56. [Preme](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Preme.js)
57. [QTTabBar](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/QTTabBar.js)
58. [Saleen/FilePro](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/FilePro.js)
59. [Saleen/Folder Sync](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/Folder%20Sync.js)
60. [Saleen/KeyboardExt](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/KeyboardExt.js)
61. [Saleen/ScanFs](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/ScanFs.js)
62. [Saleen/Tasks Manager](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/Tasks%20Manager.js)
63. [Saleen/Video Manager](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/Video%20Manager.js)
64. [Saleen/WebDownloader](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Saleen/WebDownloader.js)
65. [SoftEtherVPN](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/SoftEtherVPN.js)
66. [Stardock/Start8](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Stardock/Start8.js)
67. [Trillian](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Trillian.js)
68. [TVDownloader](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/TVDownloader.js)
69. [Twitch](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Twitch.js)
70. [VSO Software/Free Media Player](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/VSO%20Software/Free%20Media%20Player.js)
71. [Vuze](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/Vuze.js)
72. [WinCDEmu](https://github.com/dodying/software-for-softwareUpdateManager/blob/master/software/WinCDEmu.js)

