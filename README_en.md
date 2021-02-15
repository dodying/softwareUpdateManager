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
6. `node index.js`

##### Other

1. 以下软件, 如果`通常版(installer)`与`便携版(portable)`功能相同则一般以绿色版优先(如果安装版的包小许多, 则可能以安装版优先), 同时64位优先
2. 大多软件都支持自动安装
3. 带 :money_with_wings: 的为**商业软件** (包括Freemium与Free Persion),  带 :airplane: 的需**番羽土墙**,  带 :hand: 的需**手动下载/安装**,  带 :pushpin: 的表示**安装目录固定**
4. 代理优先级(前提是设置了代理): `config.urlWithoutProxy > config.urlWithProxy > config.useProxy > software.useProxy`
5. 模式优先级: `config.specialMode > config.mode = config.commercialSoftware`
6. 安装方法并没有一一测试, 如果自动安装失败, 请尝试手动安装
7. 如果你想安装同个软件到多个地方，请在`config.js`中编辑`profile`，并使用`node index --profile`


#### TODO


#### Software Example

Refer to [Vivaldi](software/Vivaldi.js)

#### Supported Search Site

1. FileHorse
2. Pc6
3. Softpedia


#### Supported Software

Refer to [SupportedSoftwares.md](SupportedSoftwares.md)

#### Special Software

###### Special Installer

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


###### Without Download

1. [天若OCR](software/_list/list-for-%25.js)
2. [微PE工具箱](software/_list/list-for-%25.js)
3. [Enigma Virtual Box unpacker](software/_list/list-for-E.js)
4. [Jvedio](software/_list/list-for-J.js)
5. [PixivBiu](software/_list/list-for-P.js)
6. [Universal Extractor mod by koros aka ya158](software/_list/list-for-U.js)


###### Without Installer

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

